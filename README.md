# github-webhooks
Adds a web hook to all an organizations github repositories.  Filters can be applied to so only subsets of repositories are affected.

[![Licence](https://img.shields.io/badge/Licence-ISC-blue.svg)](https://opensource.org/licenses/ISC) [![Code Climate](https://codeclimate.com/github/stevenharradine/github-webhooks/badges/gpa.svg)](https://codeclimate.com/github/stevenharradine/github-webhooks) [![Issue Count](https://codeclimate.com/github/stevenharradine/github-webhooks/badges/issue_count.svg)](https://codeclimate.com/github/stevenharradine/github-webhooks)

## usage
### clone
```
git clone https://github.com/stevenharradine/github-webhooks.git
```
### open directory
```
cd github-webhooks
```
### update config.js
 * `GITHUB_EVENTS` (array of string) - values maybe found on https://developer.github.com/webhooks/#events
 * `GITHUB_ORG` (strubg) - github organization to run in
 * `GITHUB_REPO_FILTER` (string) - filter repository name by prefix
 * `GITHUB_TOKEN` (string) - github token
 * `WEB_HOOK` (string) - the webhook url to add/delete

### run
```
node github-webhooks --github-repo-filter=playbook-
```
#### arguments
 * `--delete` (boolean) - delete the matching hooks, default false
 * `--github-repo-filter` (string) - filter repository name by prefix (Overrides `GITHUB_REPO_FILTER` in config.js)
