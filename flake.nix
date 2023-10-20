{
  nixConfig.sandbox = "relaxed";

  description = "A maintainer and contributor-friendly tool for generating a human-readable CHANGELOG.md";


  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    utils.url = "github:ursi/flake-utils";
    easy-ps.url = "github:justinwoo/easy-purescript-nix";
    spago2nix.url = "github:justinwoo/spago2nix";
  };

  outputs = { self, utils, ... }@inputs:
    utils.apply-systems
      { inherit inputs; }
      ({ system, pkgs, easy-ps, spago2nix, ... }:
        let
          chnglg = pkgs.stdenv.mkDerivation
            {
              name = "chnglg";
              src = pkgs.nix-gitignore.gitignoreSource [ ".git" ] ./.;
              nativeBuildInputs = [
                easy-ps.purs
              ] ++ (
                spago2nix.spago2nix_nativeBuildInputs {
                  srcs-dhall = [
                    ./spago.dhall
                    ./packages.dhall
                  ];
                }
              );
              unpackPhase = ''
                cp -r $src/{src,bin} .
                install-spago-style
              '';
              buildInputs = with pkgs; [ nodejs ];
              buildPhase = ''
                mkdir -p $out/bin
                build-spago-style "./src/**/*.purs" "./bin/**/*.purs"
                mv output $out/
                install $src/bin/index.dev.js $out/bin/$name
              '';
            };
        in
        {
          packages = {
            inherit chnglg;
            default = self.packages.${system}.chnglg;
          };
        });
}
