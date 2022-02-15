# Release Guide

```sh
# major, minor, patch, etc.
npm version minor
git add package.json
git commit -m "Update version"
git push
gh release create
npm publish
```