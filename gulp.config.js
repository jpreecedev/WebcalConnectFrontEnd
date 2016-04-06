module.exports = function() {
    var config = {
        temp: '.tmp/',
        tsSource: ["./app/**/*.ts"],
        appSource: [
            "./app/**/*.js",
            "./app/**/*.html",
            "./app/**/*.css",
            ],
        rootFiles: [
            "favicon.ico",
            "index.html",
            "./img/*.png"
        ],
        scss: [
            './css/site.scss',
            './app/**/*.scss'
        ],
        libJs: [
            "node_modules/es6-shim/es6-shim.min.js",
            "node_modules/systemjs/dist/system-polyfills.js",
            "node_modules/angular2/es6/dev/src/testing/shims_for_IE.js",
            "node_modules/angular2/bundles/angular2-polyfills.js",
            "node_modules/systemjs/dist/system.src.js",
            "node_modules/rxjs/bundles/Rx.js",
            "node_modules/angular2/bundles/angular2.dev.js",
            "node_modules/angular2/bundles/router.dev.js",
            "node_modules/angular2/bundles/http.dev.js",
            "node_modules/jquery/dist/jquery.min.js",
            "node_modules/bootstrap/dist/js/bootstrap.min.js",
            "node_modules/ng2-pagination/dist/ng2-pagination-bundle.js",
            "node_modules/bootbox/bootbox.min.js",
        ],
        libCss: [
            "node_modules/bootstrap/dist/css/bootstrap.min.css",
            "node_modules/font-awesome/css/font-awesome.css"
        ],
        dist: "./wwwroot",
        app: "./app"
    };
    return config;
};