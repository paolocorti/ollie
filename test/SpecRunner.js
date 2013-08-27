// require.config({
//   baseUrl: '../appbackbone-/',
//   paths: {
//     'jquery'        : '../bower_components/jquery',
//     'underscore'    : '../bower_components/underscore',
//     'backbone'      : '../bower_components/backbone',
//     'mocha'         : 'lib/mocha',
//     'chai'          : 'lib/chai',
//     'chai-jquery'   : 'lib/chai-jquery',
//     'models'        : '../app/scripts/models'
//   },
//   shim: {
//     'underscore': {
//       exports: '_'
//     },
//     'jquery': {
//       exports: '$'
//     },
//     'backbone': {
//       deps: ['underscore', 'jquery'],
//       exports: 'Backbone'
//     },
//     'chai-jquery': ['jquery', 'chai']
//   },
//   urlArgs: 'bust=' + (new Date()).getTime()
// });
 
// require(['require', 'chai', 'chai-jquery', 'mocha', 'jquery'], function(require, chai, chaiJquery){
 
//   // Chai
//   //var should = chai.should();
//   assert = chai.assert;
//   should = chai.should();
//   expect = chai.expect;
//   //chai.use(chaiJquery);
 
//   /*globals mocha */
//   mocha.setup('bdd');
 
//   require([
//     'spec/appSpec.js',
//   ], function(require) {
//       mocha.run();
//   });
 
// });


// Partial config file
var require = {
    // Base URL relative to the test runner
    // Paths are relative to this
    baseUrl: '../../js/',
    paths: {
        // Testing libs
        'jquery'        : '../bower_components/jquery',
        'underscore'    : '../bower_components/underscore',
        'backbone'      : '../bower_components/backbone',
        'mocha'         : 'lib/mocha',
        'chai'          : 'lib/chai',
        'chai-jquery'   : 'lib/chai-jquery',
        'common'        : '../test/libs/common',
    },
    use: {
        backbone: {
            deps: ['use!underscore', 'jquery'],
            attach: 'Backbone'
        },
        'libs/backbone/backbone': {
            deps: ['use!underscore', 'jquery'],
            attach: 'Backbone'
        },
        'libs/leaflet/leaflet-src': {
            attach: 'L'
        },
        underscore: {
            attach: '_'
        },
        mocha: {
            attach: 'mocha'
        }
    },
    priority: [
        'jquery',
        'underscore',
        'common'
    ]
    // urlArgs: /debug\=1/.test(window.location.search) ? '' : 'bust=' +  (new Date()).getTime(), // debug
};
 
// You can do this in the grunt config for each mocha task, see the `options` config
mocha.setup({
    ui: 'bdd',
    ignoreLeaks: true
});
 
// Protect from barfs
console = window.console || function() {};
 
// Don't track
window.notrack = true;
 
// Mocha run helper, used for browser
var runMocha = function() {
    mocha.run();
};