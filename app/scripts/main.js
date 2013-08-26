/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    },
    paths: {
        //Libraries
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: 'vendor/bootstrap',
    }
});

require([
    'backbone',
    'views/main',
    'models/user',
], function (Backbone, MainView, UserModel) {
    /*jshint nonew:false*/
    // Start Backbone.history()
    Backbone.history.start();

    var user = new UserModel();

    // Initialize the application view
    $(document).on('fbStatusChange', function (event, data) {
        if (data.status === 'connected') {
            new MainView();
            //loggedIn = true;
            FB.api('/me', function (response) {
                console.log(response);
                user.set(response); // Aggiorna il model
                $('#btn2').trigger('click');
            });
        } else {
            new LoginView();
            user.set(user.defaults); // Reset del model con i valori di default
        }
    });

    $(document).on('login', function () {
        FB.login(function(response) {
        }, {scope: 'publish_actions'});
        return false;
    });

    //rimane in ascolto del trigger LOGOUT
    $(document).on('logout', function () {
        FB.logout();
        return false;
    });
});