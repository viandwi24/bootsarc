'use strict';

const path = require('path');
const fs = require('fs')
const spawn = require('child_process').spawn;

var gulp            = require('gulp');
var browserSync     = require('browser-sync').create();
var sass            = require('gulp-sass')(require('sass'));
var sourcemaps      = require('gulp-sourcemaps');
var autoprefixer    = require('gulp-autoprefixer');
var nunjucksRender  = require('gulp-nunjucks-render');
var data            = require('gulp-data');
var webpack         = require('webpack-stream');
var stylelint       = require('gulp-stylelint');


// ======================================================
//                      GULP TASK
// ======================================================
gulp.task('html:build', () => {
    var templateData = {}
    try { templateData = JSON.parse(fs.readFileSync('./src/templateData.json')); } catch (error) {}
    var getData = function(file) {
        return {
            ...templateData,
            file
        };
    }
    var manageEnv = function(environment) {
        Object.keys(templateData.dirs).forEach(function(key) {
            environment.addFilter(key, url => `/${templateData.dirs[key]}/${url}`);
        });
        environment.addFilter('slug', function(str) {
            return str && str.replace(/\s/g, '-', str).toLowerCase();
        });
    }
    return gulp.src('./src/pages/**/*.+(html|nunjucks)')
        .pipe(data(getData))
        .pipe(nunjucksRender({
            manageEnv,
            path: ['./src/layouts']
        }))
        .pipe(gulp.dest('pages'))
        .pipe(browserSync.stream())
});
gulp.task('css:build', ()  => 
    gulp.src("./src/sass/*.scss")
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer())
		.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("dist/css/"))
        .pipe(browserSync.stream())
);
gulp.task('js:build', () =>
    gulp.src('./dist/js/', { allowEmpty: true })
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(browserSync.stream())
);
gulp.task('css:lint', () =>
    gulp.src('./src/sass/*.scss')
        .pipe(stylelint({
            failAfterError: true,
            reporters: [
                { formatter: 'string', console: true }
            ],
            debug: true
        }))
);
gulp.task('watching', gulp.series('css:lint', 'js:build', 'css:build', 'html:build', function() {
    browserSync.init({
        open: false,
        ui: {
            port: 4000
        },
        server: {
            baseDir: "./",
            index: "index.html",
        },
        // middleware: function(req, res, next) {
        //     if (req.url === '/') {
        //         res.writeHead(301, { Location: '/pages/index.html' });
        //         res.end();
        //     }
        //     return next();
        // }
    });
    gulp.watch("./src/scripts/**/*.js", gulp.series('js:build'));
    gulp.watch("./src/sass/**/*.scss", gulp.series('css:lint', 'css:build'));
    gulp.watch("./src/**/*.+(html|nunjucks)", gulp.series('html:build'));
    gulp.watch("./src/templateData.json", gulp.series('html:build'));
    gulp.watch("./pages/**/*.html").on('change', browserSync.reload);
    gulp.watch("./assets/**/*.*").on('change', browserSync.reload);
}));

// ======================================================
//                      GULP COMMAND
// ======================================================
gulp.task('default', gulp.series('watching'));
gulp.task('build', gulp.series('css:lint', 'js:build', 'css:build', 'html:build'));
gulp.task('autoreload', function() {
    var p;
    gulp.watch('gulpfile.js', spawnChildren);
    spawnChildren();
    function spawnChildren(callback) {
        if(p) { p.kill(); }
        p = spawn('gulp', ['default'], { stdio: 'inherit' });
        if(callback) { callback(); }
    }
});