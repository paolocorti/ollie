/*global define*/

define([
    'underscore',
    'backbone',
    'models/places'
], function (_, Backbone, PlacesModel) {
    'use strict';

    var PlacesCollection = Backbone.Collection.extend({
        model: PlacesModel
    });

    return PlacesCollection;
});