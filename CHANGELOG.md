# Changelog

Notable changes to this project are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). This file is updated via [purs-changelog](https://github.com/JordanMartinez/purescript-up-changelog)

## 0.4.0

Breaking changes:

* Reduce need for `--repo` arg by getting info from `git remote -v` (#12 by @JordanMartinez)

  Previously, one would need to run `purs-changelog update --repo owner/repo`
  to get the PR's author(s). This was largely unneeded because
  to submit a PR, one often has the remote listed in `git remote -v`.

  By default, `purs-changelog update` will extract the `owner/repo` string
  from the `origin` remote and use that.

  If a different remote is desired, one can use the `--remote` argument.

  Since `--remote` and `--repo` both start with `r`, the `-r` shorthand arg
  for `--remote` has been dropped, making this a breaking change.

New features:

* Added logging statements primarily via `--log-debug` flag (#11 by @JordanMartinez)

* Add CLI arg for GH token to authenticate API requests (#10 by @JordanMartinez)

  Unauthenticated requests get rate limited pretty quickly.
  When using this program frequently, one will hit that limit
  and receive a Forbidden 403 response.
  By authenticating requests, this limit becomes less of a concern.

Internal:

* Added initial CI tests for `update` command (#11 by @JordanMartinez)

* Update this repo's URL in CI (#11 by @JordanMartinez)

## 0.0.0

Ran `purs-changelog`
