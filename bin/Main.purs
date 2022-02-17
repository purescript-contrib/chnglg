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
import Data.Version as Version
import Effect (Effect)
import Effect.Aff (launchAff_, throwError)
import Effect.Class (liftEffect)
import Effect.Class.Console as Console
import Node.FS.Aff as FSA
import Node.Path (sep)
import Node.Process as Process
import UpChangelog.Command.Init (init)
import UpChangelog.Command.Update (update)
import UpChangelog.Constants as Constants
import UpChangelog.Types (InitArgs, UpdateArgs, VersionSource(..))
import UpChangelog.Utils (breakOn)

main :: Effect Unit
main = do
  args <- Array.drop 2 <$> Process.argv
  case parseCliArgs args of
    Left err -> do
      Console.log $ Arg.printArgError err
      case err of
        Arg.ArgError _ Arg.ShowHelp ->
          Process.exit 0
        Arg.ArgError _ (Arg.ShowInfo _) ->
          Process.exit 0
        _ ->
          Process.exit 1
    Right cmd ->
      case cmd of
        Update options -> do
          launchAff_ do
            dirExists <- FSA.exists options.changelogDir
            if not $ dirExists then do
              Console.log $ "Cannot update changelog file as '" <> options.changelogDir <> "' does not exist."
              liftEffect $ Process.exit 1
            else do
              entries <- FSA.readdir options.changelogDir
              if Array.null entries then do
                Console.log $ "Cannot update changelog file as there are no files in '" <> options.changelogDir <> "."
                liftEffect $ Process.exit 1
              else do
                update options

        Init options -> do
          launchAff_ $ init options

data Command
  = Init InitArgs
  | Update UpdateArgs

parseCliArgs :: Array String -> Either Arg.ArgError Command
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

cliParser :: Arg.ArgParser Command
cliParser =
  Arg.choose "command"
    [ updateCommand
    , initCommand
    ]
    <* Arg.flagHelp
    <* Arg.flagInfo [ "--version", "-v" ] "Shows the current version" version
  where
  updateCommand =
    Arg.command [ "update", "u" ] cmdDesc ado
      github <- githubRepoArg
      versionSource <- versionSourceArg
      changelogFile <- changelogFileArg
      changelogDir <- changelogDirArg
      Arg.flagHelp
      in Update { github, versionSource, changelogFile, changelogDir }
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
      Arg.argument [ "--repo", "-r" ] "The Github repo in the `user/repo` format (e.g. `purescript/purescript-prelude`)."
        # Arg.unformat "OWNER/REPO" validate
      where
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
      force <- forceArg
      changelogFile <- changelogFileArg
      changelogDir <- changelogDirArg
      Arg.flagHelp
      in Init { force, changelogFile, changelogDir }

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

  forceArg =
    Arg.flag [ "--force", "-f" ] desc
      # Arg.boolean
    where
    desc = "When enabled, overwrites the " <> Constants.changelogDir <> sep <> Constants.readmeFile <> " file if it exists."
