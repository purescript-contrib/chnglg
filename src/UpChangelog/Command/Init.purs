module UpChangelog.Command.Init where

import Prelude

import Control.Monad.Reader (ask)
import Data.Array as Array
import Data.String as String
import Effect.Class (liftEffect)
import Effect.Exception (throw)
import Node.Path (FilePath, sep)
import Node.Path as Path
import UpChangelog.App (App, logDebug, logInfo, mkDir, pathExists, writeTextFile)
import UpChangelog.Constants as Constants
import UpChangelog.Git (git)
import UpChangelog.Types (InitArgs)
import UpChangelog.Utils (commaSeparate)

init :: App (cli :: InitArgs) Unit
init = do
  { cli: { changelogFile, changelogDir } } <- ask
  ifM (pathExists changelogDir)
    do
      logDebug $ "Changelog dir, '" <> changelogDir <> "' already exists."
    do
      logInfo $ "Changelog dir, '" <> changelogDir <> "' does not exist. Creating..."
      absChangelogDir <- liftEffect $ Path.resolve [] changelogDir
      mkdirP absChangelogDir
      logInfo $ "Changelog dir, '" <> changelogDir <> "' created."
  let readme = Path.concat [ changelogDir, Constants.readmeFile ]
  notAdded1 <- attemptToAddFile readme Constants.readmeContent
  notAdded2 <- attemptToAddFile changelogFile Constants.changelogContent
  let notAdded = notAdded1 <> notAdded2
  unless (Array.null notAdded) do
    liftEffect $ throw $ alreadyExistsWarning notAdded
      [ changelogDir <> sep <> Constants.readmeFile
      , changelogFile
      ]
  where
  attemptToAddFile file content = do
    { cli: { force } } <- ask
    fileExists <- pathExists file
    if (fileExists && not force) then do
      logDebug $ "File, '" <> file <> "', exists but --force flag not used. Not overwriting."
      pure [ file ]
    else do
      logDebug $ "File, '" <> file <> "', either does not exist or --force flag was used. Overwriting."
      writeTextFile file content
      void $ git "add" [ file ]
      logDebug $ "Staged file, '" <> file <> "'."
      pure []

  alreadyExistsWarning files generatedFiles = String.joinWith " "
    [ "Not overwriting the following file(s) that already exist: "
    , commaSeparate files <> "."
    , "You can rerun this command with the --force flag to overwrite all files generated"
    , "by this command (i.e. " <> commaSeparate generatedFiles <> ")"
    ]

mkdirP :: FilePath -> App (cli :: InitArgs) Unit
mkdirP path = mkdirP' 0 path
  where
  mkdirP' n p = do
    ifM (pathExists p)
      do
        if n /= 0 then do
          logDebug $ "Directory, '" <> p <> "', alreacy exists."
        else
          pure unit
      do
        logDebug $ "Directory, '" <> p <> "', does not exist."
        mkdirP' (n + 1) $ Path.dirname p
        mkDir p
