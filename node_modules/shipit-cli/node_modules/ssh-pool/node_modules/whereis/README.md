node-whereis [![Dependency Status](https://david-dm.org/vvo/node-whereis.svg)](https://david-dm.org/vvo/node-whereis) [![devDependency Status](https://david-dm.org/vvo/node-whereis/dev-status.svg)](https://david-dm.org/vvo/node-whereis#info=devDependencies)
============

Simply get the first path to a bin on any system.

```js
var whereis = require('whereis');
whereis('wget', function(err, path) {
  console.log(path);
});
// /usr/bin/wget
```

[![Build Status](https://secure.travis-ci.org/vvo/node-whereis.png?branch=master)](http://travis-ci.org/vvo/node-whereis)
