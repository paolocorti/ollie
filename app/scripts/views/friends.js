/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var FriendsView = Backbone.View.extend({
        template: JST['app/scripts/templates/friends.ejs']
    });

    return FriendsView;
});