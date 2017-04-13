// NPM includes
var async = require('async');
var exec = require('child_process').exec;
var fs = require('fs-extra');
var path = require('path');
var semver = require('semver');
// local includes
var origin = require('../../lib/application')();
var OutputConstants = require('../../lib/outputmanager').Constants;
var permissions = require('../../lib/permissions');

var exports = module.exports = {
  checkGlobalPerm: function(action, cb) {
    var currentUser = origin.usermanager.getCurrentUser();
    var resource = permissions.buildResourceString('*', '*');
    permissions.hasPermission(currentUser._id, action, resource, function(error, hasPermission) {
      if(error) return cb(error);
      if(!hasPermission) return cb(new Error('You don\'t have the correct permissions to do that!'));
      cb();
    });
  },
  compareVersions: function(a, b) {
    if(!semver.valid(a)) return -1;
    if(!semver.valid(b)) return 1;
    if(semver.lt(a,b)) return -1;
    if(semver.gt(a,b)) return 1;
    return 0;
  },
  getFrameworkDir: function() {
    return path.join(
      OutputConstants.Folders.Temp,
      origin.usermanager.getCurrentUser().tenant._id,
      OutputConstants.Folders.Framework
    );
  },
  getCurrentVersionData(repoDir, cb) {
    async.parallel([
      function(cb) {
        exports.getPackageVersion(path.join(app.configuration.getConfig('serverRoot'), repoDir), cb);
      },
      function(cb) {
        exports.getGitInfo(path.join(app.configuration.getConfig('serverRoot'), repoDir), cb);
      }
    ], function(error, data) {
      cb(error, { version: data[0], git: data[1] });
    });
  },
  getPackageVersion(repoDir, cb) {
    // TODO maybe use a constant for package.json
    var packagePath = path.join(repoDir, 'package.json');
    fs.readJson(packagePath, function(error, packageObj) {
      cb(error, packageObj.version);
    });
  },
  getGitInfo(repoDir, cb) {
    // get branch info
    exec("git branch -vv", { cwd: repoDir }, function(error, stdout, stderr) {
      if(error) return cb(error);
      if (stderr.length !== 0) return cb(stderr);
      if (stdout.length === 0) return cb(null, {});

      // just pull out the latest for the current branch
      var statusInfo = stdout.match(/\* (.+)/)[1];

      var localBranch = statusInfo.match(/(\S+)\s+/)[1];
      statusInfo = statusInfo.replace(localBranch,'');

      var commit = statusInfo.match(/(\S+)/)[1];
      statusInfo = statusInfo.replace(commit,'');

      // return data
      var data = {};

      data['commit'] = commit;

      var trackingBranchMatch = statusInfo.match(/\[(\S+)(:.+)?\]/);
      if(!trackingBranchMatch) {
        data['branch'] = localBranch + ' (untracked)';
        return cb(null, data);
      }

      var remoteParts = trackingBranchMatch[1].split('/');
      var remote = remoteParts.splice(0,1);

      data['branch'] = remoteParts.join('/');

      // get the remote
      exec("git remote get-url " + remote, { cwd: repoDir }, function(error, stdout, stderr) {
        if(error) return cb(error);
        if (stderr.length != 0) return cb(stderr);
        if (stdout.length === 0) return cb(null, {});

        data['remote'] = stdout.replace('\n','');

        cb(null, data);
      });
    });
  },

  getLatestTag(repoDir, cb) {
    exec("git fetch origin --tags", { cwd: repoDir }, function(error, data) {
      if(error) return cb(error);
      exec("git tag", { cwd: repoDir }, function(error, data) {
        if(error) return cb(error);
        var tags = data.split('\n').sort(exports.compareVersions);
        // remove the 'v' prefix if there is one, and give a good trim
        cb(null, tags.pop().replace('v', '').trim());
      });
    });
  }
}
