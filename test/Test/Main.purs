module Test.Main where

import Prelude

import Data.Either (either)
import Data.Foldable (for_)
import Data.Maybe (isJust, isNothing)
import Effect (Effect)
import Effect.Aff (Aff, runAff_)
import Effect.Aff.Class (liftAff)
import Effect.Class (liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (throwException)
import Node.ChildProcess (defaultExecOptions)
import Node.Encoding (Encoding(..))
import Node.FS.Aff as FSA
import Node.Path as Path
import Node.Process (chdir, cwd)
import Test.Spec (SpecT, describe, it)
import Test.Spec.Assertions (shouldEqual, shouldSatisfy)
import Test.Spec.Reporter (consoleReporter)
import Test.Spec.Runner (defaultConfig, runSpecT)
import Test.Utils (delDir, mkdtempAff, runCmd)
import UpChangelog.Constants as Constants

main :: Effect Unit
main = runAff_ (either throwException pure) do
  void $ join $ runSpecT defaultConfig [ consoleReporter ] spec

spec :: SpecT Aff Unit Aff Unit
spec = do
  liftEffect $ chdir "test"
  let
    pursChangelog cmd args =
      liftAff
        $ runCmd defaultExecOptions "node"
        $ [ "../../bin/index.js", cmd ] <> args
    defaultReadme = Path.concat [ Constants.changelogDir, Constants.readmeFile ]
    readFile = liftAff <<< FSA.readTextFile UTF8
    withTempDir = withTempDir' <<< const
    withTempDir' f = do
      pwd <- liftEffect cwd
      tempDir <- liftAff $ mkdtempAff "init"
      liftEffect $ chdir tempDir
      res <- f tempDir
      liftEffect $ chdir pwd
      liftAff $ delDir tempDir
      pure res

  describe "Init command" do
    it "init - no args - files' content should match constants' content" do
      withTempDir do
        log "About to run purs changelog"
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
