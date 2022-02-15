module UpChangelog.Command.InitChangelog where

import Prelude

import Effect.Aff (Aff)
import Node.Encoding (Encoding(..))
import Node.FS.Aff as FSA
import Node.Path as Path
import UpChangelog.Constants as Constants
import UpChangelog.Git (git)

initChangelog :: Aff Unit
initChangelog = do
  FSA.mkdir Constants.changelogDir
  let readme = Path.concat [ Constants.changelogDir, Constants.readmeFile ]
  FSA.writeTextFile UTF8 readme Constants.readmeContent
  void $ git "add" [ "-q", readme ]
