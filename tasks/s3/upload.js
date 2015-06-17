var fs = require('graceful-fs');
var path = require('path');

var aws = require('aws-sdk');
var chalk = require('chalk');
var glob = require('glob');
var md5 = require('MD5');
var mime = require('mime');
var minimatch = require('minimatch');
var Promise = require('bluebird');

/**
 * Upload task.
 * - Upload your assets on your Amazon s3 instance
 */

module.exports = function (gruntOrShipit) {
  registerTask(gruntOrShipit, 's3:upload', task);

  function task() {
    var shipit     = getShipit(gruntOrShipit);
    var awsConfig  = shipit.config.awsConfig;
    var S3         = new AWS.S3(awsConfig);

    S3.headObject = Promise.promisify(S3.headObject);
    S3.putObject  = Promise.promisify(S3.putObject);

    var newFiles      = 0;
    var updatedFiles  = 0;
    var noChangeFiles = 0;
    var errorFiles    = [];

    return sync()
    .then(function () {
      shipit.emit('uploaded');
    });

    /**
     * Upload your assets.
     */
    function sync() {

      var syncedFolders = awsConfig.syncedFolders;
      delete awsConfig.syncedFolders;

      if (!awsConfig.Bucket) {
        throw new Error(chalk.red('[Error] Bucket name is missing'));
      }

      shipit.log('Uploading assets on ' + chalk.blue(awsConfig.Bucket) + ' bucket \n');

      var globs = parseFolders(syncedFolders);

      return Promise.all(globs).then(function(filenames) {
        var flattenedFilenames = _.flattenDeep(filenames);
        var files = _.map(readFiles(flattenedFilenames), function(file, index) {
          var tempFilename = flattenedFilenames[index].replace('app/web/', '');
          return sendToS3(file, tempFilename);
        });
        return Promise.all(files).then(function(res) {
          shipit.log('\n');
          shipit.log(chalk.green(newFiles + ' new files uploaded.'));
          shipit.log(chalk.yellow(updatedFiles + ' files updated.\n'));
          if (errorFiles.length) {
            shipit.log(chalk.bgRed('Error on ' + errorFiles.length + ' : \n'));
            _.each(errorFiles, function(errorFile) {
              shipit.log(chalk.red(errorFile.filename) + ' : \n');
              shipit.log(chalk.red(errorFile.stack) + '\n\n');
            });
          }

          return true;
        });
      });

    }

    function parseFolders(folders) {
      var globs = _.map(folders, function(folder) {
        return glob(folder);
      });

      return globs;
    }

    function readFiles(filenames) {
      var files = _.map(filenames, function(filename, index) {
        return read(filename);
      });
      return files;
    }

    function sendToS3(file, filename) {
      var keyname = awsConfig.keyTransform(filename);
      var awsObj = {
        Bucket: awsConfig.Bucket,
        Key:    keyname
      };

      if (_.isNull(file)) {
        throw new Error(chalk.red('File ' + filename + ' is null'));
      }

      var res = S3.headObject(awsObj).then(function(headData) {
        var md5File = md5(file);
        var ETag = headData.ETag.substring(1, headData.ETag.length - 1);

        if (md5File == ETag) {
          // object exists on S3 bucket AND is exactly the same as local
          shipit.log(chalk.gray('No change : ') + awsObj.Key);
          noChangeFiles++;
          return Promise.resolve();
        } else {
          awsObj.Body = file;
          return upload(awsObj, headData);
        }

      }, function(headErr) {
        // object doesn't exist on S3 bucket
        awsObj.Body = file;
        return upload(awsObj);
      });

      return res;
    }

    function upload(awsObj, headData) {
      return S3.putObject(awsObj).then(function(putData) {
        if (headData && putData) {
          // object exists on S3 bucket and need to be updated
          if (headData.ETag !== putData.ETag) {
            shipit.log(chalk.yellow('Updated : ') + awsObj.Key);
          }
          updatedFiles++;
        } else {
          // object doesn't exist on S3 bucket
          shipit.log(chalk.green('Uploaded : ') + awsObj.Key);
          newFiles++;
        }

        return Promise.resolve();
      }, function(putErr) {
        shipit.log(chalk.red('Error on uploading object ') + awsObj.Key);
        errorFiles.push({
          filename: filename,
          stack: putErr.stack
        });

        return Promise.reject();
      });
    }

  }
};
