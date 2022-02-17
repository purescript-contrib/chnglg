module Test.Utils where

import Prelude

import Data.Either (Either(..))
import Data.Foldable (for_)
import Data.Maybe (Maybe, fromMaybe)
import Data.Posix.Signal (Signal(..))
import Data.String as String
import Effect (Effect)
import Effect.Aff (Aff, Error, effectCanceler, makeAff, message, nonCanceler)
import Effect.Class (liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (name, stack)
import Node.Buffer as Buffer
import Node.ChildProcess (ExecOptions)
import Node.ChildProcess as ChildProcess
import Node.Encoding (Encoding(..))
import Node.FS.Aff as FSA
import Node.FS.Stats (isDirectory, isFile)
import Node.Path (FilePath)
import Node.Path as Path
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
    for_ res.error \e -> do
      log $ "Error name: " <> name e
      log $ "\n\nError msg:\n" <> message e
      log $ "\n\nError stacktrace:\n" <> (show $ stack e)
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
