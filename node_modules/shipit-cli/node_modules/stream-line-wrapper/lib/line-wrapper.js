/**
 * Module dependencies.
 */

var stream = require('stream');
var util = require('util');
var async = require('async');

/**
 * Expose module.
 */

module.exports = LineWrapper;

/**
 * Create a new line wrapper.
 *
 * @param {Object} options
 * @param {Object} options.prefix
 * @param {Object} options.suffix
 * @param {Object} options.wrapper
 */

function LineWrapper(options) {
  stream.Transform.apply(this, arguments);
  this.prefix = options.prefix || '';
  this.suffix = options.suffix || '';
  this.wrapper = options.wrapper;
  this.buffer = '';
}

/**
 * Inherits from Transform stream.
 */

util.inherits(LineWrapper, stream.Transform);

/**
 * Line RegExp.
 */

var lineRegExp = /(.*)(\r\n|\r|\n)/gm;

/**
 * Transform method.
 *
 * @param {Buffer} chunk
 * @param {String} encoding
 * @param {Function} cb
 */

LineWrapper.prototype._transform = function (chunk, encoding, cb) {
  // Convert chunk to string.
  var str = this.buffer + chunk.toString();
  var lines = getLines(str);

  this.buffer = lines.reduce(function (str, line) {
    return str.replace(line, '');
  }, str);

  if (this.wrapper) {
    async.map(lines, this.wrapper, function (err, wrappedLines) {
      if (err) return cb(err);

      // Push wrapped string to stream.
      this.push(wrappedLines.join(''));
      cb();

    }.bind(this));

    return ;
  }

  lines.forEach(function (line) {
    this.push(line.replace(lineRegExp, this.prefix + '$1' + this.suffix + '$2'));
  }.bind(this));

  cb();
};


/**
 * Return lines from a string.
 *
 * @param {String} str
 * @returns {String[]}
 */

function getLines(str) {
  var result;
  var lines = [];

  while(result = lineRegExp.exec(str)) {
    lines.push(result[0]);
  }

  return lines;
}