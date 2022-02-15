module Main where

import Prelude

import ArgParse.Basic as Arg
import Bin.Version (version)
import Data.Array as Array
import Data.Bifunctor (bimap)
import Data.Either (Either(..), note)
import Data.String (Pattern(..), contains, joinWith)
import Data.String as String
import Data.Version as Version
import Effect (Effect)
import Effect.Aff (launchAff_, throwError)
import Effect.Class.Console as Console
import Node.Path (sep)
import Node.Process as Process
import UpChangelog.Command.GenChangelog (genChangelog)
import UpChangelog.Command.InitChangelog (initChangelog)
import UpChangelog.Constants as Constants
import UpChangelog.Types (GenChangelogArgs(..), VersionSource(..))
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
        GenChangelog options -> do
          launchAff_ $ genChangelog options

        InitChangelog force -> do
          launchAff_ $ initChangelog force

data Command
  = InitChangelog Boolean
  | GenChangelog GenChangelogArgs

parseCliArgs :: Array String -> Either Arg.ArgError Command
parseCliArgs = Arg.parseArgs
  "purs-changelog"
  ( String.joinWith "\n"
      [ "A CLI for updating the `CHANGELOG.md` file when making a new release."
      , ""
      , "Examples:"
      , "  purs-changelog init"
      , "  purs-changelog regenerate --owner purescript --repo prelude"
      ]
  )
  cliParser

cliParser :: Arg.ArgParser Command
cliParser =
  Arg.choose "command"
    [ regenerateCommand
    , Arg.command [ "init", "i" ] "Sets up the repo so that the `regenerate` command will work in the future." ado
        force <- forceArg
        Arg.flagHelp
        in InitChangelog force
    ]
    <* Arg.flagHelp
    <* Arg.flagInfo [ "--version", "-v" ] "Shows the current version" version
  where
  regenerateCommand =
    Arg.command [ "regenerate", "r" ] cmdDesc ado
      github <- githubRepoArg
      versionSource <- versionSourceArg
      Arg.flagHelp
      in GenChangelog (GenChangelogArgs { github, versionSource })
    where
    cmdDesc = joinWith "\n"
      [ "Regenerates the CHANGELOG.md file based on files in CHANGELOG.d/"
      , ""
      , "Examples:"
      , "purs-changelog regenerate --repo purescript/purescript-prelude"
      , "purs-changelog regenerate --repo purescript/purescript --package-json npm-package/package.json"
      , "purs-changelog regenerate --repo purescript/spago --cabal spago.cabal"
      , "purs-changelog regenerate --repo owner/repo --from-git-tag"
      , "purs-changelog regenerate --repo owner/repo --explicit-release v1.2.3"
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
            [ repo /= ""
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
        validate = note "File path did not end in `package.json`"
          <<< map PackageJson
          <<< String.stripSuffix (Pattern "package.json")
      byCabalFile =
        Arg.argument [ "--cabal", "-c" ] desc
          # Arg.unformat "CABAL_FILE" validate
        where
        desc = "Uses a `*.cabal` file's `version` field for the version string in the header in the changelog file."
        validate = note "File path did not end in `package.json`"
          <<< map Cabal
          <<< String.stripSuffix (Pattern ".cabal")
      byGitTag =
        Arg.argument [ "--from-git-tag", "-g" ] desc
          # Arg.unformat "CABAL_FILE" (const $ pure FromGitTag)
        where
        desc = "Uses the git tag to which HEAD currently points for the version string in the header in the changelog file."
      byExplicitVersion =
        Arg.argument [ "--explicit-release", "-e" ] desc
          # Arg.unformat "SEMVER_VERSION" (bimap show ExplicitVersion <<< Version.parseVersion)
        where
        desc = "Uses the git tag to which HEAD currently points for the version string in the header in the changelog file."

  forceArg =
    Arg.flag [ "--force", "-f" ] desc
      # Arg.boolean
    where
    desc = "When enabled, overwrites the " <> Constants.changelogDir <> sep <> Constants.readmeFile <> " file if it exists."
