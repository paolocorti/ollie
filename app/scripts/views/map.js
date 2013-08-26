/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var MapView = Backbone.View.extend({
        template: JST['app/scripts/templates/map.ejs']
    });

    return MapView;
});