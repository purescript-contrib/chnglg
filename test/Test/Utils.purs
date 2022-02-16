module Test.Utils where

import Prelude

import Data.Either (Either(..))
import Data.Maybe (Maybe, fromMaybe)
import Data.Posix.Signal (Signal(..))
import Data.String as String
import Effect (Effect)
import Effect.Aff (Aff, Error, effectCanceler, makeAff, nonCanceler)
import Effect.Class (liftEffect)
import Effect.Class.Console (log)
import Node.Buffer as Buffer
import Node.ChildProcess (ExecOptions)
import Node.ChildProcess as ChildProcess
import Node.Encoding (Encoding(..))
import Node.Path (FilePath)
import Node.Process (cwd)

runCmd :: ExecOptions -> String -> Array String -> Aff { error :: Maybe Error, stdout :: String, stderr :: String }
runCmd options@({ cwd: cwd' }) cmd args = makeAff \cb -> do
  pwd <- liftEffect cwd
  log $ "In dir, '" <> (fromMaybe pwd cwd') <> "', running command:\n" <> fullCommand
  proc <- ChildProcess.exec fullCommand options \res -> do
    stdout <- Buffer.toString UTF8 res.stdout
    stderr <- Buffer.toString UTF8 res.stderr
    when (stderr /= "") do
      log $ "Stderr: " <> stderr
    when (stdout /= "") do
      log $ "Stdout: " <> stderr
    cb $ Right { stdout, stderr, error: res.error }
  pure $ effectCanceler do
    ChildProcess.kill SIGKILL proc
  where
  fullCommand = cmd <> " " <> String.joinWith " " args

foreign import mkdtemp :: FilePath -> (Error -> Effect Unit) -> (FilePath -> Effect Unit) -> Effect Unit

mkdtempAff :: FilePath -> Aff FilePath
mkdtempAff prefix = makeAff \cb -> do
  mkdtemp prefix (cb <<< Left) (cb <<< Right)
  pure nonCanceler
