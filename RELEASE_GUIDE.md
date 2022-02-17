# Release Guide

```sh
git fetch origin
git checkout origin/master
git switch -c new-release

npm version minor # major, minor, patch, etc.
git add package.json
git commit -m "Update version"
npm run bundle
./bin/index.js update
git commit -m "Update changelog"
git push
gh release create
# Create a tag matching version
npm publish
```