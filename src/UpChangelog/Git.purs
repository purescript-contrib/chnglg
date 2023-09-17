module UpChangelog.Git where

import Prelude

import Data.Array as Array
import Data.Maybe (Maybe(..))
import Effect.Aff.Class (liftAff)
import Node.Library.Execa (ExecaResult, execa)
import UpChangelog.App (App)

-- | Note: if the `args` argument to this function includes file names,
-- | be sure to wrap the file names in quotes. Otherwise, those with spaces
-- | may cause errors on Linux-like OSes.
git :: forall r. String -> Array String -> App r ExecaResult
git cmd args = liftAff $ _.getResult =<< execa "git" (Array.cons cmd args) (_ { cwd = Just "." })
