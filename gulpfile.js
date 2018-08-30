var gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    sass        = require('gulp-sass'),
    prefix      = require('gulp-autoprefixer'),
    shell       = require('gulp-shell'),
    sourcemaps  = require('gulp-sourcemaps'),
    notify      = require("gulp-notify"),
    bower       = require('gulp-bower'),
    sassGlob    = require('gulp-sass-glob');

var config = {
    sassPath: './scss',
    bowerDir: './bower_components' 
}

/**
 * @task bower
 * Install bower dependencies
 */
gulp.task('bower', function() { 
    return bower()
         .pipe(gulp.dest(config.bowerDir)) 
});

/**
        * Launch the Server
 */
 gulp.task('browser-sync', ['sass'], function() {
 browserSync.init({
   // Change as required
   proxy: "him.kbox.site",
  reloadDelay: 1500,
  socket: {
      // For local development only use the default Browsersync local URL.
      //domain: 'localhost:3000'
      // For external development (e.g on a mobile or tablet) use an external URL.
      // You will need to update this to whatever BS tells you is the external URL when you run Gulp.
      domain: 'localhost:3000'
  }
 });
});

gulp.task('icons', function() { 
    return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*') 
        .pipe(gulp.dest('./css/fonts/fontawesome')); 
});

/**
        * @task sass
        * Compile files from scss
 */
gulp.task('sass', function () {
  return gulp.src(config.sassPath + '/main.scss')
  .pipe(sassGlob())
  .pipe(sourcemaps.init())
  .pipe(sass({
      outputStyle: 'compressed',
      includePaths: [
          './scss',
          config.bowerDir + '/css-reset-and-normalize-sass/scss',
          config.bowerDir + '/bootstrap-sass/assets/stylesheets',
          config.bowerDir + '/font-awesome/scss'
      ]
  }).on('error', notify.onError(function (error) {
          return "Error: " + error.message;
  })))
  .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('css'))
  .pipe(browserSync.stream())
});

/**
        * @task clearcache
        * Clear all caches
 */
gulp.task('clearcache', function() {
  return shell.task([
 'kd cc all'
  ]);
});

/**
        * @task reload
        * Refresh the page after clearing cache
 */
gulp.task('reload', ['clearcache'], function () {
  browserSync.reload();
});

/**
        * @task watch
        * Watch scss files for changes & recompile
        * Clear cache when Drupal related files are changed
 */
gulp.task('watch', function () {
  gulp.watch(['scss/*.scss', 'scss/**/*.scss'], ['sass']);
  gulp.watch('**/*.{php,inc,info}',['reload']);
});

/**
        * Default task, running kujust `gulp` will
        * compile Sass files, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
