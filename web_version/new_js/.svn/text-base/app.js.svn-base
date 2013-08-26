var App = {};

require.config({

    baseUrl: './',
    
    paths: {
        
        // Libraries
        text:       'libs/require/text',
        jquery:     'libs/jquery-1.9.0.min',
        underscore: 'libs/underscore-min',
        backbone:   'libs/backbone-min',
        
        // Application Places
        view:       'new_js/views',
        model:      'new_js/models',
        collection: 'new_js/collections'
        
    },
    
    shim: {
        underscore: {
            exports:    '_'
        },
        backbone: {
            deps:       [ 'underscore', 'jquery' ],
            exports:    'Backbone'
        }
    }
    
});
        
define([
    'backbone',
    'jquery',
    'view/main_view',
    'view/map_view',
    'view/profile_view',
    'model/user'
],function(
    Backbone,
    $,
    MainView,
    MapView,
    ProfileView,
    ModelUser   
){
	//inizializzo il model dell'utente con i dati di facebook
    App.user = new ModelUser(); 

    $(document).ready( function(){

        $('#loader').hide().ajaxStart(function() {
            $(this).show();
            $(this).css({'top': 200, 'left': 145});
        }).ajaxStop(function() {
            $(this).hide();
            });

        getLoginStatus();

        $('#btn1').click(function() {
            App.profileview = new ProfileView({el: '#wrapper', model: App.user});              
        }); 
        
        //carico la main view con la mappa
        $('#btn2').click(function() {
            App.mapview = new MapView({el: '#wrapper', model: App.user});
        }); 
        
        $('#btn3').click(function() {
                $(".pulsante").removeClass("cliccato"),
                $(".pulsante_2").removeClass("cliccato"),
                $(".pulsante_3").addClass("cliccato_3")
        }); 
    })

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

    function getLoginStatus() {
        App.mainview = new MainView({el: '#fb'});
        //al cambiamento dello stato LOGIN/LOGOUT aggiorna il model dello user
        $(document).on('fbStatusChange', function (event, data) {
            if (data.status === 'connected') {
                
                App.mainview.hideSplash();// setto a hidden il pulsante di login
                //loggedIn = true;
                FB.api('/me', function (response) {
                    console.log(response);
                    App.user.set(response); // Aggiorna il model
                    $('#btn2').trigger('click');
                });
            } else {
                    App.user.set(App.user.defaults); // Reset del model con i valori di default
            }
        });
    }
});


