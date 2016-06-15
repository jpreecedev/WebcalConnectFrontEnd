/**
 * System configuration for Angular 2 apps
 * Adjust as necessary for your application needs.
 */
(function(global) {

  // map tells the System loader where to look for things
  var map = {
    'app':                        'js/app.js', // 'dist',
    '@angular':                   'node_modules/@angular',
    'rxjs':                       'node_modules/rxjs',
    'moment':                     'node_modules/moment'
  };

  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'rxjs':                       { defaultExtension: 'js' },
    'moment':                     { defaultExtension: 'js' }
  };

  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'router-deprecated',
    'upgrade'
  ];

  // Bundled (~40 requests):
  function packUmd(pkgName) {
    packages['@angular/'+pkgName] = { main: pkgName + '.umd.js', defaultExtension: 'js' };
  };

  // Add package entries for angular packages
  ngPackageNames.forEach(packUmd);

  var config = {
    map: map,
    packages: packages
  }

  System.config(config);

})(this);