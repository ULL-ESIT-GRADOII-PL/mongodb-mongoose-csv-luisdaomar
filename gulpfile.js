var gulp    = require('gulp'),
    gutil   = require('gulp-util'),
    uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat');
var karma   = require('gulp-karma');
var ghPages = require('gulp-gh-pages');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var minify = require('gulp-minify');
var del     = require('del');
var gulp    = require('gulp');
var shell = require('gulp-shell');


gulp.task('minify', function() {
  return gulp.src('index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('minified'))
});

gulp.task('minify-css', function() {
  return gulp.src('vendor/mocha.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('minified'));
})

gulp.task('compress', function() {
  gulp.src('js/*.js')
    .pipe(minify({
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('minified'))
});

gulp.task('test', function() {
  // Be sure to return the stream
  return gulp.src([])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('clean', function(cb) {
  del(['minified/*'], cb);
});

gulp.task('deploy', function() {
     return gulp.src('./minified/**/*')
       .pipe(ghPages());
   });

gulp.task('default', ['minify', 'minify-css', 'compress'], function() {
  gulp.src([])
     .pipe(karma({
       configFile: 'karma.conf.js',
       action: 'watch'
     }));
 });

 // npm install supervisor -g
gulp.task('server', function () {
  return gulp.src('').pipe(shell([ 'node-supervisor app.js' ]));
});
