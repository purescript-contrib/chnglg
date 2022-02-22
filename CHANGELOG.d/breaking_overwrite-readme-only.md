* Replace `--force` with `--overwrite-dir-readme` flag

  Previously, `--force` would overwrite both the `CHANGELOG.md` file
  and the `CHANGELOG.d/README.md` files. However, if a `CHANGELOG.md` file exists,
  it's likely because one is already using some changelog file in the first place.
  Thus, overwriting it would be annoying and unhelpful.

  This CLI args and `init` command's logic have been tweaked, so that only the
  `CHANGELOG.d/README.md` file can be overwritten. If the `CHANGELOG.md` file exists,
  then we only check whether the `update` command will work in the future by seeing
  whether the file can be split into two parts: the preamble and everything else.