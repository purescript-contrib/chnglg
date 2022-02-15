module UpChangelog.Git where

import Prelude

import Data.Array as Array
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.Posix.Signal (Signal(..))
import Data.String as String
import Effect.Aff (Aff, effectCanceler, makeAff)
import Node.Buffer as Buffer
import Node.ChildProcess (ExecOptions, defaultExecOptions)
import Node.ChildProcess as ChildProcess
import Node.Encoding (Encoding(..))

-- | Note: if the `args` argument to this function includes file names,
-- | be sure to wrap the file names in quotes. Otherwise, those with spaces
-- | may cause errors on Linux-like OSes.
git :: String -> Array String -> Aff { stdout :: String, stderr :: String }
git cmd = runCmd "git" <<< Array.cons cmd

runCmd :: String -> Array String -> Aff { stdout :: String, stderr :: String }
runCmd = runCmd' (defaultExecOptions { cwd = Just "." })

runCmd' :: ExecOptions -> String -> Array String -> Aff { stdout :: String, stderr :: String }
runCmd' options cmd args = makeAff \cb -> do
  -- log $ "Running full command: [" <> fullCommand <> "]"
  proc <- ChildProcess.exec fullCommand options \res -> do
    stdout <- Buffer.toString UTF8 res.stdout
    stderr <- Buffer.toString UTF8 res.stderr
    -- when (stderr /= "") do
    --   log $ "Stderr: " <> stderr
    cb $ Right { stdout, stderr }
  pure $ effectCanceler do
    ChildProcess.kill SIGKILL proc
  where
  fullCommand = cmd <> " " <> String.joinWith " " args
