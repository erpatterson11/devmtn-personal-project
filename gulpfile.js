// REQUIRE DEPENDENCIES
// ============================================================
const gulp = require('gulp')
const concat = require('gulp-concat')
const annotate = require('gulp-ng-annotate')
const uglify = require('gulp-uglify')
const sass = require('gulp-sass')
const merge = require('merge-stream')
const babel = require('gulp-babel')
const gutil = require('gulp-util')
const sourcemap = require('gulp-sourcemaps')
// const CacheBuster = require('gulp-cachebust')
// const cachebust = new CacheBuster()


// let changeEvent = function(evt) {
//     gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', gutil.colors.magenta(evt.type))
// }

// DECLARE FILE PATHS
// ============================================================
let paths = {
  jsSource: ['./public/app/**/*.js', '!/public/bundle.js'],
  cssSource: ['./public/app/**/*.css'],
  sassSource: ['./public/app/**/*.sass'],
  indexSource: ['./public/index.html'],
  htmlSource: ['./public/app/**/*.html'],
  mediaSource: ['./public/app/**/*.svg', './public/app/**/*.png', './public/app/**/*.wav', './public/app/**/*.jpg'],
  fontSource: ['./public/app/**/*.ttf', './public/app/**/*.woff'],
  iconSource: ['./public/favicon/*']
}

// DEFINE TASKS
// ============================================================
gulp.task('js', function() {
  return gulp.src(paths.jsSource)
  .pipe(sourcemap.init())
  .pipe(babel({ presets: ['es2015', 'es2016'] }))
  .pipe(concat('bundle.js'))
  .pipe(annotate())
  // .pipe(uglify()) 
  .pipe(gulp.dest('./dist'))
})

gulp.task('css/sass', function() {
  let scssStream = gulp.src(paths.sassSource)
     .pipe(sass())
  let cssStream = gulp.src(paths.cssSource)
  let mergedStream = merge(scssStream,cssStream)
      .pipe(concat('bundle.css'))
      .pipe(gulp.dest('./dist'))
  return mergedStream
})

gulp.task('index', function() {
  return gulp.src(paths.indexSource)
    .pipe(gulp.dest('./dist'))
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

gulp.task('icon', function() {
  return gulp.src(paths.iconSource)
  .pipe(gulp.dest('./dist/favicon'))
})


// WATCH TASK
// ============================================================
gulp.task('watch', function() {
  gulp.watch(paths.jsSource, ['js'])
  gulp.watch(paths.sassSource, ['css/sass'])
  gulp.watch(paths.cssSource, ['css/sass'])
  gulp.watch(paths.indexSource, ['index'])
  gulp.watch(paths.htmlSource, ['html'])
  gulp.watch(paths.mediaSource, ['media'])
  gulp.watch(paths.fontSource, ['font'])
  gulp.watch(paths.iconSource, ['icon'])
})
// DEFAULT TASK - first thing to run when gulp is called
// ============================================================
gulp.task('default', ['watch', 'js', 'css/sass', 'index', 'html', 'media', 'font', 'icon'])
