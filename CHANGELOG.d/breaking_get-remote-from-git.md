* Reduce need for `--repo` arg by getting info from `git remote -v`

  Previously, one would need to run `purs-changelog update --repo owner/repo`
  to get the PR's author(s). This was largely unneeded because
  to submit a PR, one often has the remote listed in `git remote -v`.

  By default, `purs-changelog update` will extract the `owner/repo` string
  from the `origin` remote and use that.

  If a different remote is desired, one can use the `--remote` argument.

  Since `--remote` and `--repo` both start with `r`, the `-r` shorthand arg
  for `--remote` has been dropped, making this a breaking change.