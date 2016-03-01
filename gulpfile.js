"use strict";

var gulp = require("gulp");
var del = require("del");
var $ = require('gulp-load-plugins')();
var config = require('./gulp.config.js')();

gulp.task("tslint", function () {
    return gulp.src(config.tsSource)
        .pipe($.tslint())
        .pipe($.tslint.report("verbose"));
});

gulp.task("clean-css", function (done) {
    return del(config.temp + "**/*.css");
});

gulp.task("css", ["clean-css"], function () {
    return gulp.src(config.scss, {base: "./"})
        .pipe($.plumber())
        .pipe($.sass())
        .pipe($.autoprefixer({ browsers: ["last 2 versions", "> 5%"] }))
        .pipe($.plumber.stop())
        .pipe(gulp.dest("."));
});

gulp.task("scss-watcher", function () {
    gulp.watch([config.scss], ["css"])
});

gulp.task("default", ["css", "tslint"]);
