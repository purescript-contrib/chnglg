module Main where

import Prelude

import Affjax (defaultRequest, printError)
import Affjax as Affjax
import Affjax.RequestHeader (RequestHeader(..))
import Affjax.ResponseFormat as ARF
import Affjax.StatusCode (StatusCode(..))
import Control.Alt ((<|>))
import Control.Apply (lift2)
import Data.Argonaut.Decode (class DecodeJson, decodeJson, parseJson, printJsonDecodeError)
import Data.Array as Array
import Data.Array.NonEmpty as NEA
import Data.DateTime (DateTime)
import Data.Either (Either(..), either, hush)
import Data.Formatter.DateTime (unformat)
import Data.HTTP.Method (Method(..))
import Data.Int as Int
import Data.Maybe (Maybe(..), isJust, maybe)
import Data.MediaType (MediaType(..))
import Data.Newtype (class Newtype, over, unwrap)
import Data.Nullable (Nullable)
import Data.Nullable as Nullable
import Data.Posix.Signal (Signal(..))
import Data.RFC3339String.Format (iso8601Format)
import Data.String (Pattern(..), Replacement(..), toLower)
import Data.String as String
import Data.Traversable (for, traverse)
import Data.Tuple (Tuple(..), fst, snd)
import Debug (spy)
import Effect (Effect)
import Effect.Aff (Aff, effectCanceler, launchAff_, makeAff)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (throw)
import Foreign.Object as FO
import Node.Buffer as Buffer
import Node.ChildProcess (ExecOptions, defaultExecOptions)
import Node.ChildProcess as ChildProcess
import Node.Encoding (Encoding(..))
import Node.FS.Aff as FSA
import Node.Path (FilePath)
import Node.Path as Path
import Node.Process as Process
import Partial.Unsafe (unsafeCrashWith)

main :: Effect Unit
main = launchAff_ do
  git "rev-parse" [ "--show-toplevel" ] >>= liftEffect <<< Process.chdir <<< String.trim <<< _.stdout
  entries <- (lines <<< _.stdout) <$> git "ls-tree" [ "--name-only", "HEAD", "CHANGELOG.d/" ]
  log $ "Entries are: " <> show entries

  let processEntriesStartingWith' = processEntriesStartingWith "purescript" "purescript"

  breaks <- processEntriesStartingWith' "break" entries
  features <- processEntriesStartingWith' "feat" entries
  fixes <- processEntriesStartingWith' "fix" entries
  internal <- processEntriesStartingWith' "int" entries
  misc <- processEntriesStartingWith' "misc" entries

  let entryFiles = (_.file <<< unwrap) <$> breaks <> features <> fixes <> internal <> misc
  unless (Array.null entryFiles) $ do

    -- changes <- map (lines <<< _.stdout) $ git "status" $ [ "-s", "--", "CHANGELOG.md" ] <> entryFiles
    -- unless (Array.null changes) $ liftEffect $ throw $
    --   "You have uncommitted changes to changelog files. " <>
    --     "Please commit, stash, or revert them before running this script."

    version <- getVersion
    { before: changelogPreamble, after: changelogRest } <- breakOn (Pattern "\n## ") <$> readFile "CHANGELOG.md"
    writeFile "CHANGELOG.md" $
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

    void $ git "add" [ "CHANGELOG.md" ]
    void $ git "rm" $ Array.cons "-q" $ map wrapQuotes entryFiles

processEntriesStartingWith :: String -> String -> String -> Array String -> Aff (Array ChangelogEntry)
processEntriesStartingWith owner repo prefix = map (Array.sortWith (_.date <<< unwrap))
  <<< traverse (updateEntry owner repo)
  <<< Array.filter ((isJust <<< String.stripPrefix (Pattern prefix)) <<< toLower <<< Path.basename)

updateEntry :: String -> String -> String -> Aff ChangelogEntry
updateEntry owner repo file = do
  { before: header, after: body } <- map (breakOn (Pattern "\n") <<< String.trim) $ (readFile <<< Path.normalize) file

  allCommits <- do
    -- 2c78eb614cb1f3556737900e57d0e7395158791e 2021-11-17T13:27:33-08:00 Title of PR (#4121)
    lns <- map (lines <<< _.stdout) $ git "log" [ "-m", "--follow", "--format=\"%H %cI %s\"", wrapQuotes file ]
    mbRes <- for lns \str -> do
      log $ "For file '" <> file <> "', got string: " <> str
      let
        { before: hash, after: b } = breakOn (Pattern " ") str
        { before: dateTime, after } = breakOn (Pattern " ") $ String.drop 1 b
      let
        mbTime = do
          str' <- Nullable.toMaybe $ toUtcDate dateTime
          hush $ unformat iso8601Format str'
      pure $ mbTime <#> \time -> GitLogCommit
        { data: String.drop 1 after
        , hash
        , time
        }
    case NEA.fromArray $ Array.sortWith (_.time <<< unwrap) $ Array.catMaybes mbRes of
      Nothing -> liftEffect $ throw $ "No commits for file: " <> file
      Just x -> pure x

  prCommits <- map Array.catMaybes $ for (NEA.toArray allCommits) \glc -> do
    case parsePRNumber (_.data $ unwrap glc) of
      Nothing -> pure Nothing
      Just x -> do
        let glcWithIntPr = over GitLogCommit (_ { data = x }) glc
        interesting <- isInterestingCommit glcWithIntPr
        pure if interesting then Just glcWithIntPr else Nothing

  let prNumbers = map (snd <<< _.data <<< unwrap) prCommits

  prAuthors <- Array.nub <$> traverse (lookupPRAuthor owner repo) prNumbers

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
    map (Tuple MergeCommit) $ Int.fromString $ _.before $ breakOn (Pattern " ") res

  parseSquash s = do
    res <- String.stripSuffix (Pattern ")") $ _.after $ breakOnEnd (Pattern "(#") s
    map (Tuple SquashCommit) $ Int.fromString res

-- |
-- This function helps us exclude PRs that are just fixups of changelog
-- wording. An interesting commit is one that has either edited a file that
-- isn't part of the changelog, or is a merge commit.
--
isInterestingCommit :: forall m. MonadAff m => GitLogCommit (Tuple CommitType Int) -> m Boolean
isInterestingCommit (GitLogCommit r) = case fst r.data of
  MergeCommit -> pure true
  SquashCommit -> do
    { stdout } <- git "show" [ "--format=", "--name-only", r.hash ]
    pure
      $ not
      $ Array.all (\path -> "CHANGELOG.md" == path || (isJust $ String.stripPrefix (Pattern "CHANGELOG.d/") path))
      $ lines stdout

lookupPRAuthor :: forall m. MonadAff m => String -> String -> Int -> m String
lookupPRAuthor owner repo prNum = do
  resp <- liftAff $ Affjax.request $ defaultRequest
    { url = "https://api.github.com/repos/" <> owner <> "/" <> repo <> "/pulls/" <> show prNum
    , responseFormat = ARF.json
    , method = Left GET
    , headers =
        [ Accept $ MediaType "application/vnd.github.v3+json" ]
    }
  case resp of
    Left err -> liftEffect $ throw $ printError err
    Right js | js.status == StatusCode 200 -> case decodeJson js.body of
      Left e -> liftEffect $ throw $ "Error in lookupPRAuthor: " <> printJsonDecodeError e
      Right (Author rec) -> pure rec.user.login
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

getVersion :: Aff String
getVersion = do
  unlessM (FSA.exists "npm-package/package.json") do
    liftEffect $ throw "`package.json` file not found. Cannot use it to get the version."
  content <- liftAff $ FSA.readTextFile UTF8 "npm-package/package.json"
  case parseJson content >>= spy "Version json" >>> decodeJson of
    Left e -> liftEffect $ throw $ "Error in getVersion: " <> printJsonDecodeError e
    Right (Version { version }) -> pure version

conditionalSection :: String -> Array ChangelogEntry -> String
conditionalSection header = case _ of
  [] -> ""
  entries ->
    "\n" <> header <> ":\n\n" <> String.joinWith "\n" (map (_.content <<< unwrap) entries)

git :: forall m. MonadAff m => String -> Array String -> m { stdout :: String, stderr :: String }
git cmd = liftAff <<< runCmd "git" <<< Array.cons cmd

readFile :: forall m. MonadAff m => FilePath -> m String
readFile = liftAff <<< FSA.readTextFile UTF8

writeFile :: forall m. MonadAff m => FilePath -> String -> m Unit
writeFile path = liftAff <<< FSA.writeTextFile UTF8 path

newtype ChangelogEntry = ChangelogEntry
  { file :: String
  , content :: String
  , date :: DateTime
  }

derive instance newtypeChangelogEntry :: Newtype ChangelogEntry _

newtype GitLogCommit a = GitLogCommit
  { data :: a
  , hash :: String
  , time :: DateTime
  }

derive instance newtypeGitLogCommit :: Newtype (GitLogCommit a) _

data CommitType
  = MergeCommit
  | SquashCommit

breakOn :: Pattern -> String -> { before :: String, after :: String }
breakOn ptn s = maybe { before: s, after: "" } (flip String.splitAt s) mbIdx
  where
  mbIdx = String.indexOf ptn s

breakOnEnd :: Pattern -> String -> { before :: String, after :: String }
breakOnEnd ptn s = maybe { before: "", after: s } (flip String.splitAt s) mbIdx
  where
  mbIdx = String.lastIndexOf ptn s

runCmd :: String -> Array String -> Aff { stdout :: String, stderr :: String }
runCmd = runCmd' (defaultExecOptions { cwd = Just "." })

runCmd' :: ExecOptions -> String -> Array String -> Aff { stdout :: String, stderr :: String }
runCmd' options cmd args = makeAff \cb -> do
  log $ "Running full command: [" <> fullCommand <> "]"
  proc <- ChildProcess.exec fullCommand options \res -> do
    stdout <- Buffer.toString UTF8 res.stdout
    stderr <- Buffer.toString UTF8 res.stderr
    when (stderr /= "") do
      log $ "Stderr: " <> stderr
    cb $ Right { stdout, stderr }
  pure $ effectCanceler do
    ChildProcess.kill SIGKILL proc
  where
  fullCommand = cmd <> " " <> String.joinWith " " args

lines :: String -> Array String
lines = String.split (Pattern "\n")

filterM :: forall m a. Monad m => (a -> m Boolean) -> Array a -> m (Array a)
filterM p arr = do
  map Array.catMaybes $ for arr \a -> do
    res <- p a
    pure if res then Just a else Nothing

wrapQuotes :: String -> String
wrapQuotes s = "\"" <> s <> "\""

foreign import toUtcDate :: String -> Nullable String

newtype Author = Author { user :: { login :: String } }

derive instance newtypeAuthor :: Newtype Author _
instance DecodeJson Author where
  decodeJson j = do
    rec <- decodeJson j
    pure $ Author rec

newtype Version = Version { version :: String }

derive instance newtypeVersion :: Newtype Version _
instance DecodeJson Version where
  decodeJson j = do
    rec <- decodeJson j
    pure $ Version rec