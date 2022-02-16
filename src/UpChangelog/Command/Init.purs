module UpChangelog.Command.Init where

import Prelude

import Data.Array as Array
import Data.String as String
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Effect.Exception (throw)
import Node.Encoding (Encoding(..))
import Node.FS.Aff as FSA
import Node.Path (FilePath, sep)
import Node.Path as Path
import UpChangelog.Utils (commaSeparate)
import UpChangelog.Constants as Constants
import UpChangelog.Git (git)
import UpChangelog.Types (InitArgs(..))

init :: InitArgs -> Aff Unit
init (InitArgs { force, changelogFile, changelogDir }) = do
  unlessM (FSA.exists changelogDir) do
    absChangelogDir <- liftEffect $ Path.resolve [] changelogDir
    mkdirP absChangelogDir
  let readme = Path.concat [ changelogDir, Constants.readmeFile ]
  notAdded1 <- attemptToAddFile readme Constants.readmeContent
  notAdded2 <- attemptToAddFile changelogFile Constants.changelogContent
  let notAdded = notAdded1 <> notAdded2
  unless (Array.null notAdded) do
    liftEffect $ throw $ alreadyExistsWarning notAdded
  where
  attemptToAddFile file content = do
    fileExists <- FSA.exists file
    if (fileExists && not force) then do
      pure [ file ]
    else do
      FSA.writeTextFile UTF8 file content
      void $ git "add" [ "-q", file ]
      pure []

  alreadyExistsWarning files = String.joinWith " "
    [ "Not overwriting the following file(s) that already exist: "
    , commaSeparate files <> "."
    , "You can rerun this command with the --force flag to overwrite all files generated"
    , "by this command (i.e. " <> commaSeparate generatedFiles <> ")"
    ]
  generatedFiles =
    [ changelogDir <> sep <> Constants.readmeFile
    , changelogFile
    ]

mkdirP :: FilePath -> Aff Unit
mkdirP path = do
  exists <- FSA.exists path
  unless exists do
    mkdirP $ Path.dirname path
    FSA.mkdir path
