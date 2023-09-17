module Main where

import Prelude

import ArgParse.Basic as Arg
import Bin.Version (version)
import Data.Array as Array
import Data.Bifunctor (bimap)
import Data.Either (Either(..))
import Data.Maybe (isJust)
import Data.String (Pattern(..), contains, joinWith)
import Data.String as String
import Data.Tuple (Tuple(..))
import Data.Version as Version
import Effect (Effect)
import Effect.Aff (launchAff_, throwError)
import Effect.Console (log)
import Node.Path (sep)
import Node.Process as Process
import UpChangelog.App (runApp)
import UpChangelog.Command.Init (init)
import UpChangelog.Command.Update (update)
import UpChangelog.Constants as Constants
import UpChangelog.Types (InitArgs, Logger, LoggerType(..), UpdateArgs, VersionSource(..))
import UpChangelog.Utils (breakOn)

main :: Effect Unit
main = do
  args <- Array.drop 2 <$> Process.argv
  case parseCliArgs args of
    Left err -> do
      log $ Arg.printArgError err
      case err of
        Arg.ArgError _ Arg.ShowHelp ->
          Process.setExitCode 0
        Arg.ArgError _ (Arg.ShowInfo _) ->
          Process.setExitCode 0
        _ ->
          Process.setExitCode 1
    Right (Tuple logType cmd) -> do
      case cmd of
        Update options -> do
          launchAff_ $ runApp update { logger: mkLogger logType, cli: options }

        Init options -> do
          launchAff_ $ runApp init { logger: mkLogger logType, cli: options }

-- Per https://nodejs.org/dist/latest-v14.x/docs/api/process.html#process_process_exit_code
-- calling `process.exitCode = int;` is safer than calling
-- `process.exit(int)` because some asynchronous writes to console may still be buffering
-- but the latter will terminate before those writes finish
foreign import setExitCode :: Int -> Effect Unit

mkLogger :: LoggerType -> Logger Effect
mkLogger = case _ of
  None -> default
  Error -> default { logError = log }
  Info -> default { logError = log, logInfo = log }
  Debug -> { logError: log, logInfo: log, logDebug: log }
  where
  default :: Logger Effect
  default =
    { logError: const (pure unit)
    , logInfo: const (pure unit)
    , logDebug: const (pure unit)
    }

data Command
  = Init InitArgs
  | Update UpdateArgs

parseCliArgs :: Array String -> Either Arg.ArgError (Tuple LoggerType Command)
parseCliArgs = Arg.parseArgs
  "purs-changelog"
  ( String.joinWith "\n"
      [ "A CLI for updating the `CHANGELOG.md` file when making a new release."
      , ""
      , "Examples:"
      , "  purs-changelog init"
      , "  purs-changelog update --repo purescript/purescript-prelude"
      ]
  )
  cliParser

cliParser :: Arg.ArgParser (Tuple LoggerType Command)
cliParser =
  Tuple <$> (loggerArg # Arg.default Error)
    <*> cmdArg
  where
  loggerArg =
    Arg.choose "logger"
      [ quiet
      , info
      , debug
      ]
      <* Arg.flagHelp
    where
    quiet = None <$ Arg.flag [ "--quiet", "-q" ] "Hide all logging"
    info = Info <$ Arg.flag [ "--log-info" ] "Slightly increase logging output"
    debug = Debug <$ Arg.flag [ "--log-debug" ] "Output all logging output"

  cmdArg =
    Arg.choose "command"
      [ updateCommand
      , initCommand
      ]
      <* Arg.flagHelp
      <* Arg.flagInfo [ "--version", "-v" ] "Shows the current version" version

  updateCommand =
    Arg.command [ "update", "u" ] cmdDesc ado
      github <- githubRepoArg
      mbToken <- tokenArg
      versionSource <- versionSourceArg
      changelogFile <- changelogFileArg
      changelogDir <- changelogDirArg
      Arg.flagHelp
      in Update { github, versionSource, mbToken, changelogFile, changelogDir }
    where
    cmdDesc = joinWith "\n"
      [ "Updates the changelog file with a new releae entry based on files in the changelog directory"
      , ""
      , "Examples:"
      , "purs-changelog update --repo purescript/purescript-prelude"
      , "purs-changelog update --repo purescript/purescript --package-json npm-package/package.json"
      , "purs-changelog update --repo purescript/spago --cabal spago.cabal"
      , "purs-changelog update --repo owner/repo --from-git-tag"
      , "purs-changelog update --repo owner/repo --explicit-release v1.2.3"
      ]
    githubRepoArg =
      Arg.choose "repo"
        [ map Left remoteArg
        , map Right repoArg
        ]
        # Arg.default (Left Constants.gitRemoteName)
      where
      remoteArg = Arg.argument [ "--remote" ] desc
        # Arg.unformat "REMOTE_NAME" Right
        where
        desc = "The git remote name to use to determine the repo to use. (default: `" <> Constants.gitRemoteName <> "`)"
      repoArg = Arg.argument [ "--repo" ] desc
        # Arg.unformat "OWNER/REPO" validate
        where
        desc = "The Github repo in the `user/repo` format (e.g. `purescript/purescript-prelude`)."
        validate s = do
          let
            { before: owner, after: slashRepo } = breakOn (Pattern "/") s
            repo = String.drop 1 slashRepo
            check =
              [ repo == ""
              , contains (Pattern "/") repo
              ]

          when (Array.any identity check) do
            throwError $ "Expected 'OWNER/REPO' but got '" <> s <> "'"
          pure { owner, repo }

    tokenArg = Arg.optional
      $ Arg.argument [ "--token", "-t" ]
      $ String.joinWith " "
          [ "An optional GitHub OAuth2 token for authenticating API requests."
          , "The token does not need any permissions."
          , "This program works without one but will start failing once GitHub's rate limit is reached."
          ]

    versionSourceArg =
      Arg.choose "version"
        [ byPackageJson
        , byCabalFile
        , byGitTag
        , byExplicitVersion
        ]
        # Arg.default (PackageJson "package.json")
      where
      byPackageJson =
        Arg.argument [ "--package-json", "-j" ] desc
          # Arg.unformat "PACKAGE_JSON_FILE" validate
        where
        desc = "Uses the `package.json` file's `version` field for the version string in the header in the changelog file."
        validate s = do
          unless (isJust $ String.stripSuffix (Pattern "package.json") s) do
            throwError "File path did not end in `package.json`"
          pure $ PackageJson s
      byCabalFile =
        Arg.argument [ "--cabal", "-c" ] desc
          # Arg.unformat "CABAL_FILE" validate
        where
        desc = "Uses a `*.cabal` file's `version` field for the version string in the header in the changelog file."
        validate s = do
          unless (isJust $ String.stripSuffix (Pattern ".cabal") s) do
            throwError "File path did not end in `.cabal`"
          pure $ Cabal s
      byGitTag =
        Arg.argument [ "--from-git-tag", "-g" ] desc
          # Arg.unformat "CABAL_FILE" (const $ pure FromGitTag)
        where
        desc = "Uses the git tag to which HEAD currently points for the version string in the header in the changelog file."
      byExplicitVersion =
        Arg.argument [ "--explicit-release", "-e" ] desc
          # Arg.unformat "SEMVER_VERSION" (bimap show ExplicitVersion <<< Version.parseVersion)
        where
        desc = "Uses the user-provided version via the semver scheme (e.g. `MAJOR.MINOR.PATCH`) for the version string in the header in the changelog file."

  initCommand =
    Arg.command [ "init", "i" ] "Sets up the repo so that the `update` command will work in the future." ado
      overwriteReadme <- overwriteReadmeArg
      changelogFile <- changelogFileArg
      changelogDir <- changelogDirArg
      Arg.flagHelp
      in Init { overwriteReadme, changelogFile, changelogDir }

  changelogFileArg =
    Arg.argument [ "--changelog-file" ] desc
      # Arg.default Constants.changelogFile
    where
    desc = "The file path to the changelog file. (defaults to `" <> Constants.changelogFile <> "`)"

  changelogDirArg =
    Arg.argument [ "--changelog-dir" ] desc
      # Arg.default Constants.changelogDir
    where
    desc = "The file path to the directory containing changelog entry files. (defaults to `" <> Constants.changelogDir <> "`)"

  overwriteReadmeArg =
    Arg.flag [ "--overwrite-dir-readme" ] desc
      # Arg.boolean
    where
    desc = "When enabled, overwrites the '" <> Constants.changelogDir <> sep <> Constants.readmeFile <> "' file, if it exists."
