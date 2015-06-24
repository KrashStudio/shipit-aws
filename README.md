#[WORK IN PROGRESS]

# shipit-aws

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/shipitjs/shipit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/KrashStudio/shipit-aws.svg?branch=master)](https://travis-ci.org/KrashStudio/shipit-aws)
[![Dependency Status](https://david-dm.org/KrashStudio/shipit-aws.svg?theme=shields.io)](https://david-dm.org/KrashStudio/shipit-aws)
[![devDependency Status](https://david-dm.org/KrashStudio/shipit-aws/dev-status.svg?theme=shields.io)](https://david-dm.org/KrashStudio/shipit-aws#info=devDependencies)

[Shipit](https://github.com/shipitjs/shipit) task for interact with AWS

s3 task is heavily based on [gulp-s3-upload](https://github.com/clineamb/gulp-s3-upload), thanks [@clineamb](https://github.com/clineamb/) for your work.

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
    ACL: "ACL",
    Bucket: "BUCKET_NAME",
    StorageClass: "REDUCED_REDUNDANCY"
  },
  "syncParams": {
    "dirname": "RELATIVE_PATH_OF_DIR_TO_BE_SYNC",
    "options": {
      "base": ".",
      "whitelist": ["js", "css", "images"],
      "blacklist": [
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

`shipit YOUR_ENV s3`

## Todo

- [] Add support for other AWS services
- [] Improve log rendering (make it customizable)

## License

MIT
