var gulp            = require('gulp');
var browserSync     = require('browser-sync').create();
var sass            = require('gulp-sass')(require('sass'));
var sourcemaps      = require('gulp-sourcemaps');
var autoprefixer    = require('gulp-autoprefixer');
var nunjucksRender  = require('gulp-nunjucks-render');
var data            = require('gulp-data');
var babel           = require('gulp-babel');
var webpack = require('webpack-stream');

// 
const templateData = {
    app: {
        name: 'Bootsarc'
    }
}
const getData = function(file) {
    return {
        ...templateData,
        file
    };
}
const manageEnv = function(environment) {
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
    // gulp.src("./src/scripts/**/*.js")
    //     .pipe(babel({
    //         presets: ['@babel/env']
    //     }))
    //     .pipe(gulp.dest('dist/js/'))
);

gulp.task('watching', gulp.series('js:build', 'css:build', 'html:build', function() {
    browserSync.init({
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
    gulp.watch("./src/sass/**/*.scss", gulp.series('css:build'));
    gulp.watch("./src/**/*.+(html|nunjucks)", gulp.series('html:build'));
    gulp.watch("./pages/**/*.html").on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('watching'));
gulp.task('build', gulp.series('js:build', 'css:build', 'html:build'));