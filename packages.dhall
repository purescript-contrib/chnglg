let upstream =
      https://github.com/purescript/package-sets/releases/download/psc-0.15.10-20230917/packages.dhall
        sha256:5929d1e39acd3a54a84a2ca9a39a160cb038878f87df37783f16353e705d50fa

in  upstream
  with argparse-basic =
    { dependencies =
      [ "arrays"
      , "console"
      , "debug"
      , "effect"
      , "either"
      , "foldable-traversable"
      , "free"
      , "lists"
      , "maybe"
      , "node-process"
      , "record"
      , "strings"
      , "transformers"
      ]
    , repo = "https://github.com/natefaubion/purescript-argparse-basic.git"
    , version = "v1.0.0"
    }
