/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  // map tells the System loader where to look for things
  var map = {
    'node_modules': '../../node_modules',
    'plugin-babel': 'node_modules/systemjs-plugin-babel/plugin-babel.js',
    'app': '../../build/demo', // 'dist',
    'rxjs': '../../node_modules/rxjs'
  };
  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app': { main: 'index.js', defaultExtension: 'js' },
    'rxjs': { defaultExtension: 'js' },
  };
  var config = {
    map: map,
    packages: packages,
    meta: {
      '*.css': {loader: 'build/text.js'},
      '*.js': {
        babelOptions: {
          es2015: false
        }
      }
    },

    transpiler: 'plugin-babel'
  };
  System.config(config);
})(this);
