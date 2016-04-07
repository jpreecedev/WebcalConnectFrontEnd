"use strict";

var gulp = require("gulp");
var config = require('./gulp.config.js')();
var $ = require('gulp-load-plugins')();

gulp.task("clean", function() {
    return gulp.src(config.dist)
        .pipe($.clean());
});

gulp.task("lib-css", ["clean"], function() {
    return gulp.src(config.libCss, { base: "./" })
        .pipe(gulp.dest(config.dist))
});

gulp.task("lib-js", ["lib-css"], function() {
    return gulp.src(config.libJs, { base: "./" })
        .pipe(gulp.dest(config.dist))
})

gulp.task("app-css", ["lib-js"], function() {
    return gulp.src(config.scss, { base: "./" })
        .pipe($.sass())
        .pipe($.autoprefixer({ browsers: ["last 2 versions", "> 5%"] }))
        .pipe(gulp.dest(config.dist));
});

gulp.task("app-root", ["app-css"], function() {
    return gulp.src(config.rootFiles, { base: "./" })
        .pipe(gulp.dest(config.dist))
});

gulp.task("app", ["app-root"], function() {
    return gulp.src(config.appSource, { base: "./" })
        .pipe(gulp.dest(config.dist))
});

gulp.task("inject", ["app"], function() {
    var target = gulp.src('./index.html');
    var sources = gulp.src([].concat(config.libJs, config.libCss), { read: false });

    return target.pipe($.inject(sources, { ignorePath: "/wwwroot"}))
        .pipe(gulp.dest(config.dist));
});

gulp.task("dist", ["inject"], function() {

});

gulp.task("default", ["dist"]);