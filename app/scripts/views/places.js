/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var PlacesView = Backbone.View.extend({
        template: JST['app/scripts/templates/places.ejs']
    });

    return PlacesView;
});