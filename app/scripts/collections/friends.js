/*global define*/

define([
    'underscore',
    'backbone',
    'models/friend'
], function (_, Backbone, FriendsModel) {
    'use strict';

    var FriendsCollection = Backbone.Collection.extend({
        model: FriendsModel
    });

    return FriendsCollection;
});