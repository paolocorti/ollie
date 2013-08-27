/*global require*/
'use strict';

var user = {};

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
        },
        socketio: {
            exports: 'socketio'
        }
    },
    paths: {
        //Libraries
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: 'vendor/bootstrap',
        socketio: '../bower_components/socket.io-client/dist/socket.io',
        //socketclient: '../bower_components/socket.io-client/lib/socket'
    }
});

require([
    'backbone',
    'views/main',
    'views/login',
    'models/user',
], function (Backbone, MainView, LoginView, UserModel) {
    /*jshint nonew:false*/
    // Start Backbone.history()
    Backbone.history.start();

    user = new UserModel();

    FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                var uid = response.authResponse.userID;
                var accessToken = response.authResponse.accessToken;
                FB.api('/me', function (response) {
                  user.set(response); // Aggiorna il model
                });
                new MainView({model: user});
            } else {
                // the user isn't logged in to Facebook.
                console.log('no user - login view')
                new LoginView();
                user.set(user.defaults); // Reset del model con i valori di default
            }
    });

    // (function() {

    //     // Initialize the application view
    //     $(document).on('fbStatusChange', function (event, data) {
    //         if (data.status === 'connected') {
    //             //loggedIn = true;
    //             FB.api('/me', function (response) {
    //               user.set(response); // Aggiorna il model
    //             });
    //             new MainView({model: user});
    //         } else {
    //             console.log('no user - login view')
    //             new LoginView();
    //             user.set(user.defaults); // Reset del model con i valori di default
    //         }
    //     });

    // })();

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