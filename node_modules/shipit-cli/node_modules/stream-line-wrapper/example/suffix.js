var LineWrapper = require('../');
var ls = require('child_process').exec('ls');
var lineWrapper = new LineWrapper({ suffix: ' +' });
ls.stdout.pipe(lineWrapper).pipe(process.stdout);