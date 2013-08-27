/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/map',
    'views/profile',
], function ($, _, Backbone, JST, MapView, ProfileView) {
    'use strict';

    var MainView = Backbone.View.extend({

    	//template: JST['app/scripts/templates/main.ejs'],

    	el: 'body',

    	initialize: function () {
    		console.log('main view');
    		this.render();
            $('nav').show();
            this.map();
    	},

    	render: function () {
    		console.log('main view - render');
        	//this.$el.html(this.template());
        	//return this;
    	},

    	events: {
            'click #home': 'map',
    		'click #logout': 'logout',
            'click #profile': 'profile',
    	},

        map: function (e) {
            var mapView = new MapView({ model: this.model });
        },

    	logout: function (e) {
            $(document).trigger('logout');
            return false;
        },

        profile: function (e) {
            console.log('profile');
            var profileView = new ProfileView({ model: this.model });
        }
    });

    return MainView;
});