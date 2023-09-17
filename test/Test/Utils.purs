module Test.Utils where

import Prelude

import Data.Foldable (for_)
import Effect.Aff (Aff)
import Node.FS.Aff as FSA
import Node.FS.Stats (isDirectory, isFile)
import Node.Path (FilePath)
import Node.Path as Path

delDir :: FilePath -> Aff Unit
delDir path = do
  s <- FSA.stat path
  if (isDirectory s) then do
    children <- FSA.readdir path
    for_ children \child -> do
      delDir $ Path.concat [ path, child ]
    FSA.rmdir path
  else if (isFile s) then do
    FSA.unlink path
  else pure unit
