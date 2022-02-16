module Test.Main where

import Prelude

import Data.Array as Array
import Data.Either (either)
import Data.Foldable (for_)
import Data.Maybe (isJust, isNothing)
import Data.String as String
import Effect (Effect)
import Effect.Aff (Aff, runAff_)
import Effect.Class (liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (throwException)
import Node.ChildProcess (defaultExecOptions)
import Node.Encoding (Encoding(..))
import Node.FS.Aff as FSA
import Node.Path (FilePath, sep)
import Node.Path as Path
import Node.Process (chdir, cwd)
import Test.Spec (SpecT, describe, it)
import Test.Spec.Assertions (shouldEqual, shouldSatisfy)
import Test.Spec.Reporter (consoleReporter)
import Test.Spec.Runner (defaultConfig, runSpecT)
import Test.Utils (delDir, mkdtempAff, runCmd)
import UpChangelog.Constants as Constants
import UpChangelog.Utils (breakOnSpace, wrapQuotes)

main :: Effect Unit
main = runAff_ (either throwException pure) do
  void $ join $ runSpecT defaultConfig [ consoleReporter ] spec

spec :: SpecT Aff Unit Aff Unit
spec = do
  liftEffect $ chdir "test"
  let
    pursChangelog cmd args =
      runCmd defaultExecOptions "node" $ [ "../../bin/index.js", cmd ] <> args
    defaultReadme = Path.concat [ Constants.changelogDir, Constants.readmeFile ]
    readFile = FSA.readTextFile UTF8

    readDir :: FilePath -> Aff (Array FilePath)
    readDir = FSA.readdir

    withTempDir :: Aff Unit -> Aff Unit
    withTempDir = withTempDir' <<< const

    withTempDir' :: (FilePath -> Aff Unit) -> Aff Unit
    withTempDir' f = do
      pwd <- liftEffect cwd
      tempDir <- mkdtempAff "init"
      liftEffect $ chdir tempDir
      res <- f tempDir
      liftEffect $ chdir pwd
      delDir tempDir
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
        { error: error2 } <- pursChangelog "init" [ "--force" ]
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
        { error: error2 } <- pursChangelog "init" [ "--force", "--changelog-dir", dir, "--changelog-file", file ]
        error2 `shouldSatisfy` isNothing

  describe "Update command" do
    liftEffect $ chdir "project"
    let
      repoArg = "jordanmartinez/purescript-up-changelog"
      correctFile = "Correct.md"
      withReset = withReset' Constants.changelogDir Constants.changelogFile

      withReset' :: FilePath -> FilePath -> Aff Unit -> Aff Unit
      withReset' changeDir changeFile f = do
        res <- f
        { stdout } <- runCmd defaultExecOptions "git" [ "branch" ]
        let
          { after } = breakOnSpace stdout
          branchName = String.drop 1 after
          entries = map wrapQuotes [ changeDir <> sep, changeFile ]
        void $ runCmd defaultExecOptions "git" $ [ "checkout", branchName, "--" ] <> entries
        pure res

    it "update - no args - produces expected content" do
      withReset do
        { error } <- pursChangelog "update" [ "--repo", repoArg ]
        error `shouldSatisfy` isNothing
        files <- readDir Constants.changelogDir
        files `shouldSatisfy` Array.null
        logContent <- readFile Constants.changelogFile
        expectedContent <- readFile correctFile
        logContent `shouldEqual` expectedContent

    it "update - package.json version - produces expected content" do
      pure unit

    it "update - explicit version - produces expected content" do
      pure unit

    it "update - proj.cabal version - produces expected content" do
      pure unit
