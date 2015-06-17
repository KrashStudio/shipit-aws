var
  cp = require('child_process'),
  test = require('tap').test,
  whereis = require('./');

test("when which found our program", function(t) {
  cp.exec = function(name, cb) {
    cb(null, '/etc/bin');
  };

  whereis('bin', function(err, path) {
    t.equal(path, '/etc/bin', 'bin was found');
    t.end();
  });
});

test("when which did not found, whereis found it", function(t) {
  var callcount = 0;
  cp.exec = function(name, cb) {
    if (callcount === 0) {
      callcount++;
      cb(null, 'not found bin');
    } else {
      cb(null, 'bin: /etc/bin');
    }
  };

  whereis('bin', function(err, path) {
    t.equal(path, '/etc/bin', 'bin was found');
    t.end();
  });
});

test("when which did not found, whereis did not found, where will find", function(t) {
  var callcount = 0;
  cp.exec = function(name, cb) {
    if (callcount < 2) {
      callcount++;
      cb(null, 'not found bin');
    } else {
      cb(null, 'C:\\etc\\bin');
    }
  };

  whereis('bin', function(err, path) {
    t.equal(path, 'C:\\etc\\bin', 'bin was found');
    t.end();
  });
});

test("when which found it and output has linebreak", function(t) {
  cp.exec = function(name, cb) {
    cb(null, '/etc/bin\n');
  };

  whereis('bin', function(err, path) {
    t.equal(path, '/etc/bin', 'bin was found');
    t.end();
  });
});
