var gulp = require('gulp');
var replace = require('gulp-replace');
var info = require('./package.json');
var args = require('yargs').argv;
var exec = require('child_process').exec;

// $ gulp bump -v x.x.x
gulp.task('bump', function () {
  gulp.src([
    'package.json'
  ])
  .pipe(replace('"version": "' + info.version + '"', '"version": "' + args.v || args.version + '"'))
  .pipe(gulp.dest(function(file) {
    return file.base;
  }));
  var child = exec('git tag ' + args.v || args.version, {}, function() {});
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stdout);
});