var CONFIG  = require("./config"),
    http = require("https"),
    options = {},
    all_repos = []

getPage (1, function (repos) {
  console.log ("done")
  traverseRepos (0, repos, function (repo_name) {
  	if (repo_name.indexOf (CONFIG.GITHUB_REPO_FILTER) == 0) {
      writeWebHook (CONFIG.GITHUB_ORG, repo_name, CONFIG.WEB_HOOK, function () {})
    }
  }, function () {
    console.log ("done")
  })
})

function writeWebHook (org, name, hook, callback) {
  var buffered_out = ""

  console.log ("Adding " + hook + " to " + org + "/" + name + " ")

  var post_data = JSON.stringify({
    'name': 'web',
    'config': {
      'url': hook,
      'content_type': "json"
    }
  });

  options = {
    host: 'api.github.com',
    port: 443,
    path: "/repos/" + org + "/" + name + "/hooks",
    method: 'POST',
    headers: {
      'User-Agent': 'github-mfa-checker',
      'Authorization': 'token ' + CONFIG.GITHUB_TOKEN,
      'Content-Type': 'application/json'
    }
  }
  
  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      buffered_out += chunk
    })
    res.on('end', function () {
      callback()
    })
  })
  
  // post the data
  req.write(post_data);
  req.end();
}

function traverseRepos (index, repos, calleach, callback) {
  if (index == repos.length) {
    callback ()
  } else {
  	calleach (repos[index].name)
    traverseRepos (++index, repos, calleach, callback)
  }
}

function getPage (page_number, callback) {
  var buffered_out = ""

  process.stdout.write (page_number === 1 ? "Reading in " + CONFIG.GITHUB_ORG + " repos " : " . ")

  options = {
    host: 'api.github.com',
    port: 443,
    path: "/orgs/" + CONFIG.GITHUB_ORG + "/repos?page=" + page_number,
    method: 'GET',
    headers: {
      'User-Agent': 'github-mfa-checker',
      'Authorization': 'token ' + CONFIG.GITHUB_TOKEN
    }
  }
  
  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      buffered_out += chunk
    })
    res.on('end', function () {
      var repos_json = JSON.parse (buffered_out)

      for (i in repos_json) {
        all_repos.push (repos_json[i])
      }

      if (repos_json.length == 30) {
        getPage (++page_number, callback)
      } else {
        callback (all_repos)
      }
    })
  })
  
  req.write('{}')
  req.end()
}