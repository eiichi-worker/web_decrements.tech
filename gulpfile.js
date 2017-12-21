var gulp = require('gulp')
var nunjucksRender = require('gulp-nunjucks-render')
var runSequence = require('run-sequence')
var del = require('del')
var browserSync = require('browser-sync')
var reload = browserSync.reload
var ghPages = require('gulp-gh-pages')

gulp.task('default', function (callback) {
  return runSequence(
    'clean',
    [
      'nunjucks',
      'static'
    ],
    callback
  )
})

gulp.task('deploy', function (callback) {
  return runSequence(
    'clean',
    [
      'nunjucks',
      'static'
    ],
    'github-page-push',
    callback
  )
})

gulp.task('clean', function (cb) {
  return del(['dist/**/*'], cb)
})

gulp.task('nunjucks', function () {
  return gulp.src([
    'src/template/**/*.njk',
    '!src/template/_layout/*.njk',
    '!src/template/_parts/*.njk'
  ]).pipe(nunjucksRender({
    path: ['src/template/']
  })).pipe(gulp.dest('dist'))
})

gulp.task('static', function () {
  return gulp.src('src/static/**/*').pipe(gulp.dest('dist/'))
})

gulp.task('server', function () {
  browserSync({
    notify: false,
    server: {
      baseDir: 'dist'
    }
  })

  gulp.watch('src/static/**/*', ['static'])
  gulp.watch('src/template/**/*', ['nunjucks'])
  gulp.watch('dist/**/*', reload)
})

gulp.task('github-page-push', function () {
  return gulp.src('dist/**/*')
    .pipe(ghPages())
})
