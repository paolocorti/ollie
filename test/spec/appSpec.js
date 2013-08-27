// 'use strict';
// (function () {
//     describe('App namespace', function () {
//         it('should user model be defined', function () {
//         	expect(user).toBeDefined();
//         });
//     });
// })();

define(function(require) {
  var models = require('models');
 
  describe('Models', function() {
 
    describe('User Model', function() {
      it('should default "urlRoot" property to "/api/samples"', function() {
        var user = new UserModel();
        expect(user).toBeDefined();
      });
    });
 
  });
 
});