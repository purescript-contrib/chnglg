module Test.Main where

import Prelude

import Control.Monad.Error.Class (class MonadError)
import Data.Either (either)
import Data.Lens (Prism', preview, prism')
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (Aff, Error, Milliseconds(..), runAff_)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (throw, throwException)
import Node.ChildProcess.Types (Exit(..), KillSignal)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (mkdtemp)
import Node.FS.Aff as FSA
import Node.FS.Perms (permsAll)
import Node.Library.Execa (execa)
import Node.Path (FilePath)
import Node.Path as Path
import Node.Process (chdir)
import Node.Process as Process
import Test.Spec (SpecT, afterAll, after_, around_, beforeAll, describe, it, sequential)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.Reporter (consoleReporter)
import Test.Spec.Runner (defaultConfig, runSpecT)
import Test.Utils (delDir)
import UpChangelog.Constants as Constants

main :: Effect Unit
main = runAff_ (either throwException pure) do
  void $ join $ runSpecT (defaultConfig { timeout = Just $ Milliseconds 20_000.0 }) [ consoleReporter ] $ sequential spec

spec :: SpecT Aff Unit Aff Unit
spec = do
  pwd <- liftEffect $ Process.cwd
  let
    binaryFile = Path.concat [ pwd, "bin", "index.mjs" ]
    pursChangelog cmd args =
      _.getResult =<< execa "node" ([ binaryFile, "--log-debug", cmd ] <> args) identity
    defaultReadme = Path.concat [ Constants.changelogDir, Constants.readmeFile ]
    readFile = FSA.readTextFile UTF8

    readDir :: FilePath -> Aff (Array FilePath)
    readDir = FSA.readdir

    _Normally :: Prism' Exit Int
    _Normally = prism' Normally case _ of
      Normally i -> Just i
      _ -> Nothing

    _BySignal :: Prism' Exit KillSignal
    _BySignal = prism' BySignal case _ of
      BySignal sig -> Just sig
      _ -> Nothing

    exitedNormally = eq (Just 0) <<< preview _Normally <<< _.exit

  describe "Init command" do
    around_ withTempDir do
      it "init - no args - files' content should match constants' content" do
        result <- pursChangelog "init" []
        when (not $ exitedNormally result) do
          liftEffect $ throw $ result.stdout <> "\n" <> result.stderr <> "\n" <> result.escapedCommand
        readmeContent <- readFile defaultReadme
        logContent <- readFile Constants.changelogFile
        readmeContent `shouldEqual` Constants.readmeContent
        logContent `shouldEqual` Constants.changelogContent

      it "init - does not ovewrite pre-existing files" do
        result1 <- pursChangelog "init" []
        when (not $ exitedNormally result1) do
          liftEffect $ throw $ "Did not exit normally.\n" <> result1.stdout <> "\n" <> result1.stderr
        result2 <- pursChangelog "init" []
        when (exitedNormally result2) do
          liftEffect $ throw $ "Should have encountered problem.\n" <> result2.stdout <> "\n" <> result2.stderr

      it "init - force - ovewrites pre-existing files" do
        result1 <- pursChangelog "init" []
        when (not $ exitedNormally result1) do
          liftEffect $ throw $ "Result 1 did not exit normally.\n" <> result1.stdout <> "\n" <> result1.stderr
        result2 <- pursChangelog "init" [ "--overwrite-dir-readme" ]
        when (not $ exitedNormally result2) do
          liftEffect $ throw $ "Result 2 did not exit normally.\n" <> result2.stdout <> "\n" <> result2.stderr

      it "init - custom file paths - files' content should match constants' content" do
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
    aroundAll cloneTestRepo cleanupTestRepo do
      after_ gitCleanReset do
        it "update - no args - produces expected content" \{ correctFile } -> do
          result <- pursChangelog "update" []
          when (not $ exitedNormally result) do
            liftEffect $ throw $ "Result did not exit normally.\n" <> result.stdout <> "\n" <> result.stderr
          files <- readDir Constants.changelogDir
          files `shouldEqual` [ Constants.readmeFile ]
          logContent <- readFile Constants.changelogFile
          expectedContent <- readFile correctFile
          logContent `shouldEqual` expectedContent

        it "update - repo arg - produces expected content" \{ repo, correctFile } -> do
          result <- pursChangelog "update" [ "--repo", repo ]
          when (not $ exitedNormally result) do
            liftEffect $ throw $ "Result did not exit normally.\n" <> result.stdout <> "\n" <> result.stderr
          files <- readDir Constants.changelogDir
          files `shouldEqual` [ Constants.readmeFile ]
          logContent <- readFile Constants.changelogFile
          expectedContent <- readFile correctFile
          logContent `shouldEqual` expectedContent

        it "update - version via package.json - produces expected content" \{ repo, correctFile } -> do
          result <- pursChangelog "update" [ "--repo", repo, "--from-package-json", "package.json" ]
          when (not $ exitedNormally result) do
            liftEffect $ throw $ "Result did not exit normally.\n" <> result.stdout <> "\n" <> result.stderr
          files <- readDir Constants.changelogDir
          files `shouldEqual` [ Constants.readmeFile ]
          logContent <- readFile Constants.changelogFile
          expectedContent <- readFile correctFile
          logContent `shouldEqual` expectedContent

        it "update - explicit version - produces expected content" \{ repo, correctFile } -> do
          result <- pursChangelog "update" [ "--repo", repo, "--from-version", "1.2.3" ]
          when (not $ exitedNormally result) do
            liftEffect $ throw $ "Result did not exit normally.\n" <> result.stdout <> "\n" <> result.stderr
          files <- readDir Constants.changelogDir
          files `shouldEqual` [ Constants.readmeFile ]
          logContent <- readFile Constants.changelogFile
          expectedContent <- readFile correctFile
          logContent `shouldEqual` expectedContent

        it "update - proj.cabal version - produces expected content" \{ repo, correctFile } -> do
          result <- pursChangelog "update" [ "--repo", repo, "--from-cabal", "proj.cabal" ]
          when (not $ exitedNormally result) do
            liftEffect $ throw $ "Result did not exit normally.\n" <> result.stdout <> "\n" <> result.stderr
          files <- readDir Constants.changelogDir
          files `shouldEqual` [ Constants.readmeFile ]
          logContent <- readFile Constants.changelogFile
          expectedContent <- readFile correctFile
          logContent `shouldEqual` expectedContent

        it "update - custom - produces expected content" \{ repo, correctFile } -> do
          result <- pursChangelog "update" [ "--repo", repo, "--from-custom", "1.2.3" ]
          when (not $ exitedNormally result) do
            liftEffect $ throw $ "Result did not exit normally.\n" <> result.stdout <> "\n" <> result.stderr
          files <- readDir Constants.changelogDir
          files `shouldEqual` [ Constants.readmeFile ]
          logContent <- readFile Constants.changelogFile
          expectedContent <- readFile correctFile
          logContent `shouldEqual` expectedContent

withTempDir :: Aff Unit -> Aff Unit
withTempDir f = do
  originalDir <- liftEffect $ Process.cwd
  tempDir <- mkdtemp "init"
  FSA.mkdir' tempDir { recursive: true, mode: permsAll }
  liftEffect $ chdir tempDir
  res <- f
  liftEffect $ chdir originalDir
  delDir tempDir
  pure res

cloneTestRepo :: Aff { originalDir :: String, repo :: String, testRepoDir :: String, correctFile :: String }
cloneTestRepo = do
  originalDir <- liftEffect $ Process.cwd
  testRepoDir <- FSA.mkdtemp "test-repo"
  FSA.mkdir' testRepoDir { recursive: true, mode: permsAll }
  let
    repoArg = "JordanMartinez/purescript-up-changelog-test"
    testRepo = "https://github.com/" <> repoArg
    branchName = "master"
  result <- _.getResult =<< execa "git" [ "clone", "--branch", branchName, testRepo, testRepoDir ] identity
  case result.exit of
    Normally 0 ->
      log $ result.stdout <> "\n" <> result.stderr
    _ -> do
      delDir testRepoDir
      liftEffect $ throw $ "Did not successfully clone test repo\n" <> result.stdout <> "\n" <> result.stderr
  liftEffect $ Process.chdir testRepoDir
  pure
    { originalDir
    , repo: repoArg
    , testRepoDir
    , correctFile: "Correct.md"
    }

cleanupTestRepo :: forall r. { originalDir :: String, testRepoDir :: String | r } -> Aff Unit
cleanupTestRepo { originalDir, testRepoDir } = do
  liftEffect $ Process.chdir originalDir
  delDir testRepoDir

gitCleanReset :: Aff Unit
gitCleanReset = do
  void $ _.getResult =<< execa "git" [ "clean", "-f" ] identity
  void $ _.getResult =<< execa "git" [ "reset", "--hard", "HEAD" ] identity

aroundAll
  :: forall m g i a
   . MonadEffect m
  => MonadAff g
  => MonadError Error g
  => g i
  -> (i → g Unit)
  -> SpecT g i m a
  -> SpecT g Unit m a
aroundAll setup cleanup use =
  beforeAll setup $ afterAll cleanup $ use
