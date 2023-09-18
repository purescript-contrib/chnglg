module UpChangelog.Types where

import Prelude

import Data.Argonaut.Decode (class DecodeJson, decodeJson)
import Data.DateTime (DateTime)
import Data.Either (Either)
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype)
import Data.Version as Version
import Node.Path (FilePath)

type GHOwnerRepo = { owner :: String, repo :: String }

data VersionSource
  = PackageJson FilePath
  | Cabal FilePath
  | ExplicitVersion Version.Version
  | FromGitTag

-- | PursJson FilePath -- support in future
derive instance Eq VersionSource
derive instance Ord VersionSource

type UpdateArgs =
  { github :: Either String GHOwnerRepo
  , versionSource :: VersionSource
  , mbToken :: Maybe String
  , changelogFile :: FilePath
  , changelogDir :: FilePath
  }

type InitArgs =
  { overwriteReadme :: Boolean
  , changelogFile :: FilePath
  , changelogDir :: FilePath
  }

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

newtype ChangelogEntry = ChangelogEntry
  { file :: String
  , content :: String
  , date :: DateTime
  }

derive instance newtypeChangelogEntry :: Newtype ChangelogEntry _

data CommitType
  = MergeCommit
  | SquashCommit

newtype Author = Author { user :: { login :: String } }

derive instance newtypeAuthor :: Newtype Author _
instance DecodeJson Author where
  decodeJson j = do
    rec <- decodeJson j
    pure $ Author rec

newtype Version = Version { version :: String }

derive instance newtypeVersion :: Newtype Version _
instance DecodeJson Version where
  decodeJson j = do
    rec <- decodeJson j
    pure $ Version rec
