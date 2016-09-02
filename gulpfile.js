var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var cleanCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var path = require('path');

var BUILD_PATH = path.join('./build');


//dev:sass
gulp.task('dev:sass', function() {
    gulp.src('./styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(path.join(BUILD_PATH, 'css')))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//dev:script
gulp.task('dev:script', function() {
    gulp.src(['./app/**/*.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest(path.join(BUILD_PATH, 'js')))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//dev:browserSync
gulp.task('dev:browserSync', function() {
    // content
    browserSync.init({
        server: {
            baseDir: './'
        },
    })
});

//dev
gulp.task('dev', ['dev:browserSync', 'dev:script', 'dev:sass'], function() {
    gulp.watch('./app/**/*.js', ['dev:script']);
    gulp.watch('./styles/**/*.scss', ['dev:sass']);
    gulp.watch('./*.html', browserSync.reload());
});