module UpChangelog.App where

import Prelude

import Control.Monad.Reader (class MonadAsk, class MonadReader, ReaderT, ask, runReaderT, withReaderT)
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Exception (throw)
import Node.Encoding (Encoding(..))
import Node.FS.Aff as FSA
import Node.Path (FilePath)
import UpChangelog.Types (Logger)

type Env r =
  { logger :: Logger Effect
  | r
  }

newtype App r a = App (ReaderT (Env r) Aff a)

runApp :: forall r a. App r a -> Env r -> Aff a
runApp (App rt) env = (runReaderT rt) env

withApp :: forall r1 r2 a. (Env r2 -> Env r1) -> App r1 a -> App r2 a
withApp f (App rt) = App $ withReaderT f rt

derive newtype instance functorApp :: Functor (App r)
derive newtype instance applyApp :: Apply (App r)
derive newtype instance applicativeApp :: Applicative (App r)
derive newtype instance bindApp :: Bind (App r)
derive newtype instance monadApp :: Monad (App r)
derive newtype instance MonadEffect (App r)
derive newtype instance MonadAff (App r)
derive newtype instance MonadAsk (Env r) (App r)
derive newtype instance MonadReader (Env r) (App r)

logError :: forall r. String -> App r Unit
logError msg = do
  env <- ask
  liftEffect $ env.logger.logError msg

logInfo :: forall r. String -> App r Unit
logInfo msg = do
  env <- ask
  liftEffect $ env.logger.logInfo msg

logDebug :: forall r. String -> App r Unit
logDebug msg = do
  env <- ask
  liftEffect $ env.logger.logDebug msg

die :: forall r a. String -> App r a
die = liftEffect <<< throw

pathExists :: forall r. FilePath -> App r Boolean
pathExists = liftAff <<< FSA.exists

readTextFile :: forall r. FilePath -> App r String
readTextFile = liftAff <<< FSA.readTextFile UTF8

writeTextFile :: forall r. FilePath -> String -> App r Unit
writeTextFile path = liftAff <<< FSA.writeTextFile UTF8 path

readDir :: forall r. FilePath -> App r (Array FilePath)
readDir = liftAff <<< FSA.readdir

mkDir :: forall r. FilePath -> App r Unit
mkDir = liftAff <<< FSA.mkdir
