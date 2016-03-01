"use strict";

var gulp = require("gulp");
var $ = require('gulp-load-plugins')();
var config = require('./gulp.config.js')();

gulp.task("tslint", function(){
    return gulp.src(config.tsSource)
               .pipe($.tslint())
               .pipe($.tslint.report("verbose"));
});

gulp.task("default", ["tslint"]);