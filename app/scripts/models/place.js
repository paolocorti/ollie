/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var PlaceModel = Backbone.Model.extend({
        defaults: {
        }
    });

    return PlaceModel;
});