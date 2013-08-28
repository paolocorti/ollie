/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'models/friend',
    'collections/friends',
    'templates'
], function ($, _, Backbone, io, FriendModel, FriendsCollection, JST) {
    
    'use strict';

    var map;
    var mgr;
    var onLine = 0;
    //tiene memoria di tutti i marker
    var allUsersMarkers = [];
    //tiene memoria di tutte le infobox
    var allUsersInfobox = [];
    //tiene memoria di tutti gli infobubbles
    var allinfobubbles = [];
    var allmarkersplace = [];
    var LatLngList = new Array();
    var friendsmodel;
    var friendscollection = new FriendsCollection();

    var MapView = Backbone.View.extend({
        
        template: JST['app/scripts/templates/map.ejs'],

        el: '#main-container',

	    latitude : {},
	    longitude : {},
	    profilePicture : {},
	    profileID : {},
	    profileName : {},
	    mySocketId : {},

	    initialize: function () {
	        console.log('init');
	        _.bindAll(this);
	        this.render();
	        navigator.geolocation.getCurrentPosition(this.onSuccess,this.onError);  
	        // $('.pulsante').removeClass('cliccato'),
	        // $('.pulsante_2').addClass('cliccato'),
	        // $('.pulsante_3').removeClass('cliccato_3')
	    },

	    render: function () {
	        this.$el.html(this.template());
	        this.loadmap();
	        return this;
	    },
	    
	    loadmap: function () {
	        console.log('loadmap')    
	        map = L.mapbox.map('map', 'kpaul.map-gndq3sfi');
	    },

	    onError: function (error) {
	        alert('code: '    + error.code    + '\n' +
	              'message: ' + error.message + '\n');
	    },
	        
	    onSuccess: function (position) {
	        console.log('onSuccess')   
	        //this.socketon(); 
	        this.latitude = position.coords.latitude.toFixed(6);
	        this.longitude = position.coords.longitude.toFixed(6); 

	        console.log('my pos is ' + this.latitude + ', ' +this.longitude); 

	        this.initMe(this.model);
	        this.socketConnection(this.model);
	    },

	    initMe: function (me) {
	        console.log('initialize me');

	        map.setView([this.latitude, this.longitude], 13);

		    var properties = {
		        type: 'Feature',
		        geometry: {
		            type: 'Point',
		            coordinates: [this.latitude,this.longitude]
		        },
		        properties: {
		            'title': me.fbname,
			        'icon': {
			            'iconUrl': 'http://graph.facebook.com/'+ me.id +'/picture',
			            'iconSize': [50, 50], // size of the icon
			            'iconAnchor': [25, 25], // point of the icon which will correspond to marker's location
			            'popupAnchor': [0, -25],  // point from which the popup should open relative to the iconAnchor
			            'className': 'img-circle img-thumbnail'
			        }
		        }
		    };

			var coords = properties.geometry.coordinates;
			var marker = new L.marker(coords, {icon: L.icon(properties.properties.icon)});

			map.addLayer(marker);

	        // var latLngMe = new google.maps.LatLng(this.latitude,this.longitude);
	        // map.panTo(latLngMe);
	        // var myicon = new google.maps.MarkerImage('./graphics/user.png',
	        //                                          null,
	        //                                          null,
	        //                                          null,
	        //                                          new google.maps.Size(64, 80));
	        // var mymarker = new google.maps.Marker({position: latLngMe,
	        //                                       map: map,
	        //                                       icon: myicon,
	        //                                       zIndex : 1000
	        //                                       });
	            
	        allUsersMarkers.push({'socketId': this.mySocketId, 'fbId': me.fbid, 'marker': marker});  
	        // console.log(allUsersMarkers);
	        // var myPoint = new google.maps.LatLng(this.latitude,this.longitude);
	        // var myPosObj = {'id':mySocketId+'-'+profileID, 'point': myPoint}
	        
	        // LatLngList.push(myPosObj);
	        // console.log(LatLngList);
	        // //boundMarker();
	        // mgr.refresh();
	    },

	    socketConnection: function (user) {
	    	var self = this;

	    	console.log(user)

	    	if(!onLine) {
	            var socket = io.connect('trinity.micc.unifi.it:9999');
	            socket.on('connect', function() {

	            	onLine = 1;
	            	
	            	console.log('connect')

	            	socket.on('socketID', function(response) {
	            		
	            		this.mySocketId = response;

	            		socket.emit(
	                        'update_user_on_map', 
	                        {
	                            fbid: user.id, 
	                            fbname: user.attributes.name, 
	                            fbpic: 'https://graph.facebook.com/'+user.id+'/picture',
	                            lat: self.latitude, 
	                            lng: self.longitude, 
	                            socketid: this.mySocketId, 
	                            online: onLine,
	                            notify: true
	                        }
	                    );
	            	});

	            	socket.on('new_user', function (newUserData) {
	                    var friendmodel = new FriendModel();
	                    friendmodel.set(newUserData);
	                    console.log('new user__'+ friendmodel );
	                    self.addMarker(friendmodel);
	                    friendscollection.push(friendmodel);
	                    console.log('new friend collection__'+JSON.stringify(friendscollection));
	                    //var info = response;
	                    //initFriends(info);
	                });

	                socket.on('user_position_data', function (friendsData) {
	                    var friends = $.parseJSON(friendsData);
	                    friendscollection.add(friends);
	                    console.log('friend collection__'+JSON.stringify(friendscollection));
	                    self.updateFriends();
	                });           
	            });
	            
	            socket.on('user_disconnected', function (socketID) {
	                self.deleteMarker(socketID);
	            });
	        } else {
	            console.log('else socketOn');
	            console.log(self);
	            //self.initMe();
	            socket.emit(
	                    'update_user_on_map', 
	                    {
	                        fbid: user.id, 
                            fbname: user.name, 
                            fbpic: 'https://graph.facebook.com/'+user.id+'/picture',
                            lat: self.latitude, 
                            lng: self.longitude, 
                            socketid: mySocketId, 
                            online: onLine,
                            notify: false
	                    }

	            );
	        }
	    },

	    updateFriends: function (friendsData) {
	      	
	      	var self = this;
	        console.log('updateFriends')

	        friendscollection.each(function(model) {  

                var lat = model.get('lat');
                var lng = model.get('lng');
                var pic = model.get('fbpic');
                var fbid = model.get('fbid');
                var name = model.get('fbname');
                var socketID = model.get('socketid');
				    
				var popupContent =  '<a target="_blank" class="popup" href="#">' + '<h5>' + name + '</h5>' + '</a>';

				var markers = map.markerLayer.getGeoJSON();

				var index = markers.length;

		    	var properties = {
			        type: 'Feature',
			        geometry: {
			            type: 'Point',
			            coordinates: [lat,lng]
			        },
			        properties: {
			            'title': name,
				        'icon': {
				            'iconUrl': 'http://graph.facebook.com/'+fbid+'/picture',
				            'iconSize': [50, 50], // size of the icon
				            'iconAnchor': [25, 25], // point of the icon which will correspond to marker's location
				            'popupAnchor': [0, -25],  // point from which the popup should open relative to the iconAnchor
				            'className': 'img-circle img-thumbnail'
				        }
			        }
			    };

			   
			    //var feature = newMarker.feature;
			    var coords = properties.geometry.coordinates;
			    var marker = new L.marker(coords, {icon: L.icon(properties.properties.icon)}).bindPopup(popupContent,{
				        closeButton: true,
				        minWidth: 100
				    });

			    map.addLayer(marker);
	                                                                     
	            allUsersMarkers.push({'socketId':socketID, 'fbId': fbid, 'marker': marker});   
	            console.log('users connected: '+ allUsersMarkers);                  
	                        
	            
	        });                                                            
	    },

	    addMarker: function(usermodel) {
            
            var self = this;
            console.log('add marker');

            var lat = usermodel.get('lat');
            var lng = usermodel.get('lng');
            var pic = usermodel.get('fbpic');
            var fbid = usermodel.get('fbid');
            var name = usermodel.get('fbname');
            var socketID = usermodel.get('socketid');
            
            var popupContent =  '<a target="_blank" class="popup" href="#">' + '<h5>' + name + '</h5>' + '</a>';

			var markers = map.markerLayer.getGeoJSON();

			var index = markers.length;

	    	var properties = {
		        type: 'Feature',
		        geometry: {
		            type: 'Point',
		            coordinates: [lat,lng]
		        },
		        properties: {
		            'title': name,
			        'icon': {
			            'iconUrl': 'http://graph.facebook.com/'+fbid+'/picture',
			            'iconSize': [50, 50], // size of the icon
			            'iconAnchor': [25, 25], // point of the icon which will correspond to marker's location
			            'popupAnchor': [0, -25],  // point from which the popup should open relative to the iconAnchor
			            'className': 'img-circle img-thumbnail'
			        }
		        }
		    };

		    var coords = properties.geometry.coordinates;
		    var marker = new L.marker(coords, {icon: L.icon(properties.properties.icon)}).bindPopup(popupContent,{
			    closeButton: true,
			    minWidth: 100
			});

			map.addLayer(marker);
                                         
            allUsersMarkers.push({'socketId':socketID, 'fbId': fbid, 'marker': marker});                     
	        console.log('users connected: '+ allUsersMarkers);

	            // var boxText = document.createElement('div');
	            // boxText.innerHTML = '<h4 class='userprofilelink'>'+ name +'</h4>';
	            
	            // var myOptions = {
	            //      content: boxText,
	            //      disableAutoPan: true,
	            //      maxWidth: 0,
	            //      pixelOffset: new google.maps.Size(-75, 0),
	            //      zIndex: null,
	            //      closeBoxMargin: '10px 2px 2px 2px',
	            //      closeBoxURL: 'graphics/chiudi.png',
	            //      infoBoxClearance: new google.maps.Size(1, 1),
	            //      isHidden: false,
	            //      pane: 'floatPane',
	            //      enableEventPropagation: true
	            //   };
	                                         
	            //  var ib = new InfoBox(myOptions);
	             
	            //  var ibObj = {'user' : socketID, 'info' : ib};
	             
	            //  allUsersInfobox.push(ibObj);
	            
	                                         
	            //  google.maps.event.addListener(marker, 'click', function () { 
	             
	            //         alert('click')

	            //         for (var m in allUsersInfobox) {

	            //           if(allUsersInfobox[m].user == this.id) {
	            //             allUsersInfobox[m].info.open(map, this);

	            //           }   else {
	            //             allUsersInfobox[m].info.close();
	            //           }                 
	            //         }
	                                           
	            //         if (allmarkersplace.length > 0){
	            //                                deletePlaces();
	            //                                }
	            //         this.getPlaces(usermodel);
	                                              
	            //   });//END addListener marker, 'click'
	            //  //var latlngObj = {'id' : socketID+'-'+user_fbid, 'point': new google.maps.LatLng(lat, lng)};
	                    
	            //  //LatLngList.push(latlngObj);

	            //  mgr.addMarker(marker, 0);
	            //  //boundMarker();
	            //  mgr.refresh();
	    },

	    deleteMarker: function (socketID) {
	         
	        for (var i in allUsersMarkers) {                
	            if(allUsersMarkers[i].socketId == socketID) {     
	              map.removeLayer(allUsersMarkers[i].marker);
	              break;
	            }                
	        } 
	    },
		/*
	    getPlaces: function (info) {
	        var placelabel;
	        var imgplace;
	        var imgcat;
	        var name = info.get('name');
	    
	            $.ajax ({
	                    type: 'POST',
	                    url:'http://trinity.micc.unifi.it/ollie/ollie_php/match_user_likes_curl.php',
	                    data: { id_1:profileID,
	                            id_2:info.get('id'),
	                            lat: this.latitude,
	                            long: this.longitude
	                          }
	                    }).done(function(response ) {
	                            
	                            allmarkersplace = []; 
	                            allinfobubbles = [];                                                                                                                                                                       
	                            places = $.parseJSON(response);
	                            
	                            imgplace = new Array('graphics/place_book.svg',
	                                                 'graphics/place_movie.svg',
	                                                 'graphics/place_fashion.svg',
	                                                 'graphics/place_art.svg',
	                                                 'graphics/place_food.svg',
	                                                 'graphics/place_health.svg',
	                                                 'graphics/place_music.svg',
	                                                 'graphics/place_sport.svg'
	                                                 );   
	            $.each(places, function(c,data){
	                var cat = data.categoria;
	                var placesarray = data.curl.results
	                               
	                $.each(placesarray, function(i,place){
	                  if(cat=='Media') {
	                    
	                    imgcat = 0; 
	                    } else if (cat=='Movie') {
	                    imgcat = 1; 
	                    } else if (cat=='Clothing') {
	                    imgcat = 2; 
	                    } else if (cat=='Art/culture') {
	                    imgcat = 3; 
	                    } else if (cat=='Food/beverages') {
	                    imgcat = 4; 
	                    } else if (cat=='Health/beauty') {
	                    imgcat = 5; 
	                    } else if (cat=='Musician/band') {
	                    
	                    imgcat = 6; 
	                    } else if (cat=='Sport') {
	                    imgcat = 7; 
	                    }
	                
	                   var placeimage = imgplace[imgcat];
	                   var markerplace = new MarkerWithLabel({
	                                    position: new google.maps.LatLng(place.geometry.location.lat,place.geometry.location.lng),
	                                    map: map,
	                                    id:'cat_' + c +'_place_'+i,
	                                    icon: placeimage
	                                    });
	                                     
	                 
	                                    allmarkersplace.push(markerplace);
	                 
	                    var latlngObj = {'id': markerplace.id, 'point': new google.maps.LatLng(place.geometry.location.lat,place.geometry.location.lng)};
	                 
	                    LatLngList.push(latlngObj);
	                     
	                    mgr.addMarker(markerplace, 0);
	                    
	                                       
	                                       //alert(markerplace.id);
	              
	                });
	                               //boundMarker();
	                               mgr.refresh();
	                       });
	      });
	    }*/
    });

    return MapView;
});