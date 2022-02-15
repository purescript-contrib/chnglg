module UpChangelog.Utils where

import Prelude

import Data.Array as Array
import Data.Maybe (Maybe(..), maybe)
import Data.Nullable (Nullable)
import Data.String (Pattern(..))
import Data.String as String
import Data.Traversable (for)

breakOnSpace :: String -> { before :: String, after :: String }
breakOnSpace = breakOn (Pattern " ")

breakOn :: Pattern -> String -> { before :: String, after :: String }
breakOn ptn s = maybe { before: s, after: "" } (flip String.splitAt s) mbIdx
  where
  mbIdx = String.indexOf ptn s

breakOnEnd :: Pattern -> String -> { before :: String, after :: String }
breakOnEnd ptn s = maybe { before: "", after: s } (flip String.splitAt s) mbIdx
  where
  mbIdx = String.lastIndexOf ptn s

lines :: String -> Array String
lines = String.split (Pattern "\n")

wrapQuotes :: String -> String
wrapQuotes s = "\"" <> s <> "\""

filterM :: forall m a. Monad m => (a -> m Boolean) -> Array a -> m (Array a)
filterM p arr = do
  map Array.catMaybes $ for arr \a -> do
    res <- p a
    pure if res then Just a else Nothing

foreign import toUtcDate :: String -> Nullable String
