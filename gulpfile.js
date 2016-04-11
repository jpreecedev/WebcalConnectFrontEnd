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
        .pipe(gulp.dest("."))
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
    var es = require("event-stream");
    
    var js = gulp.src(config.libJs)
        .pipe($.concat("lib.min.js"))
        .pipe(gulp.dest(config.dist));
        
    var css = gulp.src(config.libCss)
        .pipe($.minifyCss())
        .pipe($.concat("lib.min.css"))
        .pipe(gulp.dest(config.dist));

    return gulp.src("./index.html")
        .pipe($.inject(es.merge(js, css), { ignorePath: "/wwwroot" }))
        .pipe(gulp.dest(config.dist));
});

gulp.task("dist", ["inject"], function() {

});

gulp.task("default", ["dist"]);