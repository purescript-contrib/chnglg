module UpChangelog.Git where

import Prelude

import Control.Monad.Reader (ask)
import Data.Array as Array
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.Posix.Signal (Signal(..))
import Data.String as String
import Effect.Aff (effectCanceler, makeAff)
import Effect.Aff.Class (liftAff)
import Node.Buffer as Buffer
import Node.ChildProcess (ExecOptions, defaultExecOptions)
import Node.ChildProcess as ChildProcess
import Node.Encoding (Encoding(..))
import Node.Process (cwd)
import UpChangelog.App (App)

-- | Note: if the `args` argument to this function includes file names,
-- | be sure to wrap the file names in quotes. Otherwise, those with spaces
-- | may cause errors on Linux-like OSes.
git :: forall r. String -> Array String -> App r { stdout :: String, stderr :: String }
git cmd = runCmd "git" <<< Array.cons cmd

runCmd :: forall r. String -> Array String -> App r { stdout :: String, stderr :: String }
runCmd = runCmd' (defaultExecOptions { cwd = Just "." })

runCmd' :: forall r. ExecOptions -> String -> Array String -> App r { stdout :: String, stderr :: String }
runCmd' options cmd args = do
  { logger } <- ask
  liftAff $ makeAff \cb -> do
    cwd >>= \pwd -> logger.logDebug $ "pwd: " <> pwd
    logger.logDebug $ "Running: " <> fullCommand
    proc <- ChildProcess.exec fullCommand options \res -> do
      stdout <- Buffer.toString UTF8 res.stdout
      stderr <- Buffer.toString UTF8 res.stderr
      when (stderr /= "") do
        logger.logDebug $ "Stderr: " <> stderr
      cb $ Right { stdout, stderr }
    pure $ effectCanceler do
      logger.logDebug $ "Killing process for command: " <> fullCommand
      ChildProcess.kill SIGKILL proc
  where
  fullCommand = cmd <> " " <> String.joinWith " " args
