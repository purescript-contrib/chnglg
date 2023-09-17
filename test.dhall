let config = ./spago.dhall

let thisConfig =
      { dependencies =
        [ "node-child-process", "node-process", "profunctor-lenses", "spec" ]
      , sources = [ "test/**/*.purs" ]
      }

in  { name = "tests"
    , dependencies = thisConfig.dependencies # config.dependencies
    , packages = config.packages
    , sources = thisConfig.sources # config.sources
    }
