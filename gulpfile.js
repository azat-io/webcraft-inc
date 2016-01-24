var batch = require('gulp-batch');
var browserSync = require('browser-sync').create();
var clean = require('gulp-clean');
var clearFix = require('postcss-clearfix');
var colorShort = require('postcss-color-short');
var concat = require('gulp-concat');
var cssMqpacker = require('css-mqpacker');
var cssNext = require('postcss-cssnext');
var focus = require('postcss-focus');
var gulp = require('gulp');
var imageOp = require('gulp-image-optimization');
var inlineSVG = require('postcss-inline-svg');
var jade = require('gulp-jade');
var nano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var precss = require('precss');
var propertySorter = require('css-property-sorter');
var px2Rem = require('postcss-pxtorem');
var rename = require("gulp-rename");
var responsiveImages = require('postcss-responsive-images');
var short = require ('postcss-short');
var size = require('postcss-size');
var uglify = require('gulp-uglify');
var uncss = require('gulp-uncss');
var watch = require('gulp-watch');
var zindex = require('postcss-zindex');

gulp.task('default', ['server'], function() {
  gulp.watch('src/jade/**', function(event) {
    gulp.run('jade');
  });
  gulp.watch('src/css/**', function(event) {
    gulp.run('postcss');
  });
  gulp.watch('src/jsx/**', function(event) {
    gulp.run('jsx');
  });
  gulp.watch('src/js/**', function(event) {
    gulp.run('js');
  });
  gulp.watch('src/images/**/*', batch(function (events, done) {
      gulp.start('images', done);
  }));
});

// Jade

gulp.task('jade', function() {
  gulp.src('src/jade/**/*.jade')
    .pipe(jade({
      pretty: true,
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.stream());
});

// PostCSS

gulp.task('postcss', function () {
  var processors = [
    colorShort,
    focus,
    precss,
    short,
    size,
    zindex,
    responsiveImages,
    inlineSVG,
    clearFix,
    px2Rem,
    cssNext({
      autoprefixer: 'ie >= 8, last 5 versions, > 2%'
    }),
    cssMqpacker,
    propertySorter
  ];
  return gulp.src('src/css/*.css')
    .pipe(postcss(processors))
    .pipe(uncss({
        html: ['dist/index.html']
    }))
    .pipe(nano())
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.stream());
});


// JavaScript

gulp.task('js', function() {
  gulp.src('src/js/*.js')
  .pipe(concat('main.js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'))
  .pipe(browserSync.stream());
});

// Image files

gulp.task('images', function(cb) {
  gulp.src(['src/images/**/*'])
  .pipe(imageOp({
    optimizationLevel: 5,
    progressive: true,
    interlaced: true
  }))
  .pipe(clean())
  .pipe(gulp.dest('dist/images')).on('end', cb).on('error', cb)
  .pipe(browserSync.stream());
});

// Server

gulp.task('server', function() {
  browserSync.init({
    server: {
      baseDir: "dist"
    },
    open: false
  });
});
