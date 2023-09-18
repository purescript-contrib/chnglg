module UpChangelog.Command.Update where

import Prelude

import Control.Alt ((<|>))
import Control.Apply (lift2)
import Control.Monad.Reader (ask)
import Data.Argonaut.Decode (decodeJson, parseJson, printJsonDecodeError)
import Data.Array as Array
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NEA
import Data.Either (Either(..), either, hush)
import Data.Filterable (partitionMap)
import Data.Formatter.DateTime (unformat)
import Data.Int as Int
import Data.Maybe (Maybe(..), isJust, maybe)
import Data.Newtype (unwrap)
import Data.Nullable as Nullable
import Data.RFC3339String.Format (iso8601Format)
import Data.Semigroup.Foldable (fold1)
import Data.String (Pattern(..), toLower)
import Data.String as String
import Data.String.CodeUnits as SCU
import Data.Traversable (fold, for, traverse)
import Data.Traversable as Foldable
import Data.Tuple (Tuple(..))
import Data.Version (Version, showVersion)
import Data.Version as Version
import Effect.Aff.Class (liftAff)
import Fetch as Fetch
import Foreign (unsafeFromForeign)
import Node.Path (sep)
import Node.Path as Path
import Parsing (runParser)
import Parsing.Combinators.Array (many1)
import Parsing.String (satisfy, string)
import UpChangelog.App (App, die, logDebug, logInfo, pathExists, readDir, readTextFile, withApp, writeTextFile)
import UpChangelog.Constants as Constants
import UpChangelog.Git (git)
import UpChangelog.Types (ChangelogEntry(..), CommitType(..), GHOwnerRepo, UpdateArgs, VersionSource(..))
import UpChangelog.Utils (breakOn, breakOnEnd, breakOnSpace, commaSeparate, lines, toUtcDate)

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

  breaks <- processEntriesStartingWith "breaking" entries
  features <- processEntriesStartingWith "feature" entries
  fixes <- processEntriesStartingWith "fix" entries
  internal <- processEntriesStartingWith "internal" entries
  misc <- processEntriesStartingWith "misc" entries

  let entryFiles = (_.file <<< unwrap) <$> breaks <> features <> fixes <> internal <> misc
  if (Array.null entryFiles) then do
    die $ "Cannot update changelog file as there aren't any valid entries in '" <> changelogDir <> "'."
  else do
    changes <- git "status" $ [ "-s", "--" ] <> Array.cons changelogFile entryFiles
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
    void $ git "rm" entryFiles
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
  { left: otherCommitHashes, right: mainCommits } <- do
    -- 2c78eb614cb1f3556737900e57d0e7395158791e,2021-11-17T13:27:33-08:00,Title of PR (#4121),parentHash1 parentHash2 ... parentHashN
    result <- git "log" [ "-m", "--follow", "--format=%H,%cI,%s,%P", file ]
    let lns = lines $ result.stdout
    logDebug $ "For file, '" <> file <> "', got commits:\n" <> String.joinWith "\n" lns
    map (partitionMap identity <<< Array.catMaybes) $ for lns \str -> case String.split (Pattern ",") str of
      [ hash, dateTimeStr, subject, parentHashes ] -> do
        let
          mbCommitInfo = do
            str' <- Nullable.toMaybe $ toUtcDate dateTimeStr
            time <- hush $ unformat iso8601Format str'
            parents <- NEA.fromArray $ String.split (Pattern " ") parentHashes
            pure { time, parents }
        mbCommitInfo # maybe (pure Nothing) \{ time, parents } ->
          case parsePRNumber subject of
            Nothing -> do
              pure $ Just $ Left hash
            Just (Tuple commitType pr) -> do
              let glc = { hash, time, pr, parents, commitType }
              case commitType of
                MergeCommit ->
                  pure $ Just $ Right glc
                SquashCommit -> do
                  interesting <- isInterestingSquashCommit glc
                  pure if interesting then Just $ Right glc else Nothing
      _ ->
        pure Nothing

  let
    { left: mergeCommits, right: squashCommits } = mainCommits # partitionMap \r -> case r.commitType of
      MergeCommit -> Left r
      SquashCommit -> Right r

    validMergeCommits = Array.filter (_.parents >>> NEA.any (flip Array.elem otherCommitHashes)) mergeCommits
  relevantCommitsForFile <- case NEA.fromArray $ Array.sortWith _.time $ squashCommits <> validMergeCommits of
    Nothing -> die $ "No relevant commits found for file: " <> file
    Just a -> pure a

  let prNumbers = map _.pr relevantCommitsForFile
  logDebug $ "For file, '" <> file <> "', got PR Numbers:" <> show prNumbers

  prAuthors <- getPrAuthors prNumbers

  logDebug $ "Reading content of file entry: " <> file
  { before: header, after: body } <- map (breakOn (Pattern "\n") <<< String.trim) $ (readTextFile <<< Path.normalize) file

  let
    headerSuffix =
      " ("
        <> commaSeparate (map ((append "#") <<< show) prNumbers)
        <> " by "
        <> commaSeparate (map (append "@") prAuthors)
        <> ")"

  pure $ ChangelogEntry
    { file
    , content: header <> headerSuffix <> body <> "\n"
    , date: _.time $ NEA.head relevantCommitsForFile
    }

parsePRNumber :: String -> Maybe (Tuple CommitType Int)
parsePRNumber = lift2 (<|>) parseMerge parseSquash
  where
  parseMerge s = do
    res <- String.stripPrefix (Pattern "Merge pull request #") s
    map (Tuple MergeCommit) $ Int.fromString $ _.before $ breakOnSpace res

  parseSquash s = do
    let
      res = _.before
        $ breakOn (Pattern ")")
        $ String.drop 2 -- (#
        $ _.after
        $ breakOnEnd (Pattern "(#") s
    map (Tuple SquashCommit) $ Int.fromString res

-- | This function helps us exclude PRs that are just fixups of changelog
-- | wording. An interesting commit is one that has either edited a file that
-- | isn't part of the changelog, or is a merge commit.
isInterestingSquashCommit :: forall r. { hash :: String | r } -> App (cli :: UpdateArgs) Boolean
isInterestingSquashCommit r = do
  { stdout } <- git "show" [ "--format=", "--name-only", r.hash ]
  pure
    $ not
    $ Array.all (\path -> "CHANGELOG.md" == path || (isJust $ String.stripPrefix (Pattern "CHANGELOG.d/") path))
    $ lines stdout

getPrAuthors :: NonEmptyArray Int -> App (cli :: UpdateArgs) (NonEmptyArray String)
getPrAuthors prNumbers = do
  { cli: { github, mbToken } } <- ask
  gh <- case github of
    Left remoteName -> do
      findRemote remoteName
    Right repo -> do
      pure repo
  let
    lookupPRAuthor' = withApp (\r -> { logger: r.logger, gh, mbToken }) <<< lookupPRAuthor
  NEA.nub <$> traverse lookupPRAuthor' prNumbers
  where
  findRemote name = do
    remotes <- map (lines <<< _.stdout) $ git "remote" [ "-v" ]
    logDebug $ "Git remotes are:\n" <> String.joinWith "\n" remotes
    case Array.findMap (String.stripPrefix (Pattern name)) remotes of
      Nothing -> do
        die $ "Did not find a remote named '" <> name <> "'. Available remote names are: " <> show (Array.nub remotes)
      Just url -> do
        case runParser (String.trim url) remoteRepoParser of
          Left e -> do
            die $ String.joinWith " "
              [ "Found remote, but could not determine its repo."
              , " While trying to parse, '" <> url <> "',"
              , " parser error was: " <> show e
              ]
          Right a -> pure a

  remoteRepoParser = sshParser <|> httpsParser
    where
    -- git@github.com:purescript-contrib/purescript-up-changelog.git (fetch)
    sshParser = do
      void $ string "git@github.com:"
      owner <- map fold1 $ many1 $ map SCU.singleton $ satisfy (\c -> c /= '/')
      void $ satisfy (\c -> c == '/')
      repo <- map fold1 $ many1 $ map SCU.singleton $ satisfy (\c -> c /= '.')
      void $ string ".git"
      pure { owner, repo }

    -- GitHub website: https://github.com/purescript-contrib/purescript-up-changelog.git
    -- Github Actions: https://github.com/purescript-contrib/purescript-up-changelog (fetch)
    httpsParser = do
      void $ string "https://github.com/"
      owner <- map fold $ many1 $ map SCU.singleton $ satisfy (\c -> c /= '/')
      void $ satisfy (\c -> c == '/')
      repo <- map fold $ many1 $ map SCU.singleton $ satisfy (\c -> c /= '.' && c /= ' ')
      pure { owner, repo }

lookupPRAuthor :: Int -> App (gh :: GHOwnerRepo, mbToken :: Maybe String) String
lookupPRAuthor prNum = do
  { gh, mbToken } <- ask
  let url = "https://api.github.com/repos/" <> gh.owner <> "/" <> gh.repo <> "/pulls/" <> show prNum
  logDebug $ "Sending GET request to: " <> url
  resp <- liftAff case mbToken of
    Just tok ->
      Fetch.fetch url
        { headers:
            { "Accept": "application/vnd.github.v3+json"
            , "Authorization": "token" <> tok
            }
        }
    Nothing ->
      Fetch.fetch url
        { headers:
            { "Accept": "application/vnd.github.v3+json"
            }
        }
  logDebug $ "Got response: " <> show resp.status <> " " <> show resp.statusText
  unless (resp.status == 200) $ die $ "Lookup PR author failed. " <> show resp.status <> " " <> show resp.statusText
  j <- liftAff resp.json
  case decodeJson $ unsafeFromForeign j of
    Left e -> do
      die $ "Error in lookupPRAuthor: " <> printJsonDecodeError e
    Right (rec :: { user :: { login :: String } }) -> do
      pure rec.user.login

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
