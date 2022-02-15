module UpChangelog.Command.InitChangelog where

import Prelude

import Data.String as String
import Effect.Aff (Aff)
import Effect.Class.Console (log)
import Node.Encoding (Encoding(..))
import Node.FS.Aff as FSA
import Node.Path (sep)
import Node.Path as Path
import UpChangelog.Command.GenChangelog (commaSeparate)
import UpChangelog.Constants as Constants
import UpChangelog.Git (git)

initChangelog :: Boolean -> Aff Unit
initChangelog force = do
  unlessM (FSA.exists Constants.changelogDir) do
    FSA.mkdir Constants.changelogDir
  let readme = Path.concat [ Constants.changelogDir, Constants.readmeFile ]
  attemptToAddFile readme Constants.readmeContent
  attemptToAddFile Constants.changelogFile Constants.changelogContent
  where
  attemptToAddFile file content = do
    fileExists <- FSA.exists file
    if (fileExists && not force) then do
      log $ alreadyExistsWarning file
    else do
      FSA.writeTextFile UTF8 file content
      void $ git "add" [ "-q", file ]

  alreadyExistsWarning file = String.joinWith " "
    [ file
    , "already exists, not overwriting."
    , "You can use the --force flag to overwrite all files generated"
    , "by this command (i.e. " <> commaSeparate generatedFiles <> ")"
    ]
  generatedFiles =
    [ Constants.changelogDir <> sep <> Constants.readmeFile
    , Constants.changelogFile
    ]
