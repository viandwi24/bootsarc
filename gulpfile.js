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
var beautify        = require('gulp-beautify');

// 
const scssPaths = [
    "./src/sass/bootsarc.bootstrap.scss"
];


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
    gulp.src(scssPaths)
        .pipe(sass({}))
        .pipe(gulp.dest("dist/css/"))
        .pipe(browserSync.stream())
);
gulp.task('css:build:prod', ()  => 
    gulp.src(scssPaths)
        .pipe(sass({
            outputStyle: 'compressed'
        }))
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
    gulp.src(scssPaths)
        .pipe(stylelint({
            failAfterError: true,
            reporters: [
                { formatter: 'string', console: true }
            ],
            debug: true
        }))
);
gulp.task('html:format', () => {
    return gulp.src('./pages/**/*.html')
        .pipe(beautify.html({
            "indent_size": "2",
            "indent_char": " ",
            "max_preserve_newlines": "-1",
            "preserve_newlines": false,
            "keep_array_indentation": false,
            "break_chained_methods": false,
            "indent_scripts": "normal",
            "brace_style": "collapse",
            "space_before_conditional": true,
            "unescape_strings": false,
            "jslint_happy": false,
            "end_with_newline": true,
            "wrap_line_length": "0",
            "indent_inner_html": false,
            "comma_first": false,
            "e4x": true,
            "indent_empty_lines": false
        }))
        .pipe(gulp.dest('./pages'))
})
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
gulp.task('build', gulp.series('css:lint', 'js:build', 'css:build:prod', 'html:build', 'html:format'));
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