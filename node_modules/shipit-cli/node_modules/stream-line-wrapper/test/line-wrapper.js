var expect = require('chai').expect;
var LineWrapper = require('../lib/line-wrapper');

describe('Line prefixer', function () {
  it('should add a prefix and a suffix (simple)', function (done) {
    var lineWrapper = new LineWrapper({ prefix: '@', suffix: 'X' });
    var result = '';

    lineWrapper.on('data', function (data) {
      result += data.toString();
    });

    lineWrapper.on('end', function () {
      expect(result).to.equal('@hello worldX\r');
      done();
    });

    lineWrapper.write('hello ');
    lineWrapper.end('world\r');
  });

  it('should add a prefix and a suffix (complicated)', function (done) {
    var lineWrapper = new LineWrapper({ prefix: '@', suffix: 'X' });
    var result = '';

    lineWrapper.on('data', function (data) {
      result += data.toString();
    });

    lineWrapper.on('end', function () {
      expect(result).to.equal('@helloX\n@worldX\n@test worldX\r');
      done();
    });

    lineWrapper.write('hello\nworld\ntest ');
    lineWrapper.end('world\r');
  });

  it('should wrap each lines', function (done) {
    var lineWrapper = new LineWrapper({ wrapper: prefixLines });
    var result = '';

    function prefixLines(line, cb) {
      cb(null, 'x' + line);
    }

    lineWrapper.on('data', function (data) {
      result += data.toString();
    });

    lineWrapper.on('end', function () {
      expect(result).to.equal('xhello world\r');
      done();
    });

    lineWrapper.write('hello ');
    lineWrapper.end('world\r');
  });
});