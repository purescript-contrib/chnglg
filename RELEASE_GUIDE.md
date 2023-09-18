# Release Guide

```sh
git fetch origin
git checkout origin/master
git switch -c new-release

npm version minor # major, minor, patch, etc.
VERSION=$(jq '.version' package.json)
sed -i -E "s/version = \"[^\"]+\"/version = ${VERSION}/" bin/Main.purs
git add package.json bin/Main.purs
git commit -m "Update version"

npm run bundle
./bin/index.mjs update
git commit -m "Update changelog"

gh pr create
# get PR merged

git checkout master
git pull
gh release create
# Create a tag matching version

npm publish
```
