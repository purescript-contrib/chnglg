# chnglg

A port of the work done in [`purescript/purescript#4392`](https://github.com/purescript/purescript/pull/4132). Ports the `update-changelog.hs` script from Haskell to PureScript.

![ci badge](https://github.com/purescript-contrib/uplog/actions/workflows/ci.yml/badge.svg)

## Getting started

The first working release is `v0.5.1`.

```sh
npm i chnglg
```

```sh
nix run github:purescript-contrib/chnglg
```

## Why

To make it easier to keep a good changelog that
- follows the principles described in [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
- helps maintainers write an entry for a PR while they still remember what it does rather than weeks/months later when they've forgotten its context
- avoids `CHANGELOG.md` merge conflicts when many PRs are being merged in a short time period
- properly links to the PRs done in a new release
- properly accredits the contributors behind those PRs
- allows maintainers to edit the final changelog before it's finalized

## How

### Receiving PRs

Each PR will add a single file to the `CHANGELOG.d/` directory. Each file will store content in one of two forms:

One where no description is provided, such as...
```markdown
* A single-line summary of the change made
```

One where description is provided, such as...
``````markdown
* A single-line summary of the change made

  Here's a more in-depth explanation of the changes made.

  Notice how everything in this section is indented by two spaces.

  All markdown is supported:
  - a list item

  ```javascript
  console.log("code blocks are supported");
  ```
``````

Since there are a variety of changes (e.g. breaking changes, new features, bug fixes, etc), these changes
are grouped together in the final section for a given release in the `CHANGELOG.md` file. To indicate which kind of change a PR is, each file begins with a special prefix (e.g. `breaking`, `feat`, `fix`, etc.) that indicates where its corresponding group.

| Prefix     | Group Title        | Meaning                                            |
| ---------- | ------------------ | -------------------------------------------------- |
| `breaking` | Breaking changes   | self-explanatory                                   |
| `feature`  | New features       | self-explanatory                                   |
| `fix`      | Bugfixes           | self-explanatory                                   |
| `misc`     | Other improvements | anything else that needs to be logged              |
| `int`      | Internal           | work that doesn't directly affect users of project |

The rest of the file's name is irrelevant for the script, but is often used to summarize things at a glance. For example:
- `breaking_add-new-function-arg.md`
- `fix_fix-unclickable-login-button.md`
- `int_update-ci-to-publish-releases.md`
- `misc_update-react-dependency.md`

If a PR needs multiple changelog entries for it, it can add multiple files, one for each documented change.

### Making a Release

When the maintainer of the project wants to make a release, they update the `CHANGELOG.md` file by running this script (e.g. `purs-changelog update --repo owner/repo`). The script will automatically add the PR number and the GitHub username of the authors of the PR to each file's entry, merge all entries together, and then insert them below the preamble in the `CHANGELOG.md` file.

For example, given the following files
```
CHANGELOG.d/
  feat_new feature.md
  fix_bug-123.md
  breaking_add-new-function-arg.md
CHANGELOG.md
```
where the content of each file is
```markdown
-- CHANGELOG.d/fix_new feature.md
* Added a new feature
-- CHANGELOG.d/fix_bug-123.md
* Fixed login issue due to unclickable button

  Due to changes to CSS, the login button became
  unclickable in a very rare situation.

  If the user moved their mouse over the image nearby,
  the image would resized improperly and cover
  the login button, preventing the user from clicking it.
CHANGELOG.d/breaking_add-new-function-arg.md
* Added a priority `Int` arg to `getUserNickname`

  The arg is used by the backend to determine which
  `GET_NICKNAME` requests to prioritize above others.
CHANGELOG.md
# Changelog

Notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.0

Initial release
```

this script will modify `CHANGELOG.md` to the following

```markdown
# Changelog

Notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2.0.0

Breaking changes:
* Added a priority `Int` arg to `getUserNickname` (#1 by @aRealGitHubUserName)

  The arg is used by the backend to determine which
  `GET_NICKNAME` requests to prioritize above others.

New features:
* Added a new feature (#2 and #3 by @aRealGitHubUserName, @aRealGitHubUserName2, and @aRealGitHubUserName3)

Bugfixes:
* Fixed login issue due to unclickable button (#4 by @aRealGitHubUserName)

  Due to changes to CSS, the login button became
  unclickable in a very rare situation.

  If the user moved their mouse over the image nearby,
  the image would resized improperly and cover
  the login button, preventing the user from clicking it.

## 1.0.0

Initial release
```

If prefixes aren't used (e.g. `int` for `Internal`), the group won't appear in the updated changelog.

The maintainer at this point can commit the updated `CHANGELOG.md` file or further edit it before making the new release.
