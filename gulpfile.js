// REQUIRE DEPENDENCIES
// ============================================================
let gulp = require('gulp');
let concat = require('gulp-concat');
let annotate = require('gulp-ng-annotate');
let uglify = require('gulp-uglify');
let sass = require('gulp-sass');
let merge = require('merge-stream');
let debug = require('gulp-debug');
let plumber = require('gulp-plumber');
let gutil = require('gulp-util');

let changeEvent = function(evt) {
    gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
};
// DECLARE FILE PATHS
// ============================================================
let paths = {
  jsSource: ['./public/app/**/*.js', '!/public/bundle.js'],
  cssSource: ['./public/app/**/*.css'],
  sassSource: ['./public/app/**/*.sass'],
  indexSource: ['./public/index.html'],
  htmlSource: ['./public/app/**/*.html'],
  mediaSource: ['./public/app/**/*.svg', './public/app/**/*.png', './public/app/**/*.wav', './public/app/**/*.jpg'],
  fontSource: ['./public/app/**/*.ttf', './public/app/**/*.woff']
};
// DEFINE TASKS
// ============================================================
gulp.task('js', function() {
  return gulp.src(paths.jsSource)
  // .pipe(plumber([{ showStack: true},{errorHandler: (err) => {
  //   console.log(err)
  //   this.emit('end')
  // }}]))
  // .pipe(debug({title: 'unicorn:'}))
  .pipe(concat('bundle.js'))
  .pipe(annotate())
  // .pipe(uglify()) //Uncomment when code is production ready
  .pipe(gulp.dest('./dist'));
});

gulp.task('css/sass', function() {
  let scssStream = gulp.src(paths.sassSource)
     .pipe(sass())
  let cssStream = gulp.src(paths.cssSource)
  let mergedStream = merge(scssStream,cssStream)
      .pipe(concat('bundle.css'))
      .pipe(gulp.dest('./dist'))
  return mergedStream
});

gulp.task('index', function() {
  return gulp.src(paths.indexSource)
    .pipe(gulp.dest('./dist'));
})

gulp.task('html', function() {
  return gulp.src(paths.htmlSource)
    .pipe(gulp.dest('./dist/app'))
})

gulp.task('media', function() {
  return gulp.src(paths.mediaSource)
  .pipe(gulp.dest('./dist/app'))
})

gulp.task('font', function() {
  return gulp.src(paths.fontSource)
  .pipe(gulp.dest('./dist/app'))
})

// WATCH TASK
// ============================================================
gulp.task('watch', function() {
  gulp.watch(paths.jsSource, ['js']);
  gulp.watch(paths.sassSource, ['css/sass']);
  gulp.watch(paths.cssSource, ['css/sass'])
  gulp.watch(paths.indexSource, ['index']);
  gulp.watch(paths.htmlSource, ['html']);
  gulp.watch(paths.mediaSource, ['media'])
  gulp.watch(paths.fontSource, ['font'])
});
// DEFAULT TASK - first thing to run when gulp is called
// ============================================================
gulp.task('default', ['watch', 'js', 'css/sass', 'index', 'html', 'media', 'font']);
