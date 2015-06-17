var LineWrapper = require('../');
var ls = require('child_process').exec('ls');
var lineWrapper = new LineWrapper({ wrapper: countChars });

/**
 * Prefix each line with char count.
 *
 * @param {String} line
 * @param {Function} cb
 */

function countChars(line, cb) {
  return cb(null, '(' + line.length + ') ' + line);
}

ls.stdout.pipe(lineWrapper).pipe(process.stdout);