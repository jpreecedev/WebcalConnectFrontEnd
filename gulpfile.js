"use strict";

var gulp = require("gulp");
var config = require('./gulp.config.js')();
var $ = require('gulp-load-plugins')();

gulp.task("clean", function () {
    return gulp.src(config.dist)
        .pipe($.clean());
});

gulp.task("fonts", ["clean"], function () {
    return gulp.src(config.fonts, { base: "./" })
        .pipe($.flatten())
        .pipe(gulp.dest(config.fontsDist));
});

gulp.task("app-css", ["fonts"], function () {
    return gulp.src(config.scss, { base: "./" })
        .pipe($.sass())
        .pipe($.autoprefixer({ browsers: ["last 2 versions", "> 5%"] }))
        .pipe(gulp.dest("."));
});

gulp.task("js-modules", ["app-css"], function() {
    return gulp.src(config.modules, { base: "./" })
        .pipe(gulp.dest(config.dist));
});

gulp.task("app-js", ["js-modules"], function () {
    return gulp.src(config.tsSource, { base: "./" })
        .pipe($.inlineNg2Template({ target: 'es5' }))
        .pipe($.typescript($.typescript.createProject('tsconfig.json')))
        .pipe($.uglify())
        .pipe(gulp.dest("."));
});

gulp.task("app-images", ["app-js"], function () {
    var pngquant = require("imagemin-pngquant");

    return gulp.src(config.images)
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [
                { removeViewBox: false },
                { cleanupIDs: false }
            ],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(config.dist + "/img"));
});

gulp.task("app", ["app-images"], function () {
    return gulp.src(config.rootFiles, { base: "./" })
        .pipe(gulp.dest(config.dist))
});

gulp.task("inject", ["app"], function () {
    var es = require("event-stream");

    var js = gulp.src(config.libJs)
        .pipe(gulp.dest(config.dist + "/js"));

    var css = gulp.src(config.libCss)
        .pipe($.cleanCss({ compatibility: 'ie8' }))
        .pipe($.concat("lib.min.css"))
        .pipe(gulp.dest(config.dist));

    return gulp.src("./index.html")
        .pipe($.inject(es.merge(js, css), { ignorePath: "/wwwroot" }))
        .pipe($.stripComments())
        .pipe($.htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(config.dist));
});

gulp.task("default", ["inject"]);