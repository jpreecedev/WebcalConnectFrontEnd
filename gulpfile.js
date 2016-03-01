"use strict";

var gulp = require("gulp");
var $ = require('gulp-load-plugins')();

gulp.task("tslint", function(){
    return gulp.src("./app/**/*.ts")
               .pipe($.tslint())
               .pipe($.tslint.report("verbose"));
});

gulp.task("default", ["tslint"]);