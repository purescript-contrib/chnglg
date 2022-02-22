module Test.Main where

import Prelude

import Data.Either (either)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), isJust, isNothing)
import Effect (Effect)
import Effect.Aff (Aff, Milliseconds(..), joinFiber, launchAff_, runAff, runAff_)
import Effect.Class (liftEffect)
import Effect.Exception (throwException)
import Node.ChildProcess (defaultExecOptions)
import Node.Encoding (Encoding(..))
import Node.FS.Aff as FSA
import Node.Path (FilePath, sep)
import Node.Path as Path
import Node.Process (chdir)
import Test.Spec (SpecT, describe, it, sequential)
import Test.Spec.Assertions (shouldEqual, shouldSatisfy)
import Test.Spec.Reporter (consoleReporter)
import Test.Spec.Runner (defaultConfig, runSpecT)
import Test.Utils (delDir, mkdtempAff, runCmd)
import UpChangelog.Constants as Constants
import UpChangelog.Utils (wrapQuotes)

main :: Effect Unit
main = runAff_ (either throwException pure) do
  void $ join $ runSpecT (defaultConfig { timeout = Just $ Milliseconds 20_000.0 }) [ consoleReporter ] $ sequential spec

spec :: SpecT Aff Unit Aff Unit
spec = do
  let
    pursChangelog cmd args =
      runCmd defaultExecOptions "node" $ [ "../../bin/index.js", "--log-debug", cmd ] <> args
    defaultReadme = Path.concat [ Constants.changelogDir, Constants.readmeFile ]
    readFile = FSA.readTextFile UTF8

    readDir :: FilePath -> Aff (Array FilePath)
    readDir = FSA.readdir

    withTempDir :: Aff Unit -> Aff Unit
    withTempDir = withTempDir' <<< const

    withTempDir' :: (FilePath -> Aff Unit) -> Aff Unit
    withTempDir' f = do
      liftEffect $ chdir "test"
      tempDir <- mkdtempAff "init"
      liftEffect $ chdir tempDir
      res <- f tempDir
      liftEffect $ chdir ".."
      delDir tempDir
      liftEffect $ chdir ".."
      pure res

  describe "Init command" do
    it "init - no args - files' content should match constants' content" do
      withTempDir do
        { error } <- pursChangelog "init" []
        for_ error \e -> liftEffect $ throwException e
        error `shouldSatisfy` isNothing
        readmeContent <- readFile defaultReadme
        logContent <- readFile Constants.changelogFile
        readmeContent `shouldEqual` Constants.readmeContent
        logContent `shouldEqual` Constants.changelogContent

    it "init - does not ovewrite pre-existing files" do
      withTempDir do
        { error } <- pursChangelog "init" []
        error `shouldSatisfy` isNothing
        { error: error2 } <- pursChangelog "init" []
        error2 `shouldSatisfy` isJust

    it "init - force - ovewrites pre-existing files" do
      withTempDir do
        { error } <- pursChangelog "init" []
        error `shouldSatisfy` isNothing
        { error: error2 } <- pursChangelog "init" [ "--overwrite-dir-readme" ]
        error2 `shouldSatisfy` isNothing

    it "init - custom file paths - files' content should match constants' content" do
      withTempDir do
        let
          dir = "custom-dir"
          file = "custom-file"
        { error } <- pursChangelog "init" [ "--changelog-dir", dir, "--changelog-file", file ]
        error `shouldSatisfy` isNothing
        readmeContent <- readFile $ Path.concat [ dir, Constants.readmeFile ]
        logContent <- readFile file
        readmeContent `shouldEqual` Constants.readmeContent
        logContent `shouldEqual` Constants.changelogContent

    it "init - custom file paths - does not overwrite pre-existing files" do
      withTempDir do
        let
          dir = "custom-dir"
          file = "custom-file"
        { error } <- pursChangelog "init" [ "--changelog-dir", dir, "--changelog-file", file ]
        error `shouldSatisfy` isNothing
        { error: error2 } <- pursChangelog "init" [ "--changelog-dir", dir, "--changelog-file", file ]
        error2 `shouldSatisfy` isJust

    it "init - custom file paths, force - overwrites pre-existing files" do
      withTempDir do
        let
          dir = "custom-dir"
          file = "custom-file"
        { error } <- pursChangelog "init" [ "--changelog-dir", dir, "--changelog-file", file ]
        error `shouldSatisfy` isNothing
        { error: error2 } <- pursChangelog "init" [ "--overwrite-dir-readme", "--changelog-dir", dir, "--changelog-file", file ]
        error2 `shouldSatisfy` isNothing

  describe "Update command" do
    let
      repoArg = "purescript-contrib/purescript-up-changelog"
      correctFile = "Correct.md"
      withReset = withReset' Constants.changelogDir Constants.changelogFile

      withReset' :: FilePath -> FilePath -> Aff Unit -> Aff Unit
      withReset' changeDir changeFile f = do
        liftEffect $ chdir "test/project"
        fiber <- liftEffect $ runAff (either resetRethrow pure) f
        res <- joinFiber fiber
        reset
        pure res
        where
        resetRethrow e = launchAff_ do
          reset
          void $ liftEffect $ throwException e
        reset = do
          let
            entries = map wrapQuotes [ changeDir <> sep, changeFile ]
          void $ runCmd defaultExecOptions "git" $ [ "checkout", "HEAD", "--" ] <> entries
          liftEffect $ chdir "../.."

    it "update - no args - produces expected content" do
      withReset do
        { error } <- pursChangelog "update" []
        error `shouldSatisfy` isNothing
        files <- readDir Constants.changelogDir
        files `shouldEqual` [ Constants.readmeFile ]
        logContent <- readFile Constants.changelogFile
        expectedContent <- readFile correctFile
        logContent `shouldEqual` expectedContent

    it "update - repo arg - produces expected content" do
      withReset do
        { error } <- pursChangelog "update" [ "--repo", repoArg ]
        error `shouldSatisfy` isNothing
        files <- readDir Constants.changelogDir
        files `shouldEqual` [ Constants.readmeFile ]
        logContent <- readFile Constants.changelogFile
        expectedContent <- readFile correctFile
        logContent `shouldEqual` expectedContent

    it "update - version via package.json - produces expected content" do
      withReset do
        { error } <- pursChangelog "update" [ "--repo", repoArg, "--package-json", "package.json" ]
        error `shouldSatisfy` isNothing
        files <- readDir Constants.changelogDir
        files `shouldEqual` [ Constants.readmeFile ]
        logContent <- readFile Constants.changelogFile
        expectedContent <- readFile correctFile
        logContent `shouldEqual` expectedContent

    it "update - explicit version - produces expected content" do
      withReset do
        { error } <- pursChangelog "update" [ "--repo", repoArg, "--explicit-release", "1.2.3" ]
        error `shouldSatisfy` isNothing
        files <- readDir Constants.changelogDir
        files `shouldEqual` [ Constants.readmeFile ]
        logContent <- readFile Constants.changelogFile
        expectedContent <- readFile correctFile
        logContent `shouldEqual` expectedContent

    it "update - proj.cabal version - produces expected content" do
      withReset do
        { error } <- pursChangelog "update" [ "--repo", repoArg, "--cabal", "proj.cabal" ]
        error `shouldSatisfy` isNothing
        files <- readDir Constants.changelogDir
        files `shouldEqual` [ Constants.readmeFile ]
        logContent <- readFile Constants.changelogFile
        expectedContent <- readFile correctFile
        logContent `shouldEqual` expectedContent
