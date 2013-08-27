/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var ProfileView = Backbone.View.extend({
        
        template: JST['app/scripts/templates/profile.ejs'],

    	el: '#main-container',

    	initialize: function () {
    		console.log('profile view');

            $('#profile').parent().addClass('active');

            $.ajax ({type: "POST",url:'http://trinity.micc.unifi.it/ollie/ollie_php/user_near_me.php',
                data: {fbid: this.model.get("id")} }).done(function(response ) {

                var data = $.parseJSON(response);

                //profilefriendcollection.add(data);

                console.log("profile friend collection__"+JSON.stringify(data));
            });

    		this.render();
    	},

        serialize: function () {
            // Grab the data from model
            var data = this.model.toJSON();
            console.log(data)
            return data;
        },

    	render: function () {
    		console.log('profile view - render');

        	this.$el.html(this.template(this.serialize()));
    	},

        events: {
        }
    });

    return ProfileView;
});