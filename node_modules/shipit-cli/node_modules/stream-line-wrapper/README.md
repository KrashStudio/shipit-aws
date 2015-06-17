# Stream line wrapper [![Build Status](https://travis-ci.org/neoziro/stream-line-wrapper.png?branch=master)](https://travis-ci.org/neoziro/stream-line-wrapper)

Wrap each lines of a stream with a prefix, suffix or a custom function.

## Usage

```js
var childProcess = require('child_process');
var LineWrapper = require('stream-line-wrapper');
var ls = childProcess.exec('ls');

var lineWrapper = new LineWrapper({ prefix: '-- ' });
ls.stdout.pipe(lineWrapper).pipe(process.stdout);

// -- file1.js
// -- file2.js
// -- file3.js
```

## Options

### prefix

Prefix each lines with a string.

```js
var lineWrapper = new LineWrapper({ prefix: '-- ' });
ls.stdout.pipe(lineWrapper).pipe(process.stdout);

// -- file1.js
```

### suffix

Suffix each lines with a string.

```js
var lineWrapper = new LineWrapper({ suffix: ' @' });
ls.stdout.pipe(lineWrapper).pipe(process.stdout);

// file1.js @
```

### wrapper

Use a function to wrapper each lines.

```js
var lineWrapper = new LineWrapper({ wrapper: countChars });

/**
 * Prefix each lines with char count.
 *
 * @param {String} line
 * @param {Function} cb
 */

function countChars(line, cb) {
  return cb(null, '(' + line.length + ') ' + line);
}

ls.stdout.pipe(lineWrapper).pipe(process.stdout);

// (8) file1.js
```

## License

MIT
