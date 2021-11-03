'use strict';

const path = require('path');
const fs = require('fs')

var gulp            = require('gulp');
var browserSync     = require('browser-sync').create();
var sass            = require('gulp-sass')(require('sass'));
var sourcemaps      = require('gulp-sourcemaps');
var autoprefixer    = require('gulp-autoprefixer');
var nunjucksRender  = require('gulp-nunjucks-render');
var data            = require('gulp-data');
var webpack         = require('webpack-stream');
var stylelint       = require('gulp-stylelint');

var templateData = {
    app: {
        name: 'Bootsarc'
    }
}
var getData = function(file) {
    return {
        ...templateData,
        file
    };
}
var manageEnv = function(environment) {
    environment.addFilter('dist', function(url) {
        return `/dist/${url}`
    });
    environment.addFilter('slug', function(str) {
        return str && str.replace(/\s/g, '-', str).toLowerCase();
    });
    // environment.addGlobal('globalTitle', 'My global title')
}


// ======================================================
//                      GULP TASK
// ======================================================
gulp.task('prepare', () => {
    return new Promise((resolve, reject) => {
        const dirs = ['./dist', './dist/js', './pages'];
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        });
        resolve();
    });
})
gulp.task('html:build', () =>
    gulp.src('./src/pages/**/*.+(html|nunjucks)')
        .pipe(data(getData))
        .pipe(nunjucksRender({
            manageEnv,
            path: ['./src/layouts']
        }))
        .pipe(gulp.dest('pages'))
        .pipe(browserSync.stream())
);
gulp.task('css:build', ()  => 
    gulp.src("./src/sass/*.scss")
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer())
		.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("dist/css/"))
        .pipe(browserSync.stream())
);
gulp.task('js:build', () =>
    gulp.src('./dist/js/')
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
        middleware: function(req, res, next) {
            if (req.url === '/') {
                res.writeHead(301, { Location: '/pages/index.html' });
                res.end();
            }
            return next();
        }
    });
    gulp.watch("./src/scripts/**/*.js", gulp.series('js:build'));
    gulp.watch("./src/sass/**/*.scss", gulp.series('css:lint', 'css:build'));
    gulp.watch("./src/**/*.+(html|nunjucks)", gulp.series('html:build'));
    gulp.watch("./pages/**/*.html").on('change', browserSync.reload);
}));
gulp.task('default', gulp.series('prepare', 'watching'));
gulp.task('build', gulp.series('prepare', 'css:lint', 'js:build', 'css:build', 'html:build'));