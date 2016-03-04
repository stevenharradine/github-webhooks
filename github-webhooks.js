var CONFIG = require("./config"),
    ARRAY_UTILS = require("./libs/array"),
    http = require("https"),
    options = {},
    all_repos = [],
    delete_hook = false

for (i in process.argv) {
  if (i >= 2) {
  	var arg = process.argv[i]

  	if (arg.indexOf ("--") === 0 && arg.indexOf ("=") >= 0) {
      var arg_split = arg.split("="),
  	      key = arg_split[0],
  	      value = arg_split[1]

  	  if (key === "--github-repo-filter") {
        CONFIG.GITHUB_REPO_FILTER = value
      } else if (key == "--delete") {
      	delete_hook = JSON.parse(value)
      }
    }
  }
}

getPage (1, function (repos) {
  console.log ("done")
  traverseRepos (0, repos, function (repo_name) {
    if (CONFIG.GITHUB_REPO_FILTER !== "undefined") {
      if (repo_name.indexOf (CONFIG.GITHUB_REPO_FILTER) === 0) {
        action (repo_name)
      }
    } else {
		action (repo_name)
    }
  }, function () {
    console.log ("done")
  })
})

function action (repo_name) {
  if (delete_hook) {
    deleteWebHook (CONFIG.GITHUB_ORG, repo_name, CONFIG.WEB_HOOK, function (output) {
      console.log (output)
    })
  } else {
    writeWebHook (CONFIG.GITHUB_ORG, repo_name, CONFIG.WEB_HOOK, function (output) {
      console.log (output)
    })
  }
}

function deleteWebHook (org, name, hook, callback) {
  var buffered_out = ""

  options = {
    host: 'api.github.com',
    port: 443,
    path: "/repos/" + org + "/" + name + "/hooks",
    method: 'GET',
    headers: {
      'User-Agent': 'github-mfa-checker',
      'Authorization': 'token ' + CONFIG.GITHUB_TOKEN,
    }
  }

  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      buffered_out += chunk
    })
    res.on('end', function () {
      var json = JSON.parse (buffered_out)

      for (i in json) {
      	if (json[i].config.url == CONFIG.WEB_HOOK && ARRAY_UTILS.equals (CONFIG.GITHUB_EVENTS, json[i].events)) {
          deleteWebHookById (org, name, json[i].id, callback)
        }
      }
    })
  })
  
  req.write('{}')
  req.end()
}

function deleteWebHookById (org, name, id, callback) {
  options = {
    host: 'api.github.com',
    port: 443,
    path: "/repos/" + org + "/" + name + "/hooks/" + id,
    method: 'DELETE',
    headers: {
      'User-Agent': 'github-mfa-checker',
      'Authorization': 'token ' + CONFIG.GITHUB_TOKEN,
    }
  }

  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('end', function () {
      callback ()
    })
  })
  
  req.write('{}')
  req.end()
}

function writeWebHook (org, name, hook, callback) {
  var buffered_out = ""

  console.log ("Adding " + hook + " to " + org + "/" + name + " ")

  var post_data = JSON.stringify({
    'name': 'web',
    'config': {
      'url': hook,
      'content_type': "json"
    },
    "events": CONFIG.GITHUB_EVENTS
  })

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
    res.setEncoding('utf8')
    res.on('data', function (chunk) {
      buffered_out += chunk
    })
    res.on('end', function () {
      callback (buffered_out)
    })
  })

  req.write(post_data)
  req.end()
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