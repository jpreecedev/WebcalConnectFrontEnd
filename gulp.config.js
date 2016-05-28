module.exports = function () {
    var config = {
        tsSource: ["./app/**/*.ts"],
        jsSource: ["app/**/!(*.spec).js"],
        specSource: ["./app/**/*.spec.js"],
        appSource: [
            "./app/**/*.html",
            "./app/**/*.css",
        ],
        rootFiles: [
            "favicon.ico",
            "index.html",
        ],
        images: [
            "./img/*.png"
        ],
        scss: [
            "./css/site.scss",
            "./app/**/*.scss"
        ],
        modules: [
            "node_modules/@angular/**/*",
            "node_modules/rxjs/**/*",
            "node_modules/moment/moment.js",
        ],
        libJs: [
            "node_modules/core-js/client/shim.min.js",
            "node_modules/zone.js/dist/zone.js",
            "node_modules/reflect-metadata/Reflect.js",
            "node_modules/systemjs/dist/system.src.js",    
            "node_modules/jquery/dist/jquery.min.js",
            "node_modules/bootstrap/dist/js/bootstrap.min.js",
            "node_modules/ng2-pagination/dist/ng2-pagination-bundle.js",
            "node_modules/bootbox/bootbox.min.js",
            "node_modules/pikaday/pikaday.js",
            "lib/systemjs.config.js",
            "lib/chart.min.js",
            "lib/gauge.min.js"
        ],
        libCss: [
            "node_modules/bootstrap/dist/css/bootstrap.min.css",
            "node_modules/font-awesome/css/font-awesome.css",
            "node_modules/pikaday/css/pikaday.css",
            "css/site.css"
        ],
        fonts: [
            "node_modules/font-awesome/fonts/**/*.*",
        ],
        dist: "./wwwroot",
        libJsDist: "./wwwroot/lib.js",
        fontsDist: "./wwwroot/fonts/",
        app: "./app"
    };
    return config;
};