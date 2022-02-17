module UpChangelog.Command.Update where

import Prelude

import Affjax (defaultRequest, printError)
import Affjax as Affjax
import Affjax.RequestHeader (RequestHeader(..))
import Affjax.ResponseFormat as ARF
import Affjax.StatusCode (StatusCode(..))
import Control.Alt ((<|>))
import Control.Apply (lift2)
import Control.Monad.Reader (ask)
import Data.Argonaut.Decode (decodeJson, parseJson, printJsonDecodeError)
import Data.Array as Array
import Data.Array.NonEmpty as NEA
import Data.Either (Either(..), either, hush)
import Data.Formatter.DateTime (unformat)
import Data.HTTP.Method (Method(..))
import Data.Int as Int
import Data.Maybe (Maybe(..), fromMaybe, isJust)
import Data.MediaType (MediaType(..))
import Data.Newtype (over, unwrap)
import Data.Nullable as Nullable
import Data.RFC3339String.Format (iso8601Format)
import Data.String (Pattern(..), toLower)
import Data.String as String
import Data.Traversable (for, for_, traverse)
import Data.Traversable as Foldable
import Data.Tuple (Tuple(..), fst, snd)
import Data.Version (Version, showVersion)
import Data.Version as Version
import Effect.Aff.Class (liftAff)
import Node.Path (sep)
import Node.Path as Path
import UpChangelog.App (App, die, logDebug, logInfo, pathExists, readDir, readTextFile, writeTextFile)
import UpChangelog.Constants as Constants
import UpChangelog.Git (git)
import UpChangelog.Types (ChangelogEntry(..), CommitType(..), GitLogCommit(..), UpdateArgs, VersionSource(..))
import UpChangelog.Utils (breakOn, breakOnEnd, breakOnSpace, commaSeparate, lines, toUtcDate, wrapQuotes)

update :: App (cli :: UpdateArgs) Unit
update = do
  checkFilePaths
  { cli: { changelogDir, changelogFile } } <- ask
  entries' <- (lines <<< _.stdout) <$> git "ls-tree" [ "--name-only", "HEAD", changelogDir <> sep ]
  let
    readmeFile = Path.concat [ changelogDir, Constants.readmeFile ]
    entries = entries'
      # Array.filter \str -> do
          let s = String.trim str
          s /= "" || s /= readmeFile
  logInfo $ "# of entries found in changelog: " <> (show $ Array.length entries)
  logDebug $ "Entries found in changelog dir were:\n" <> String.joinWith "\n" entries

  breaks <- processEntriesStartingWith "break" entries
  features <- processEntriesStartingWith "feat" entries
  fixes <- processEntriesStartingWith "fix" entries
  internal <- processEntriesStartingWith "int" entries
  misc <- processEntriesStartingWith "misc" entries

  let entryFiles = (_.file <<< unwrap) <$> breaks <> features <> fixes <> internal <> misc
  if (Array.null entryFiles) then do
    die $ "Cannot update changelog file as there aren't any valid entries in '" <> changelogDir <> "'."
  else do
    changes <- git "status" $ [ "-s", "--" ] <> (map wrapQuotes $ Array.cons changelogFile entryFiles)
    unless (changes.stdout == "") $ die $
      "You have uncommitted changes to changelog files. " <>
        "Please commit, stash, or revert them before running this script."

    version <- getVersion
    { before: changelogPreamble
    , after: changelogRest
    } <- breakOn (Pattern "\n## ") <$> readTextFile changelogFile
    logDebug $ "Changelog preamble is: \n" <> changelogPreamble
    writeTextFile changelogFile $
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
    logInfo $ "Updated changelog file"

    void $ git "add" [ changelogFile ]
    logDebug $ "Staged changelog file in git"
    void $ git "rm" $ map wrapQuotes entryFiles
    logDebug $ "Staged the deletion of the changelog entry files in git"
  where
  checkFilePaths = do
    { cli: options } <- ask
    ifM (pathExists options.changelogDir)
      do
        logDebug $ "Attempting to read changelog dir: " <> options.changelogDir
        entries <- readDir options.changelogDir
        when (Array.null $ Array.filter (notEq Constants.readmeFile) entries) do
          die $ String.joinWith " "
            [ "Cannot update changelog file as there are no"
            , "changelog entry files in '"
            , options.changelogDir <> "'."
            ]
      do
        die $ "Cannot update changelog file as changelog directory, '" <> options.changelogDir <> "', does not exist."

processEntriesStartingWith :: String -> Array String -> App (cli :: UpdateArgs) (Array ChangelogEntry)
processEntriesStartingWith prefix arr = do
  logInfo $ "Processing entries for prefix: " <> prefix
  map (Array.sortWith (_.date <<< unwrap))
    $ traverse updateEntry
    $ Array.filter
        ((isJust <<< String.stripPrefix (Pattern prefix)) <<< toLower <<< Path.basename)
        arr

updateEntry :: String -> App (cli :: UpdateArgs) ChangelogEntry
updateEntry file = do
  logDebug $ "Reading content of file entry: " <> file
  { before: header, after: body } <- map (breakOn (Pattern "\n") <<< String.trim) $ (readTextFile <<< Path.normalize) file

  allCommits <- do
    -- 2c78eb614cb1f3556737900e57d0e7395158791e 2021-11-17T13:27:33-08:00 Title of PR (#4121)
    lns <- map (lines <<< _.stdout) $ git "log" [ "-m", "--follow", "--format=\"%H %cI %s\"", wrapQuotes file ]
    logDebug $ "For file, '" <> file <> "', got commits:\n" <> String.joinWith "\n" lns
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
        die $ "No commits for file: " <> file
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
  logDebug $ "For file, '" <> file <> "', got PR Numbers:" <> show prNumbers

  prAuthors <- Array.nub <$> traverse lookupPRAuthor prNumbers

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
isInterestingCommit :: GitLogCommit (Tuple CommitType Int) -> App (cli :: UpdateArgs) Boolean
isInterestingCommit (GitLogCommit r) = case fst r.data of
  MergeCommit -> do
    pure true
  SquashCommit -> do
    { stdout } <- git "show" [ "--format=", "--name-only", r.hash ]
    pure
      $ not
      $ Array.all (\path -> "CHANGELOG.md" == path || (isJust $ String.stripPrefix (Pattern "CHANGELOG.d/") path))
      $ lines stdout

lookupPRAuthor :: Int -> App (cli :: UpdateArgs) String
lookupPRAuthor prNum = do
  { cli: { github: gh, mbToken } } <- ask
  let
    url = "https://api.github.com/repos/" <> gh.owner <> "/" <> gh.repo <> "/pulls/" <> show prNum
    headers = [ Accept $ MediaType "application/vnd.github.v3+json" ]
  logDebug $ "Sending GET request to: " <> url
  resp <- liftAff $ Affjax.request $ defaultRequest
    { url = url
    , responseFormat = ARF.json
    , method = Left GET
    , headers = fromMaybe headers do
        tok <- mbToken
        pure $ Array.snoc headers $ RequestHeader "Authorization" $ "token" <> tok
    }
  for_ resp \js -> do
    logDebug $ "Got response: " <> show js.status <> " " <> show js.statusText
  case resp of
    Left err -> die $ printError err
    Right js | js.status == StatusCode 200 -> do
      case decodeJson js.body of
        Left e -> do
          die $ "Error in lookupPRAuthor: " <> printJsonDecodeError e
        Right (rec :: { user :: { login :: String } }) -> do
          pure rec.user.login
    Right js -> do
      die $ "Lookup PR author failed. " <> show js.status <> " " <> show js.statusText

getVersion :: App (cli :: UpdateArgs) String
getVersion = do
  { cli: { versionSource } } <- ask
  case versionSource of
    PackageJson packageJsonPath -> do
      unlessM (pathExists packageJsonPath) do
        die $ "`package.json` file was not found using path '" <> packageJsonPath <> "'. Cannot use it to get the version."
      content <- readTextFile packageJsonPath
      case parseJson content >>= decodeJson of
        Left e -> do
          die $ "Error in getVersion: " <> printJsonDecodeError e
        Right (rec :: { version :: String }) -> do
          pure rec.version
    ExplicitVersion version -> do
      pure $ showVersion version
    FromGitTag -> do
      mbVersion <- getVersionFromGitTag
      case mbVersion of
        Nothing -> do
          die $ "Error in getVersion for `FromGitTag` case: did not get a tag. Is HEAD pointing to a tag?"
        Just version -> do
          pure version
    Cabal filePath -> do
      unlessM (pathExists filePath) do
        die $ "A `*.cabal` file was not found using path '" <> filePath <> "'. Cannot use it to get the version."
      content <- readTextFile filePath
      case Array.findMap (String.stripPrefix (Pattern "version:")) $ lines content of
        Nothing -> do
          die $ "Error in getVersion for `Cabal` case: did not find a line with content: `version: <versionString>`."
        Just versionStr -> do
          pure $ String.trim versionStr

  where
  -- | Get the version tag pointing to the currently checked out commit, if any.
  -- | The tag must start with a "v" and be followed by a valid semver version,
  -- | for example "v1.2.3".
  -- |
  -- | If multiple tags point to the checked out commit, return the latest
  -- | version according to semver version comparison.
  getVersionFromGitTag :: App (cli :: UpdateArgs) (Maybe String)
  getVersionFromGitTag = do
    output <- git "tag" [ "--points-at", "HEAD" ]
    logDebug $ "`git tag` output was: " <> show output
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
