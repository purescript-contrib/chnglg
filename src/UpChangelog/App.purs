module UpChangelog.App where

import Prelude

import Control.Monad.Reader (class MonadAsk, class MonadReader, ReaderT, ask)
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect)
import UpChangelog.Logger (Logger)

type Env r =
  { logger :: Logger Aff
  | r
  }

newtype App r a = App (ReaderT (Env r) Aff a)

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
  liftAff $ env.logger.logError msg

logInfo :: forall r. String -> App r Unit
logInfo msg = do
  env <- ask
  liftAff $ env.logger.logInfo msg

logDebug :: forall r. String -> App r Unit
logDebug msg = do
  env <- ask
  liftAff $ env.logger.logDebug msg