module UpChangelog.Git where

import Prelude

import Data.Array as Array
import Effect.Aff.Class (liftAff)
import Node.Library.Execa (ExecaResult, execa)
import UpChangelog.App (App)

git :: forall r. String -> Array String -> App r ExecaResult
git cmd args = liftAff $ _.getResult =<< execa "git" (Array.cons cmd args) identity
