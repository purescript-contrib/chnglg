module Test.Main where

import Prelude

import Data.Maybe (Maybe(..), isJust, isNothing)
import Effect (Effect)
import Effect.Aff (Aff, Milliseconds(..), launchAff_)
import Effect.Aff.Class (liftAff)
import Effect.Class (liftEffect)
import Node.ChildProcess (defaultExecOptions)
import Node.Encoding (Encoding(..))
import Node.FS.Aff as FSA
import Node.Path as Path
import Node.Process (chdir)
import Test.Spec (SpecT, afterAll_, beforeAll_, describe, it)
import Test.Spec.Assertions (shouldEqual, shouldSatisfy)
import Test.Spec.Reporter (consoleReporter)
import Test.Spec.Runner (defaultConfig, runSpecT)
import Test.Utils (mkdtempAff, runCmd)
import UpChangelog.Constants as Constants

main :: Effect Unit
main = launchAff_ do
  void $ runSpecT (defaultConfig { timeout = Just $ Milliseconds 10_000.0 }) [ consoleReporter ] spec

spec :: SpecT Aff Unit Aff Unit
spec = do
  let
    pursChangelog cmd args =
      liftAff
        $ runCmd (defaultExecOptions { cwd = Just "." }) "node"
        $ [ "../bin/index.js", cmd ] <> args
    -- defaultDir tempDir = Path.concat [ tempDir, Constants.changelogDir ]
    defaultReadme = Path.concat [ Constants.changelogDir, Constants.readmeFile ]
    -- defaultLog tempDir = Path.concat [ tempDir, Constants.changelogFile ]
    readFile = liftAff <<< FSA.readTextFile UTF8
    enterTempDir = do
      tempDir <- liftAff $ mkdtempAff "init"
      liftEffect $ chdir tempDir
    returnToParentDir = liftEffect $ chdir ".."

  describe "Init command" do
    beforeAll_ enterTempDir do
      afterAll_ returnToParentDir do
        it "init - no args - files' content should match constants' content" do
          { error } <- pursChangelog "init" []
          error `shouldSatisfy` isNothing
          readmeContent <- readFile defaultReadme
          logContent <- readFile Constants.changelogFile
          readmeContent `shouldEqual` Constants.readmeContent
          logContent `shouldEqual` Constants.changelogContent

        it "init - does not ovewrite pre-existing files" do
          { error } <- pursChangelog "init" []
          error `shouldSatisfy` isNothing
          { error: error2 } <- pursChangelog "init" []
          error2 `shouldSatisfy` isJust

        it "init - force - ovewrites pre-existing files" do
          { error } <- pursChangelog "init" []
          error `shouldSatisfy` isNothing
          { error: error2 } <- pursChangelog "init" [ "--force" ]
          error2 `shouldSatisfy` isNothing

        it "init - custom file paths - files' content should match constants' content" do
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
          let
            dir = "custom-dir"
            file = "custom-file"
          { error } <- pursChangelog "init" [ "--changelog-dir", dir, "--changelog-file", file ]
          error `shouldSatisfy` isNothing
          { error: error2 } <- pursChangelog "init" [ "--changelog-dir", dir, "--changelog-file", file ]
          error2 `shouldSatisfy` isJust

        it "init - cusotme file paths, force - overwrites pre-existing files" do
          let
            dir = "custom-dir"
            file = "custom-file"
          { error } <- pursChangelog "init" [ "--changelog-dir", dir, "--changelog-file", file ]
          error `shouldSatisfy` isNothing
          { error: error2 } <- pursChangelog "init" [ "--force", "--changelog-dir", dir, "--changelog-file", file ]
          error2 `shouldSatisfy` isNothing
