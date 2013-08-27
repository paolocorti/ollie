/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var FriendModel = Backbone.Model.extend({
		
		defaults: {
			"fbid" : "",
			"fbname" : "",
			"fbpic" : "",
			"lat" : "",
			"lng" : "",
			"socketid" : ""
		}
    });

    return FriendModel;
});