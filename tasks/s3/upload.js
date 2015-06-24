var registerTask = require('../../lib/register-task');
var getShipit = require('../../lib/get-shipit');

var fs = require('graceful-fs');
var path = require('path');

var aws = require('aws-sdk');
var chalk = require('chalk');
var glob = require('glob');
var md5 = require('MD5');
var mime = require('mime');
var multimatch = require('multimatch');
var Promise = require('bluebird');

var noop = function () {};
var pglob = Promise.promisify(glob);
var readFile = Promise.promisify(fs.readFile);

/**
 * Upload task.
 * - Upload your assets on your Amazon s3 instance
 */

module.exports = function (gruntOrShipit) {
  registerTask(gruntOrShipit, 's3:upload', task);

  function task() {

    var shipit = getShipit(gruntOrShipit);
    var dirname = shipit.config.aws.syncParams.dirname;
    var options = shipit.config.aws.syncParams.options || {};

    var s3 = new aws.S3(shipit.config.aws);

    var head = Promise.promisify(s3.headObject, s3);
    var put = Promise.promisify(s3.putObject, s3);

    return sync(dirname, options)
    .then(function () {
      shipit.emit('synced');
    });

    function sync(dirname, options) {

      var base = options && options.base || '';
      var absolute = path.join(base, dirname);
      var blacklist = options && options.blacklist || [];

      if (options && options.whitelist) {
        var promises = options.whitelist.map(function (subdirname) {
          return sync(subdirname, { base: absolute, blacklist: blacklist });
        });

        return Promise.all(promises).then(noop);
      }

      var pattern = path.join(absolute, '**', '*');

      return pglob(pattern, { nodir: true }).then(function (filepaths) {
        var relpaths = filepaths.map(function(filepath) {
          return path.relative(base, filepath);
        });
        var filtered = multimatch(relpaths, blacklist);
        return Promise.all(filtered.map(syncFile));
      });

      function syncFile(relpath) {
        // Rebuild filepath with base for readFile
        var filepath = path.join(base, relpath);
        return readFile(filepath).then(function (contents) {
          var contentType = mime.lookup(filepath);

          return head({ Key: relpath })
            .then(function (headData) {
              if (!headData) return upload().then(uploaded);

              var hash = md5(contents);
              var etag = JSON.parse(headData.ETag);
              var sameContentType = contentType === headData.ContentType;

              if (hash !== etag || !sameContentType) {
                return upload().then(updated);
              }
            }, function () {
              return upload().then(uploaded);
            })
            .catch(errored);

          function upload() {
            return put({
              Body: contents,
              ContentType: contentType,
              Key: relpath
            });
          }

          function updated() {
            shipit.log(chalk.yellow('Updated') + ' ' + relpath);
          }

          function uploaded() {
            shipit.log(chalk.green('Uploaded') + ' ' + relpath);
          }

          function errored(err) {
            shipit.log(chalk.red('Error uploading') + ' ' + relpath + ' ' + err.stack);
          }
        });
      }
    };

  }
};
