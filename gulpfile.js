const del = require('del');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const paths = {
  all: './src/**/*.*',
  scripts: './src/**/*.js',
  images: './src/**/*.{png,svg,jpg}',
  styles: './src/**/*.scss',
  html: './src/**/*.html',
  others: '!./src/**/*.{png,svg,jpg,scss,html}',
  dist: './dist',
};

gulp.task('scripts', () => {
  return gulp.src(paths.scripts)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel({
      presets: ['es2015', 'babili'],
    }))
    .pipe(plugins.concat('all.min.js'))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(`${paths.dist}/public/scripts/`));
});

gulp.task('styles', () => {
  return gulp.src(paths.styles)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.postcss([
      autoprefixer({
        browsers: ['last 2 versions'],
      }),
      cssnano,
    ]))
    .pipe(plugins.concat('all.min.css'))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(`${paths.dist}/public/styles/`));
});

gulp.task('images', () => {
  return gulp.src(paths.images)
    .pipe(plugins.imagemin())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('html', () => {
  return gulp.src(paths.html)
    .pipe(plugins.htmlmin({
      collapseWhitespace: true,
    }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('copy', () => {
  return gulp.src([paths.all, paths.others])
    .pipe(gulp.dest(paths.dist));
});

gulp.task('clean', (callback) => {
  return del(['dist'], callback);
});

gulp.task('build', ['clean'], (callback) => {
  runSequence(['scripts', 'styles', 'html', 'images'], callback);
});

gulp.task('watch', ['build'], () => {
  browserSync.init({
    server: {
      baseDir: paths.dist,
    },
    open: false,
  });

  gulp.watch([paths.scripts], ['scripts', browserSync.reload]);
  gulp.watch([paths.styles], ['styles', browserSync.reload]);
  gulp.watch([paths.html], ['html', browserSync.reload]);
  gulp.watch([paths.images], browserSync.reload);
});

