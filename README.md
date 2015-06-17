# shipit-aws

WORK IN PROGRESS

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/shipitjs/shipit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/welcoMattic/shipit-aws.svg?branch=master)](https://travis-ci.org/welcoMattic/shipit-aws)
[![Dependency Status](https://david-dm.org/welcoMattic/shipit-aws.svg?theme=shields.io)](https://david-dm.org/welcoMattic/shipit-aws)
[![devDependency Status](https://david-dm.org/welcoMattic/shipit-aws/dev-status.svg?theme=shields.io)](https://david-dm.org/welcoMattic/shipit-aws#info=devDependencies)

[Shipit](https://github.com/shipitjs/shipit) task for interact with AWS

s3 task is heavily based on [gulp-s3-upload](https://github.com/clineamb/gulp-s3-upload), thanks [@clineamb](https://github.com/clineamb/) for your work.

**Features:**

- Synchronize assets with your s3 instance

## Install

```
npm install shipit-aws --save-dev
```

## Usage

### Example

`aws.json`
```json
{
  "accessKeyId": "YourAccessKeyId",
  "secretAccessKey": "YourSecretAccessKey",
  "Bucket": "YourBucket",
  "ACL": "public-read",
  "region": "eu-west-1",
  "syncedFolders": [
    "path/to/folders/to/sync"
    "wildcards/supported/**/*.*"
  ]
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

## License

MIT
