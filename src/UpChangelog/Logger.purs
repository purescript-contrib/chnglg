module UpChangelog.Logger where

import Prelude

import Effect.Class (class MonadEffect)
import Effect.Class.Console (log)

data LoggerType
  = None
  | Error
  | Info
  | Debug

derive instance Eq LoggerType
derive instance Ord LoggerType

type Logger m =
  { logError :: String -> m Unit
  , logInfo :: String -> m Unit
  , logDebug :: String -> m Unit
  }

mkLogger :: forall m. MonadEffect m => LoggerType -> Logger m
mkLogger = case _ of
  None -> default
  Error -> default { logError = log }
  Info -> default { logError = log, logInfo = log }
  Debug -> { logError: log, logInfo: log, logDebug: log }
  where
  default :: Logger m
  default =
    { logError: const (pure unit)
    , logInfo: const (pure unit)
    , logDebug: const (pure unit)
    }
