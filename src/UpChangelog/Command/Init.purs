module UpChangelog.Command.Init where

import Prelude

import Control.Monad.Reader (ask)
import Data.Monoid.Conj (Conj(..))
import Data.Newtype (unwrap)
import Data.String (Pattern(..))
import Data.String as String
import Effect.Class (liftEffect)
import Node.Path as Path
import UpChangelog.App (App, die, logDebug, logError, logInfo, mkDir', pathExists, readTextFile, writeTextFile)
import UpChangelog.Constants as Constants
import UpChangelog.Git (git)
import UpChangelog.Types (InitArgs)
import UpChangelog.Utils (breakOn)

init :: App (cli :: InitArgs) Unit
init = do
  { cli: { changelogFile, changelogDir, overwriteReadme } } <- ask
  ifM (pathExists changelogDir)
    do
      logDebug $ "Changelog dir, '" <> changelogDir <> "' already exists."
    do
      logInfo $ "Changelog dir, '" <> changelogDir <> "' does not exist. Creating..."
      absChangelogDir <- liftEffect $ Path.resolve [] changelogDir
      mkDir' absChangelogDir
      logInfo $ "Changelog dir, '" <> changelogDir <> "' created."
  let readme = Path.concat [ changelogDir, Constants.readmeFile ]
  dirReadme <- do
    let
      file = readme
      content = Constants.readmeContent
    fileExists <- pathExists file
    if (fileExists && not overwriteReadme) then do
      logError $ "File, '" <> file <> "', exists but --overwrite-readme flag not used. Not overwriting."
      pure $ Conj false
    else do
      logDebug $ "File, '" <> file <> "', either does not exist or --overwrite-readme flag was used. Overwriting."
      writeTextFile file content
      void $ git "add" [ file ]
      logDebug $ "Staged file, '" <> file <> "'."
      pure $ Conj true
  logFile <- do
    let
      file = changelogFile
      content = Constants.changelogContent
    fileExists <- pathExists file
    if fileExists then do
      logInfo $ "File, '" <> file <> "', exists. Not overwriting."
      logDebug $ "Checking whether file's content can be separated between the preamble and release entries..."
      fileContent <- readTextFile file
      let { before, after } = breakOn (Pattern "\n## ") fileContent
      if (before /= "" && after /= "") then do
        logInfo "File's content will be split properly when calling `update` command in future."
        pure $ Conj true
      else do
        logError $ "Could not find a match for pattern: '\n## '. Wil not properly split changelog when `update` command is used later."
        logDebug $ String.joinWith " "
          [ "A changelog file needs to have some initial content (called the preamble)"
          , "followed by the separator (a line starting with '## ') for the `update`"
          , " command to function correctly."
          ]
        pure $ Conj false
    else do
      logDebug $ "File, '" <> file <> "', does not exist. Creating."
      writeTextFile file content
      void $ git "add" [ file ]
      logDebug $ "Staged file, '" <> file <> "'."
      pure $ Conj true
  unless (unwrap $ dirReadme <> logFile) do
    die $ String.joinWith "\n"
      [ "Failed to initialize repo, so that calling `update` command in future works properly."
      , "Rerun this command with `--log-debug` to see more context."
      ]
