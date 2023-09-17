module Test.Main where

import Prelude

import Data.Either (either)
import Data.Lens (Prism', preview, prism')
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (Aff, Milliseconds(..), joinFiber, launchAff_, runAff, runAff_)
import Effect.Class (liftEffect)
import Effect.Exception (throw, throwException)
import Node.ChildProcess.Types (Exit(..), KillSignal)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (mkdtemp)
import Node.FS.Aff as FSA
import Node.Library.Execa (execa)
import Node.Path (FilePath, sep)
import Node.Path as Path
import Node.Process (chdir)
import Node.Process as Process
import Test.Spec (SpecT, describe, it, sequential)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.Reporter (consoleReporter)
import Test.Spec.Runner (defaultConfig, runSpecT)
import Test.Utils (delDir)
import UpChangelog.Constants as Constants
import UpChangelog.Utils (wrapQuotes)

main :: Effect Unit
main = runAff_ (either throwException pure) do
  void $ join $ runSpecT (defaultConfig { timeout = Just $ Milliseconds 20_000.0 }) [ consoleReporter ] $ sequential spec

spec :: SpecT Aff Unit Aff Unit
spec = do
  let
    pursChangelog cmd args =
      _.getResult =<< execa "node" ([ "../../bin/index.js", "--log-debug", cmd ] <> args) identity
    defaultReadme = Path.concat [ Constants.changelogDir, Constants.readmeFile ]
    readFile = FSA.readTextFile UTF8

    readDir :: FilePath -> Aff (Array FilePath)
    readDir = FSA.readdir

    withTempDir :: Aff Unit -> Aff Unit
    withTempDir = withTempDir' <<< const

    _Normally :: Prism' Exit Int
    _Normally = prism' Normally case _ of
      Normally i -> Just i
      _ -> Nothing

    _BySignal :: Prism' Exit KillSignal
    _BySignal = prism' BySignal case _ of
      BySignal sig -> Just sig
      _ -> Nothing

    exitedNormally = eq (Just 0) <<< preview _Normally <<< _.exit

    withTempDir' :: (FilePath -> Aff Unit) -> Aff Unit
    withTempDir' f = do
      originalDir <- liftEffect $ Process.cwd
      liftEffect $ chdir "test"
      testDir <- liftEffect $ Process.cwd
      tempDir <- mkdtemp "init"
      liftEffect $ chdir tempDir
      res <- f tempDir
      liftEffect $ chdir testDir

      delDir tempDir
      liftEffect $ chdir originalDir
      pure res

  describe "Init command" do
    it "init - no args - files' content should match constants' content" do
      withTempDir do
        result <- pursChangelog "init" []
        when (not $ exitedNormally result) do
          liftEffect $ throw $ result.stdout <> "\n" <> result.stderr
        readmeContent <- readFile defaultReadme
        logContent <- readFile Constants.changelogFile
        readmeContent `shouldEqual` Constants.readmeContent
        logContent `shouldEqual` Constants.changelogContent

    it "init - does not ovewrite pre-existing files" do
      withTempDir do
        result1 <- pursChangelog "init" []
        when (not $ exitedNormally result1) do
          liftEffect $ throw $ "Did not exit normally.\n" <> result1.stdout <> "\n" <> result1.stderr
        result2 <- pursChangelog "init" []
        when (exitedNormally result2) do
          liftEffect $ throw $ "Should have encountered problem.\n" <> result2.stdout <> "\n" <> result2.stderr

    it "init - force - ovewrites pre-existing files" do
      withTempDir do
        result1 <- pursChangelog "init" []
        when (not $ exitedNormally result1) do
          liftEffect $ throw $ "Result 1 did not exit normally.\n" <> result1.stdout <> "\n" <> result1.stderr
        result2 <- pursChangelog "init" [ "--overwrite-dir-readme" ]
        when (not $ exitedNormally result2) do
          liftEffect $ throw $ "Result 2 did not exit normally.\n" <> result2.stdout <> "\n" <> result2.stderr

    it "init - custom file paths - files' content should match constants' content" do
      withTempDir do
        let
          dir = "custom-dir"
          file = "custom-file"
        result <- pursChangelog "init" [ "--changelog-dir", dir, "--changelog-file", file ]
        when (not $ exitedNormally result) do
          liftEffect $ throw $ "Result did not exit normally.\n" <> result.stdout <> "\n" <> result.stderr
        readmeContent <- readFile $ Path.concat [ dir, Constants.readmeFile ]
        logContent <- readFile file
        readmeContent `shouldEqual` Constants.readmeContent
        logContent `shouldEqual` Constants.changelogContent

    it "init - custom file paths - does not overwrite pre-existing files" do
      withTempDir do
        let
          dir = "custom-dir"
          file = "custom-file"
        result1 <- pursChangelog "init" [ "--changelog-dir", dir, "--changelog-file", file ]
        when (not $ exitedNormally result1) do
          liftEffect $ throw $ "Result did not exit normally.\n" <> result1.stdout <> "\n" <> result1.stderr
        result2 <- pursChangelog "init" [ "--changelog-dir", dir, "--changelog-file", file ]
        when (exitedNormally result2) do
          liftEffect $ throw $ "Result 2 should have encountered error.\n" <> result2.stdout <> "\n" <> result2.stderr

    it "init - custom file paths, force - overwrites pre-existing files" do
      withTempDir do
        let
          dir = "custom-dir"
          file = "custom-file"
        result1 <- pursChangelog "init" [ "--changelog-dir", dir, "--changelog-file", file ]
        when (not $ exitedNormally result1) do
          liftEffect $ throw $ "Result 1 did not exit normally.\n" <> result1.stdout <> "\n" <> result1.stderr
        result2 <- pursChangelog "init" [ "--overwrite-dir-readme", "--changelog-dir", dir, "--changelog-file", file ]
        when (not $ exitedNormally result2) do
          liftEffect $ throw $ "Result 2 did not exit normally.\n" <> result2.stdout <> "\n" <> result2.stderr

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
          void $ _.getResult =<< execa "git" ([ "checkout", "HEAD", "--" ] <> entries) identity
          liftEffect $ chdir "../.."

    it "update - no args - produces expected content" do
      withReset do
        result <- pursChangelog "update" []
        when (not $ exitedNormally result) do
          liftEffect $ throw $ "Result did not exit normally.\n" <> result.stdout <> "\n" <> result.stderr
        files <- readDir Constants.changelogDir
        files `shouldEqual` [ Constants.readmeFile ]
        logContent <- readFile Constants.changelogFile
        expectedContent <- readFile correctFile
        logContent `shouldEqual` expectedContent

    it "update - repo arg - produces expected content" do
      withReset do
        result <- pursChangelog "update" [ "--repo", repoArg ]
        when (not $ exitedNormally result) do
          liftEffect $ throw $ "Result did not exit normally.\n" <> result.stdout <> "\n" <> result.stderr
        files <- readDir Constants.changelogDir
        files `shouldEqual` [ Constants.readmeFile ]
        logContent <- readFile Constants.changelogFile
        expectedContent <- readFile correctFile
        logContent `shouldEqual` expectedContent

    it "update - version via package.json - produces expected content" do
      withReset do
        result <- pursChangelog "update" [ "--repo", repoArg, "--package-json", "package.json" ]
        when (not $ exitedNormally result) do
          liftEffect $ throw $ "Result did not exit normally.\n" <> result.stdout <> "\n" <> result.stderr
        files <- readDir Constants.changelogDir
        files `shouldEqual` [ Constants.readmeFile ]
        logContent <- readFile Constants.changelogFile
        expectedContent <- readFile correctFile
        logContent `shouldEqual` expectedContent

    it "update - explicit version - produces expected content" do
      withReset do
        result <- pursChangelog "update" [ "--repo", repoArg, "--explicit-release", "1.2.3" ]
        when (not $ exitedNormally result) do
          liftEffect $ throw $ "Result did not exit normally.\n" <> result.stdout <> "\n" <> result.stderr
        files <- readDir Constants.changelogDir
        files `shouldEqual` [ Constants.readmeFile ]
        logContent <- readFile Constants.changelogFile
        expectedContent <- readFile correctFile
        logContent `shouldEqual` expectedContent

    it "update - proj.cabal version - produces expected content" do
      withReset do
        result <- pursChangelog "update" [ "--repo", repoArg, "--cabal", "proj.cabal" ]
        when (not $ exitedNormally result) do
          liftEffect $ throw $ "Result did not exit normally.\n" <> result.stdout <> "\n" <> result.stderr
        files <- readDir Constants.changelogDir
        files `shouldEqual` [ Constants.readmeFile ]
        logContent <- readFile Constants.changelogFile
        expectedContent <- readFile correctFile
        logContent `shouldEqual` expectedContent
