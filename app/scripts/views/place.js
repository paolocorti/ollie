/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var PlaceView = Backbone.View.extend({
        template: JST['app/scripts/templates/place.ejs']
    });

    return PlaceView;
});