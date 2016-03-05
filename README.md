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
 * `--delete` - delete the matching hooks
 * `--github-repo-filter` - filter repository name by prefix (Overrides `GITHUB_REPO_FILTER` in config.js)
