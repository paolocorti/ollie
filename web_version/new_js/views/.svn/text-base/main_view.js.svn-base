define([
    'underscore',
    'backbone',
    'jquery',
    'text!template/content_facebook.html',

],function(
    _,
    Backbone,
    $,
    MainTemplate
){
    
    return Backbone.View.extend({

    template: _.template( MainTemplate ),

    events: {
            'click #logo_login': 'login'
    },

    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    login: function (e) {
            $(document).trigger('login');
            return false;
    },

    hideSplash: function () {
        $("#fb").hide("content_facebook.html");
    },

    showSplash: function () {

    }

    });

});