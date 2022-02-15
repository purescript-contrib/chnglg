module UpChangelog.Types where

import Prelude

import Data.Argonaut.Decode (class DecodeJson, decodeJson)
import Data.DateTime (DateTime)
import Data.Newtype (class Newtype)
import Node.Path (FilePath)

type GHOwnerRepo = { owner :: String, repo :: String }

newtype GenChangelogArgs = GenChangelogArgs
  { github :: GHOwnerRepo
  , packageJson :: FilePath
  }

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