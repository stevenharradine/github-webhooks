# github-webhooks

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
 * `GITHUB_TOKEN` (string) - github token
 * `GITHUB_ORG` (strubg) - github organization to run in
 * `WEB_HOOK` (string) - the webhook url to add/delete
 * `GITHUB_REPO_FILTER` (string) - filter repository name by prefix
 * `GITHUB_EVENTS` (array of string) - values maybe found on https://developer.github.com/webhooks/#events

### run with filters (if needed)
```
node github-webhooks --github-repo-filter=playbook-
```
