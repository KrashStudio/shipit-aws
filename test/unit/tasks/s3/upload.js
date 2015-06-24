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
        aws: {
          accessKeyId: 'xxxxxxxxxxxxxxxxxxxx',
          secretAccessKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          region: 'eu-west-1',
          params: {
            ACL: 'public-read',
            Bucket: 'tstbucket',
            StorageClass: 'REDUCED_REDUNDANCY'
          },
          syncParams: {
            dirname: 'web',
            options: {
              base: '.',
              whitelist: ['js', 'css', 'images'],
              blacklist: [
                '**/*',
                '!**/*.md',
                '!**/*.log',
                '!**/*.coffee',
                '!**/*.map'
              ]
            }
          }
        }
      }
    });

  });

  it('should have an aws object, contains Bucket and good-size accessKeyId and secretAccessKey', function (done) {
    shipit.start('s3:upload', function (err) {
      if (err) return done(err);
      expect(shipit.config.aws).to.be.an('object');
      expect(shipit.config.aws.params.Bucket).to.exist();
      expect(shipit.config.aws.accessKeyId).to.have.length(20);
      expect(shipit.config.aws.secretAccessKey).to.have.length(40);
      done();
    });
  });

  it('should have an aws.syncParams object, contains at least a dirname', function (done) {
    shipit.start('s3:upload', function (err) {
      if (err) return done(err);
      expect(shipit.config.aws.syncParams).to.be.an('object');
      expect(shipit.config.aws.syncParams.dirname).to.exist();
      done();
    });
  });

});
