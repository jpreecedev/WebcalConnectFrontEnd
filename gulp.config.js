module.exports = function(){
    var config = {
        temp: '.tmp/',
        tsSource: ["./app/**/*.ts", "!./app/utilities/cookies.ts"],
        scss: [
            './css/site.scss',
            './app/**/*.scss'
        ]
    };
    return config;
};