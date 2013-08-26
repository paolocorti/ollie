/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var LoginView = Backbone.View.extend({

        template: JST['app/scripts/templates/login.ejs'],

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
            'click #login': 'login',
            'click #logout': 'logout'
        },

        login: function (e) {
            $(document).trigger('login');
            return false;
        }

    });

    return LoginView;
});