module UpChangelog.Command.InitChangelog where

import Prelude

import Effect.Aff (Aff)
import Effect.Class.Console (log)
import Node.Encoding (Encoding(..))
import Node.FS.Aff as FSA
import Node.Path as Path
import UpChangelog.Constants as Constants
import UpChangelog.Git (git)

initChangelog :: Boolean -> Aff Unit
initChangelog force = do
  unlessM (FSA.exists Constants.changelogDir) do
    FSA.mkdir Constants.changelogDir
  let readme = Path.concat [ Constants.changelogDir, Constants.readmeFile ]
  readmeExists <- FSA.exists Constants.readmeFile
  if (readmeExists && not force) then do
    log $ Constants.readmeFile <> " already exists. Not overwriting. You can use the --force flag to override this"
  else do
    FSA.writeTextFile UTF8 readme Constants.readmeContent
    void $ git "add" [ "-q", readme ]
