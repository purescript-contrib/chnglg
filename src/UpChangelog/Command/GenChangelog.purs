module UpChangelog.Command.GenChangelog where

import Prelude

import Affjax (defaultRequest, printError)
import Affjax as Affjax
import Affjax.RequestHeader (RequestHeader(..))
import Affjax.ResponseFormat as ARF
import Affjax.StatusCode (StatusCode(..))
import Control.Alt ((<|>))
import Control.Apply (lift2)
import Data.Argonaut.Decode (decodeJson, parseJson, printJsonDecodeError)
import Data.Array as Array
import Data.Array.NonEmpty as NEA
import Data.Either (Either(..), either, hush)
import Data.Formatter.DateTime (unformat)
import Data.HTTP.Method (Method(..))
import Data.Int as Int
import Data.Maybe (Maybe(..), isJust)
import Data.MediaType (MediaType(..))
import Data.Newtype (over, unwrap)
import Data.Nullable as Nullable
import Data.RFC3339String.Format (iso8601Format)
import Data.String (Pattern(..), toLower)
import Data.String as String
import Data.Traversable (for, traverse)
import Data.Traversable as Foldable
import Data.Tuple (Tuple(..), fst, snd)
import Data.Version (Version, showVersion)
import Data.Version as Version
import Effect.Aff (Aff)
import Effect.Aff.Class (liftAff)
import Effect.Class (liftEffect)
import Effect.Exception (throw)
import Node.Encoding (Encoding(..))
import Node.FS.Aff as FSA
import Node.Path (sep)
import Node.Path as Path
import Node.Process as Process
import Partial.Unsafe (unsafeCrashWith)
import UpChangelog.Constants as Constants
import UpChangelog.Git (git)
import UpChangelog.Types (ChangelogEntry(..), CommitType(..), GHOwnerRepo, GenChangelogArgs(..), GitLogCommit(..), VersionSource(..))
import UpChangelog.Utils (breakOn, breakOnEnd, breakOnSpace, lines, toUtcDate, wrapQuotes)

genChangelog :: GenChangelogArgs -> Aff Unit
genChangelog (GenChangelogArgs { github, versionSource }) = do
  git "rev-parse" [ "--show-toplevel" ] >>= liftEffect <<< Process.chdir <<< String.trim <<< _.stdout
  entries <- (lines <<< _.stdout) <$> git "ls-tree" [ "--name-only", "HEAD", Constants.changelogDir <> sep ]

  let processEntriesStartingWith' = processEntriesStartingWith github

  breaks <- processEntriesStartingWith' "break" entries
  features <- processEntriesStartingWith' "feat" entries
  fixes <- processEntriesStartingWith' "fix" entries
  internal <- processEntriesStartingWith' "int" entries
  misc <- processEntriesStartingWith' "misc" entries

  let entryFiles = (_.file <<< unwrap) <$> breaks <> features <> fixes <> internal <> misc
  if (Array.null entryFiles) then do
    liftEffect $ throw $ "Cannot update changelog file as there aren't any valid entries in '" <> Constants.changelogDir <> "'."
  else do

    changes <- git "status" $ [ "-s", "--" ] <> (map wrapQuotes $ Array.cons Constants.changelogFile entryFiles)
    unless (changes.stdout == "") $ liftEffect $ throw $
      "You have uncommitted changes to changelog files. " <>
        "Please commit, stash, or revert them before running this script."

    version <- getVersion versionSource
    { before: changelogPreamble
    , after: changelogRest
    } <- breakOn (Pattern "\n## ") <$> FSA.readTextFile UTF8 Constants.changelogFile
    FSA.writeTextFile UTF8 Constants.changelogFile $
      changelogPreamble
        <> "\n## "
        <> version
        <> "\n"
        <> conditionalSection "Breaking changes" breaks
        <> conditionalSection "New features" features
        <> conditionalSection "Bugfixes" fixes
        <> conditionalSection "Other improvements" misc
        <> conditionalSection "Internal" internal
        <> changelogRest

    void $ git "add" [ Constants.changelogFile ]
    void $ git "rm" $ Array.cons "-q" $ map wrapQuotes entryFiles

processEntriesStartingWith :: GHOwnerRepo -> String -> Array String -> Aff (Array ChangelogEntry)
processEntriesStartingWith ownerRepo prefix =
  map (Array.sortWith (_.date <<< unwrap))
    <<< traverse (updateEntry ownerRepo)
    <<< Array.filter ((isJust <<< String.stripPrefix (Pattern prefix)) <<< toLower <<< Path.basename)

updateEntry :: GHOwnerRepo -> String -> Aff ChangelogEntry
updateEntry ownerRepo file = do
  { before: header, after: body } <- map (breakOnSpace <<< String.trim) $ (FSA.readTextFile UTF8 <<< Path.normalize) file

  allCommits <- do
    -- 2c78eb614cb1f3556737900e57d0e7395158791e 2021-11-17T13:27:33-08:00 Title of PR (#4121)
    lns <- map (lines <<< _.stdout) $ git "log" [ "-m", "--follow", "--format=\"%H %cI %s\"", wrapQuotes file ]
    mbRes <- for lns \str -> do
      let
        { before: hash, after: spaceRemaining } = breakOnSpace str
        { before: dateTime, after: spaceData } = breakOnSpace $ String.drop 1 spaceRemaining
      let
        mbTime = do
          str' <- Nullable.toMaybe $ toUtcDate dateTime
          hush $ unformat iso8601Format str'
      pure $ mbTime <#> \time -> GitLogCommit
        { data: String.drop 1 spaceData
        , hash
        , time
        }
    case NEA.fromArray $ Array.sortWith (_.time <<< unwrap) $ Array.catMaybes mbRes of
      Nothing -> do
        liftEffect $ throw $ "No commits for file: " <> file
      Just x -> do
        pure x

  prCommits <- map Array.catMaybes $ for (NEA.toArray allCommits) \glc -> do
    case parsePRNumber (_.data $ unwrap glc) of
      Nothing -> do
        pure Nothing
      Just pr -> do
        let
          withPr :: GitLogCommit String -> GitLogCommit (Tuple CommitType Int)
          withPr = over GitLogCommit (_ { data = pr })

          glcWithPr = withPr glc
        interesting <- isInterestingCommit glcWithPr
        pure if interesting then Just glcWithPr else Nothing

  let prNumbers = map (snd <<< _.data <<< unwrap) prCommits

  prAuthors <- Array.nub <$> traverse (lookupPRAuthor ownerRepo) prNumbers

  let
    headerSuffix =
      if Array.null prNumbers then ""
      else
        " ("
          <> commaSeparate (map ((append "#") <<< show) prNumbers)
          <> " by "
          <> commaSeparate (map (append "@") prAuthors)
          <> ")"

  pure $ ChangelogEntry
    { file
    , content: header <> headerSuffix <> body <> "\n"
    , date: (_.time <<< unwrap) $ NEA.head allCommits
    }

parsePRNumber :: String -> Maybe (Tuple CommitType Int)
parsePRNumber = lift2 (<|>) parseMerge parseSquash
  where
  parseMerge s = do
    res <- String.stripPrefix (Pattern "Merge pull request #") s
    map (Tuple MergeCommit) $ Int.fromString $ _.before $ breakOnSpace res

  parseSquash s = do
    res <- String.stripSuffix (Pattern ")")
      $ String.drop 2 -- (#
      $ _.after
      $ breakOnEnd (Pattern "(#") s
    map (Tuple SquashCommit) $ Int.fromString res

-- | This function helps us exclude PRs that are just fixups of changelog
-- | wording. An interesting commit is one that has either edited a file that
-- | isn't part of the changelog, or is a merge commit.
isInterestingCommit :: GitLogCommit (Tuple CommitType Int) -> Aff Boolean
isInterestingCommit (GitLogCommit r) = case fst r.data of
  MergeCommit -> do
    pure true
  SquashCommit -> do
    { stdout } <- git "show" [ "--format=", "--name-only", r.hash ]
    pure
      $ not
      $ Array.all (\path -> "CHANGELOG.md" == path || (isJust $ String.stripPrefix (Pattern "CHANGELOG.d/") path))
      $ lines stdout

lookupPRAuthor :: GHOwnerRepo -> Int -> Aff String
lookupPRAuthor gh prNum = do
  resp <- Affjax.request $ defaultRequest
    { url = "https://api.github.com/repos/" <> gh.owner <> "/" <> gh.repo <> "/pulls/" <> show prNum
    , responseFormat = ARF.json
    , method = Left GET
    , headers =
        [ Accept $ MediaType "application/vnd.github.v3+json" ]
    }
  case resp of
    Left err -> liftEffect $ throw $ printError err
    Right js | js.status == StatusCode 200 -> do
      case decodeJson js.body of
        Left e -> do
          liftEffect $ throw $ "Error in lookupPRAuthor: " <> printJsonDecodeError e
        Right (rec :: { user :: { login :: String } }) -> do
          pure rec.user.login
    Right js -> do
      liftEffect $ throw $ "Lookup PR author failed. " <> show js.status <> " " <> show js.statusText

commaSeparate :: Array String -> String
commaSeparate = case _ of
  [] -> ""
  [ a ] -> a
  [ a, b ] -> a <> " and " <> b
  more
    | Just { init, last } <- Array.unsnoc more -> String.joinWith ", " init <> ", and " <> last
    | otherwise -> unsafeCrashWith "This is not possible"

getVersion :: VersionSource -> Aff String
getVersion = case _ of
  PackageJson packageJsonPath -> do
    unlessM (FSA.exists packageJsonPath) do
      liftEffect $ throw
        $ "`package.json` file was not found using path '" <> packageJsonPath <> "'. Cannot use it to get the version."
    content <- liftAff $ FSA.readTextFile UTF8 packageJsonPath
    case parseJson content >>= decodeJson of
      Left e -> do
        liftEffect $ throw $ "Error in getVersion: " <> printJsonDecodeError e
      Right (rec :: { version :: String }) -> do
        pure rec.version
  ExplicitVersion version -> do
    pure $ showVersion version
  FromGitTag -> do
    mbVersion <- getVersionFromGitTag
    case mbVersion of
      Nothing -> do
        liftEffect $ throw $ "Error in getVersion for `FromGitTag` case: did not get a tag. Is HEAD pointing to a tag?"
      Just version -> do
        pure version
  Cabal filePath -> do
    unlessM (FSA.exists filePath) do
      liftEffect $ throw
        $ "A `*.cabal` file was not found using path '" <> filePath <> "'. Cannot use it to get the version."
    content <- liftAff $ FSA.readTextFile UTF8 filePath
    case Array.findMap (String.stripPrefix (Pattern "version:")) $ lines content of
      Nothing -> do
        liftEffect $ throw $ "Error in getVersion for `Cabal` case: did not find a line with content: `version: <versionString>`."
      Just versionStr -> do
        pure $ String.trim versionStr

  where
  -- | Get the version tag pointing to the currently checked out commit, if any.
  -- | The tag must start with a "v" and be followed by a valid semver version,
  -- | for example "v1.2.3".
  -- |
  -- | If multiple tags point to the checked out commit, return the latest
  -- | version according to semver version comparison.
  getVersionFromGitTag :: Aff (Maybe String)
  getVersionFromGitTag = do
    output <- git "tag" [ "--points-at", "HEAD" ]
    pure $ map Version.showVersion $ maxVersion output.stdout
    where
    maxVersion :: String -> Maybe Version
    maxVersion =
      lines
        >>> Array.mapMaybe (String.trim >>> parseMay)
        >>> Foldable.maximum

    parseMay str =
      either (const Nothing) Just
        $ Version.parseVersion
        $ _.after
        $ breakOn (Pattern "v") str

conditionalSection :: String -> Array ChangelogEntry -> String
conditionalSection header = case _ of
  [] -> ""
  entries ->
    "\n" <> header <> ":\n\n" <> String.joinWith "\n" (map (_.content <<< unwrap) entries)
