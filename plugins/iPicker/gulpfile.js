// less
var runSequence = require('gulp-run-sequence');
var gulp = require('gulp');
var del = require('del');
var path = require('path');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var filter = require('gulp-filter');
var rename = require('gulp-rename');

// var concat = require('gulp-concat')
var postCssCfg = [
  autoprefixer({
    browsers: ['> 1%', 'last 2 version']
  })
];
var devPath = {
  page: {
    less: '*.less',
    js: 'dev/page/**/*.js',
    php: 'dev/page/**/*.php'
  }
}
var distPath = {
  page: {
    css: '',
    js: 'public/js',
    php: 'resources/views'
  }
}
gulp.task('compiler-less', function() {
  return gulp.src(devPath.page.less)
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss(postCssCfg))
    .pipe(gulp.dest(''))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(postcss([cssnano()]))
    .pipe(gulp.dest(''))
    // .pipe(notify({
    //   message: 'Styles task complete'
    // }))
});

gulp.task('watch-less', function() {
  runSequence(['compiler-less'])
  gulp.watch(devPath.page.less, ['compiler-less'])
})
