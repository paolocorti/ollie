/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var MainView = Backbone.View.extend({

    	template: JST['app/scripts/templates/main.ejs'],

    	el: '.container',

    	initialize: function () {
    		console.log('main view');
    		this.render();
    	},

    	render: function () {
    		console.log('main view - render');
        	this.$el.html(this.template());
        	return this;
    	},

    	events: {
    		'click #logout': 'logout'
    	},

    	logout: function (e) {
            $(document).trigger('logout');
            return false;
        }
    });

    return MainView;
});