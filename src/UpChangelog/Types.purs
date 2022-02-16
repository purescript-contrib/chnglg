module UpChangelog.Types where

import Prelude

import Data.Argonaut.Decode (class DecodeJson, decodeJson)
import Data.DateTime (DateTime)
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

newtype GenChangelogArgs = GenChangelogArgs
  { github :: GHOwnerRepo
  , versionSource :: VersionSource
  , changelogFile :: FilePath
  , changelogDir :: FilePath
  }

derive instance Eq GenChangelogArgs
derive instance Newtype GenChangelogArgs _

newtype InitArgs = InitArgs
  { force :: Boolean
  , changelogFile :: FilePath
  , changelogDir :: FilePath
  }

derive instance Eq InitArgs
derive instance Newtype InitArgs _

newtype ChangelogEntry = ChangelogEntry
  { file :: String
  , content :: String
  , date :: DateTime
  }

derive instance newtypeChangelogEntry :: Newtype ChangelogEntry _

newtype GitLogCommit a = GitLogCommit
  { data :: a
  , hash :: String
  , time :: DateTime
  }

derive instance newtypeGitLogCommit :: Newtype (GitLogCommit a) _

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