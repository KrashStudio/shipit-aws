# shipit-aws

[![Build Status](https://travis-ci.org/KrashStudio/shipit-aws.svg?branch=master)](https://travis-ci.org/KrashStudio/shipit-aws)
[![Code Climate](https://codeclimate.com/repos/558bf8ede30ba05066000018/badges/57c373a9fdd25d99ca0f/gpa.svg)](https://codeclimate.com/repos/558bf8ede30ba05066000018/feed)
[![Dependency Status](https://david-dm.org/KrashStudio/shipit-aws.svg?theme=shields.io)](https://david-dm.org/KrashStudio/shipit-aws)
[![devDependency Status](https://david-dm.org/KrashStudio/shipit-aws/dev-status.svg?theme=shields.io)](https://david-dm.org/KrashStudio/shipit-aws#info=devDependencies)

[Shipit](https://github.com/shipitjs/shipit) task for interact with AWS s3

s3 task is based on [gulp-s3-upload](https://github.com/clineamb/gulp-s3-upload), thanks [@clineamb](https://github.com/clineamb/) for your work.

**Features:**

- Synchronize assets with your s3 instance

## Install

```
npm install KrashStudio/shipit-aws --save-dev
```

## Usage

### Example

Configuration file

`aws.json`
```json
{
  "accessKeyId": "ACCESS_KEY_ID",
  "secretAccessKey": "SECRET_ACCESS_KEY",
  "region": "REGION",
  "params": {
    "ACL": "ACL",
    "Bucket": "BUCKET_NAME",
    "StorageClass": "REDUCED_REDUNDANCY"
  },
  "syncParams": {
    "dirname": "NAME_OF_THE_DIR_YOU_WANT_TO_SYNC",
    "options": {
      "base": "BASE_RELATIVE_PATH_OF_THE_DIR_YOU_WANT_TO_SYNC",
      "whitelist": ["DIRNAMES", "OF", "YOUR", "ASSETS"],
      "blacklist": [
        "RELATIVE_PATTERNS_OF_DIRS_YOU_DONT_WANT_TO_SYNC",
        "**/*",
        "!**/*.md",
        "!**/*.log",
        "!**/*.coffee",
        "!**/*.map"
      ]
    }
  }
}
```

`shipitfile.js`
```js
module.exports = function (shipit) {
  require('shipit-aws')(shipit);
  var aws = require('./aws.json');

  shipit.initConfig({
    default: {
      ...
      aws: aws,
      ...
    }
  });

  ...

  shipit.run('s3');
};
```

If you want to sync your S3 through CLI, you can execute:

`$ shipit YOUR_ENV s3`

## Todo

+ [ ] Improve log rendering (make it customizable)
+ [ ] Add support for other AWS services


## Contributors

- [welcoMattic](https://github.com/welcoMattic)

## License

MIT
