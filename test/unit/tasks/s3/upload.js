var sinon = require('sinon');
require('sinon-as-promised');
var expect = require('chai').use(require('sinon-chai')).expect;
var Shipit = require('shipit-cli');
var uploadFactory = require('../../../../tasks/s3/upload');

describe('s3:upload task', function () {
  var shipit;

  beforeEach(function () {
    shipit = new Shipit({
      environment: 'test',
      log: sinon.stub()
    });

    uploadFactory(shipit);

    // Shipit config
    shipit.initConfig({
      test: {
        awsConfig: {
          "accessKeyId": "xxxxxxxxxxxxxxxxxxxx",
          "secretAccessKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
          "Bucket": "mybucket",
          "ACL": "public-read",
          "region": "eu-west-1",
          "syncedFolders": [
            "api/web/media/**/*.*"
          ]
        }
      }
    });

  });

  it('should have an awsConfig object, contains Bucket and good-size accessKeyId and secretAccessKey', function (done) {
    shipit.start('s3:upload', function (err) {
      if (err) return done(err);
      expect(shipit.config.awsConfig).to.be.an('object');
      expect(shipit.config.awsConfig.accessKeyId).to.have.length(20);
      expect(shipit.config.awsConfig.secretAccessKey).to.have.length(40);
      expect(shipit.config.awsConfig.Bucket).to.exist();
      done();
    });
  });

});
