module.exports = function(){
    var config = {
        temp: '.tmp/',
        tsSource: ["./app/**/*.ts", "!./app/cookies.ts"],
        scss: [
            './css/site.scss',
            './app/**/*.scss'
        ]
    };
    return config;
};