var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var proxy = require('http-proxy-middleware');
var cleanCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var templateCache = require('gulp-angular-templatecache');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var debug = require('debug')('gulp:prod');
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');


var BUILD_PATH = path.join('./build');
var UGLIFY_IE8_SUPPORT_SETTING = {
    compress: { screw_ie8: false },
    mangle: { screw_ie8: false },
    output: { screw_ie8: false }
};

//dev:sass
gulp.task('dev:sass', function() {
    return gulp.src('./styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(path.join(BUILD_PATH, 'css')))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//dev:script
gulp.task('dev:script', function() {
    return gulp.src(['./app/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(BUILD_PATH, 'js')))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//dev:vendors
gulp.task('dev:vendors', function() {
    // content
    return gulp.src(['./vendors/base/**/*.js', './vendors/lib/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('vendors.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(BUILD_PATH, 'js')))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//dev:shim
gulp.task('dev:shim', function() {
    // content
    return gulp.src(['./vendors/shim/**/*.js'])
        .pipe(concat('shim.js'))
        .pipe(gulp.dest(path.join(BUILD_PATH, 'js')));
});

//http 代理
var proxyMiddleware = proxy(['/paper'], {
    target: 'http://10.122.252.79:8080',
    logLevel: 'debug',
    pathRewrite: {}
});

//dev:browserSync
gulp.task('dev:browserSync', function() {
    content
    browserSync.init({
            server: {
                baseDir: './build',
                middleware: [
                    proxyMiddleware
                ]
            },
            port: 4000,
            logSnippet: false,
            open: false
        })
        // browserSync.init({
        //     port: 4000,
        //     proxy: '10.122.252.79:8080'
        // })
});

//angular templates
gulp.task('angular:template', function() {
    return gulp.src('./app/templates/**/*.html')
        .pipe(templateCache({
            module: 'ct.templates',
            standalone: true
        }))
        .pipe(gulp.dest('./app/templates/'));
});

//angular template script
gulp.task('dev:template:script', ['angular:template'], function() {
    gulp.start('dev:script');
});


//prod:vendors
gulp.task('prod:vendors', function() {
    // content
    return gulp.src(['./vendors/base/**/*.js', './vendors/lib/**/*.js'])
        .pipe(concat('vendors.js'))
        .pipe(uglify(UGLIFY_IE8_SUPPORT_SETTING))
        .pipe(gulp.dest(path.join(BUILD_PATH, 'js')));
});

//prod:shim
gulp.task('prod:shim', function() {
    // content
    return gulp.src(['./vendors/shim/**/*.js'])
        .pipe(concat('shim.js'))
        .pipe(uglify(UGLIFY_IE8_SUPPORT_SETTING))
        .pipe(gulp.dest(path.join(BUILD_PATH, 'js')));
});


//delete folder
gulp.task('del', function() {
    debug('delete build folder');
    return gulp.src(BUILD_PATH)
        .pipe(clean());
});

//sprites
gulp.task('sprites', function() {
    var spriteData = gulp.src('./sprites/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css',
        imgPath: '../images/sprite.png'
    }));

    var imgStream = spriteData.img
        .pipe(gulp.dest(path.join(BUILD_PATH, 'images')));

    var cssStream = spriteData.css
        .pipe(gulp.dest(path.join(BUILD_PATH, 'css')));
    return merge(imgStream, cssStream);
});

//模板
gulp.task('template', function() {
    // content
    return gulp.src(['./index.html'])
        .pipe(gulp.dest(BUILD_PATH))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//move static resources
gulp.task('move:static', function() {
    return gulp.src('./static/**/*')
        .pipe(gulp.dest('./build'));
});

//prod:sass
gulp.task('prod:sass', function() {
    return gulp.src('./styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCss({ compatibility: 'ie8' }))
        .pipe(gulp.dest(path.join(BUILD_PATH, 'css')));
});

//prod:script
gulp.task('prod:script', ['angular:template'], function() {
    return gulp.src(['./app/**/*.js'])
        .pipe(concat('main.js'))
        .pipe(uglify(UGLIFY_IE8_SUPPORT_SETTING))
        .pipe(gulp.dest(path.join(BUILD_PATH, 'js')));
});


//dev
gulp.task('dev', ['del'], function() {
    gulp.start(['dev:browserSync', 'dev:script', 'dev:vendors', 'dev:sass', 'move:static', 'dev:shim', 'sprites', 'template'], function(param) {
        gulp.watch(['./app/**/*.js'], ['dev:script']);
        gulp.watch(['./vendors/**/*.js'], ['dev:vendors']);
        gulp.watch(['./app/templates/**/*.html'], ['dev:template:script']);
        gulp.watch('./styles/**/*.scss', ['dev:sass']);
        gulp.watch('./static/**', ['move:static']);
        gulp.watch('./sprites/*.png', ['sprites']);
        gulp.watch('./*.html', ['template']);
    });
});

//prod
gulp.task('prod', ['del'], function() {
    debug('begin to package');
    gulp.start(['prod:sass', 'prod:script', 'move:static', 'prod:vendors', 'prod:shim', 'sprites', 'template'], function(param) {
        debug('package completed!');
    });
});