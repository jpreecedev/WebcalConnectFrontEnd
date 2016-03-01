module.exports = function(){
    var config = {
        temp: '.tmp/',
        tsSource: "./app/**/*.ts",
        scss: [
            './css/site.scss',
            './app/**/*.scss'
        ]
    };
    return config;
};