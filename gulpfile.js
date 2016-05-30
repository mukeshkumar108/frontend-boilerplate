var gulp = require('gulp'),
	  watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    path = require('path'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    cache = require('gulp-cache'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    runSequence = require('run-sequence');

// Task to compile SCSS
gulp.task('sass', function () {
  return gulp.src('./src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: false,
      paths: [ path.join(__dirname, 'scss', 'includes') ]
    })
    .on("error", notify.onError(function(error) {
      return "Failed to Compile SCSS: " + error.message;
    })))
    .pipe(autoprefixer())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./src/css/'))
    .pipe(gulp.dest('./app/assets/css/'))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(notify("SCSS Compiled Successfully :)"));
});

// Task to Minify JS
gulp.task('jsmin', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./app/assets/js/'));
});

// Minify Images
gulp.task('imagemin', function (){
  return gulp.src('./src/img/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('./app/assets/img'));
});

// BrowserSync Task (Live reload)
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: './app/'
    }
  })
});

// Gulp Watch Task
gulp.task('watch', ['browserSync'], function () {
   gulp.watch('./src/scss/**/*', ['sass']);
   gulp.watch('./app/**/*.html').on('change', browserSync.reload);
});

// Gulp Clean Up Task
gulp.task('clean', function() {
  del('app');
});

// Gulp Default Task
gulp.task('default', ['watch']);

// Gulp Build Task
gulp.task('build', function() {
  runSequence('clean', 'sass', 'imagemin', 'jsmin');
});