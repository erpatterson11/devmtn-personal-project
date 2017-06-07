// REQUIRE DEPENDENCIES
// ============================================================
var gulp = require('gulp');
var concat = require('gulp-concat');
var annotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass')
// DECLARE FILE PATHS
// ============================================================
var paths = {
  jsSource: ['./public/app/**/*.js', '!/public/bundle.js'],
  sassSource: ['./public/app/**/*.sass'],
  indexSource: ['./public/index.html'],
  htmlSource: ['./public/app/**/*.html'],
  mediaSource: ['./public/app/**/*.svg', './public/app/**/*.png', './public/app/**/*.wav', './public/app/**/*.jpg']
};
// DEFINE TASKS
// ============================================================
gulp.task('js', function() {
  return gulp.src(paths.jsSource)
  .pipe(concat('bundle.js'))
  .pipe(annotate())
  //.pipe(uglify()) //Uncomment when code is production ready
  .pipe(gulp.dest('./dist'));
});
gulp.task('sass', function() {
  console.log('sassed');
  return gulp.src(paths.sassSource)
    .pipe(sass())
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('./dist'));
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

// WATCH TASK
// ============================================================
gulp.task('watch', function() {
  gulp.watch(paths.jsSource, ['js']);
  gulp.watch(paths.sassSource, ['sass']);
  gulp.watch(paths.indexSource, ['index']);
  gulp.watch(paths.htmlSource, ['html']);
  gulp.watch(paths.mediaSource, ['media'])
});
// DEFAULT TASK - first thing to run when gulp is called
// ============================================================
gulp.task('default', ['watch', 'js', 'sass', 'index', 'html', 'media']);
