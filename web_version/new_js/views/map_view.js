define([
    'underscore',
    'backbone',
    'jquery',
    'model/friends',
    'collection/friends_collection',
    'text!template/content-2.html',

],function(
    _,
    Backbone,
    $,
    FriendModel,
    FriendsCollection,
    MapTemplate
){

    var map;
    var mgr;
    var onLine;
    //tiene memoria di tutti i marker
    var allUsersMarkers = [];
    //tiene memoria di tutte le infobox
    var allUsersInfobox = [];
    //tiene memoria di tutti gli infobubbles
    var allinfobubbles = [];
    var allmarkersplace = [];
    var LatLngList = new Array();
    var friendsmodel
    var friendscollection = new FriendsCollection();
    
    return Backbone.View.extend({

    template: _.template( MapTemplate ),

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
        $(".pulsante").removeClass("cliccato"),
        $(".pulsante_2").addClass("cliccato"),
        $(".pulsante_3").removeClass("cliccato_3")
    },

    render: function () {
        this.$el.html(this.template());
        this.loadmap();
        return this;
    },

    loadmap: function () {
        console.log('loadmap')    
        map = new google.maps.Map(document.getElementById('map'), {
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
        });

        mgr = new MarkerManager(map);

    },

    onError: function (error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    },
        
    onSuccess: function (position) {
        console.log('onSuccess')   
        this.socketon(); 
        this.latitude = position.coords.latitude.toFixed(6);
        this.longitude = position.coords.longitude.toFixed(6); 
        
    },

    socketon: function () {
        var self = this;
        console.log('init socket');
        profilePicture = 'https://graph.facebook.com/'+this.model.get("id")+'/picture';
        profileID = this.model.get("id");
        profileName = this.model.get("username");
        if(!onLine) {
            socket = io.connect('trinity.micc.unifi.it:9999');
            socket.on('connect', function() {
                onLine = 1;
                socket.on('socketID', function (response) {
                    mySocketId = response;
                    self.initMe();  
                    //alert(" my socket id: " + mySocketId + " fbid: " + profileID + " fbname: " + profileName + "fbpic" + profilePicture);
                    socket.emit(
                        'update_user_on_map', 
                        {
                            fbid: profileID, 
                            fbname: profileName, 
                            fbpic: profilePicture, 
                            lat: self.latitude, 
                            lng: self.longitude, 
                            socketid: mySocketId, 
                            online: onLine,
                            notify: true
                        }
                    );
                });
                socket.on('new_user', function (newUserData) {
                    var friendmodel = new FriendModel();
                    friendmodel.set(newUserData);
                    console.log("new user__"+friendmodel);
                    self.addMarker(friendmodel);
                    friendscollection.push(friendmodel);
                    console.log("new friend collection__"+JSON.stringify(friendscollection));
                    //var info = response;
                    //initFriends(info);
                });
                socket.on('user_position_data', function (friendsData) {
                    var friends = $.parseJSON(friendsData);
                    friendscollection.add(friends);
                    console.log("friend collection__"+JSON.stringify(friendscollection));
                    self.updateFriends();
                });           
            });
            
            socket.on('user_disconnected', function (socketID) {
                alert('user_disconnected');
                alert('function deleteMarker');
                self.deleteMarker(socketID);
            });
        } else {
            console.log("else socketOn");
            console.log(self);
            self.initMe();
            socket.emit(
                    'update_user_on_map', 
                    {
                        fbid: profileID, 
                        fbname: profileName, 
                        fbpic: profilePicture, 
                        lat: this.latitude, 
                        lng: this.longitude, 
                        socketid: mySocketId, 
                        online: onLine,
                        notify: false
                    }

            );
        }

    },

    initMe: function () {
        console.log('initme') 
        var latLngMe = new google.maps.LatLng(this.latitude,this.longitude);
        map.panTo(latLngMe);
        var myicon = new google.maps.MarkerImage('./graphics/user.png',
                                                 null,
                                                 null,
                                                 null,
                                                 new google.maps.Size(64, 80));
        var mymarker = new google.maps.Marker({position: latLngMe,
                                              map: map,
                                              icon: myicon,
                                              zIndex : 1000
                                              });
            
        allUsersMarkers.push({"socketId":mySocketId, "fbId": profileID, "marker": mymarker});  
        console.log(allUsersMarkers);
        var myPoint = new google.maps.LatLng(this.latitude,this.longitude);
        var myPosObj = {"id":mySocketId+"-"+profileID, "point": myPoint}
        
        LatLngList.push(myPosObj);
        console.log(LatLngList);
        //boundMarker();
        mgr.refresh();
    },

    addMarker: function(usermodel) {
            var self = this;
            console.log('add marker')

            var lat = usermodel.get("lat");
            var lng = usermodel.get("lng");
            var pic = usermodel.get("fbpic");
            var user_fbid = usermodel.get("id");
            var name = usermodel.get("fbname");
            var socketID = usermodel.get("socketid");
            var pictureLabel = document.createElement("img");
            pictureLabel.src = pic;
                                         
            var icon = "graphics/users.svg";
                                         
            var marker = new MarkerWithLabel({position: new google.maps.LatLng(lat, lng),
                map: map,
                id: socketID+"-"+user_fbid,
                icon: icon,                                                   
                labelContent: pictureLabel,
                labelAnchor: new google.maps.Point(25, 80),
                labelClass: "labels",
                labelStyle: {opacity: 1}
            });
            allUsersMarkers.push({"socketId":socketID, "fbId": user_fbid, "marker": marker});                     
            
            /*var boxText = document.createElement("div");
            boxText.innerHTML = "<h4 class='userprofilelink'>"+ name +"</h4>";
            
            var myOptions = {
                 content: boxText,
                 disableAutoPan: true,
                 maxWidth: 0,
                 pixelOffset: new google.maps.Size(-75, 0),
                 zIndex: null,
                 closeBoxMargin: "10px 2px 2px 2px",
                 closeBoxURL: "graphics/chiudi.png",
                 infoBoxClearance: new google.maps.Size(1, 1),
                 isHidden: false,
                 pane: "floatPane",
                 enableEventPropagation: true
              };
                                         
             var ib = new InfoBox(myOptions);
             
             var ibObj = {"user" : socketID, "info" : ib};
             
             allUsersInfobox.push(ibObj);
            */
                                         
             google.maps.event.addListener(marker, "click", function () { 
             
                    alert("click")

                    /*for (var m in allUsersInfobox) {

                      if(allUsersInfobox[m].user == this.id) {
                        allUsersInfobox[m].info.open(map, this);

                      }   else {
                        allUsersInfobox[m].info.close();
                      }                 
                    }
                                           
                    if (allmarkersplace.length > 0){
                                           deletePlaces();
                                           }*/
                    this.getPlaces(usermodel);
                                              
              });//END addListener marker, "click"
             //var latlngObj = {"id" : socketID+"-"+user_fbid, "point": new google.maps.LatLng(lat, lng)};
                    
             //LatLngList.push(latlngObj);

             mgr.addMarker(marker, 0);
             //boundMarker();
             mgr.refresh();
    },

    updateFriends: function (friendsData) {
      var self = this;
                    console.log('updateFriends')
                //$.each(friends, function(i, datauser){
                   // alert(datauser.fbid);
        friendscollection.each(function( model ){  

                    var lat = model.get("lat");
                    var lng = model.get("lng");
                    var pic = model.get("fbpic");
                    var user_fbid = model.get("name");
                    var name = model.get("fbname");
                    var socketID = model.get("socketid");
                                                 
                    var pictureLabel = document.createElement("img");
                    pictureLabel.src = pic;
                                                 
                    var icon = "graphics/users.svg";
                                                 
                    var marker = new MarkerWithLabel({position: new google.maps.LatLng(lat, lng),
                        map: map,
                        id: socketID+"-"+user_fbid,
                        icon: icon,                                                   
                        labelContent: pictureLabel,
                        labelAnchor: new google.maps.Point(25, 80),
                        labelClass: "labels",
                        labelStyle: {opacity: 1}
                    });
                    
                    
                    var latlngObj = {"id": socketID+"-"+user_fbid, "point": new google.maps.LatLng(lat, lng)};
                    
                    LatLngList.push(latlngObj);
                                                                     
                    allUsersMarkers.push({"socketId":socketID, "fbId": user_fbid, "marker": marker});                     
                        
                    var boxText = document.createElement("div");
                    boxText.innerHTML = "<h4 class='userprofilelink'>"+ name +"</h4>";
                    
                    var myOptions = {
                         content: boxText,
                         disableAutoPan: true,
                         maxWidth: 0,
                         pixelOffset: new google.maps.Size(-75, 0),
                         zIndex: null,
                         closeBoxMargin: "10px 2px 2px 2px",
                         closeBoxURL: "graphics/chiudi.png",
                         infoBoxClearance: new google.maps.Size(1, 1),
                         isHidden: false,
                         pane: "floatPane",
                         enableEventPropagation: true
                      };
                                                 
                     var ib = new InfoBox(myOptions);
                     
                     var ibObj = {"user" : socketID, "info" : ib};
                     
                     allUsersInfobox.push(ibObj);
                    
                                                 
                     google.maps.event.addListener(marker, "click", function () { 
                     
                            for (var m in allUsersInfobox) {

                              if(allUsersInfobox[m].user == this.id) {
                                allUsersInfobox[m].info.open(map, this);
                              }   else {
                                allUsersInfobox[m].info.close();
                              }                 
                            }
                            if (allmarkersplace.length > 0){
                                //deletePlaces();
                            }
                            self.getPlaces(model);                                                        
                      });//END addListener marker, "click" 
                       
                    mgr.addMarker(marker, 0);
                                   
          //boundMarker();
          mgr.refresh();
          }, this ); 
                                                                
    },

    deleteMarker: function (socketID) {
        alert("socket da cancellare " + socketID);      
          for (var i in allUsersMarkers) {                
            if(allUsersMarkers[i].socketId == socketID) {     
              mgr.removeMarker(allUsersMarkers[i].marker)
              delete allUsersMarkers[i];
              break;
              }                
          } 
      /*    
      for (var i in allUsersInfobox) {
                  
          if(allUsersInfobox[i].user == socketID) {
            
          allUsersInfobox[i].info.close();
          delete allUsersInfobox[i];
  
          //alert(allUsersInfobox.length);
  
          break;
          }                
      }
      
            
        
      for (var i in LatLngList) {
                alert(LatLngList[i].id);
          if(LatLngList[i].id.indexOf(socketID)!== -1) {
                      
                alert("deleted "+LatLngList[i].id);
                      
          delete LatLngList[i];
          break;
                    
          }          
                
       }  
      */
    },

    getPlaces: function (info) {
        var placelabel;
        var imgplace;
        var imgcat;
        var name = info.get("name");
    
            $.ajax ({
                    type: "POST",
                    url:'http://trinity.micc.unifi.it/ollie/ollie_php/match_user_likes_curl.php',
                    data: { id_1:profileID,
                            id_2:info.get("id"),
                            lat: this.latitude,
                            long: this.longitude
                          }
                    }).done(function(response ) {
                            
                            allmarkersplace = []; 
                            allinfobubbles = [];                                                                                                                                                                       
                            places = $.parseJSON(response);
                            
                            imgplace = new Array("graphics/place_book.svg",
                                                 "graphics/place_movie.svg",
                                                 "graphics/place_fashion.svg",
                                                 "graphics/place_art.svg",
                                                 "graphics/place_food.svg",
                                                 "graphics/place_health.svg",
                                                 "graphics/place_music.svg",
                                                 "graphics/place_sport.svg"
                                                 );   
            $.each(places, function(c,data){
                var cat = data.categoria;
                var placesarray = data.curl.results
                               
                $.each(placesarray, function(i,place){
                  if(cat=="Media") {
                    
                    imgcat = 0; 
                    } else if (cat=="Movie") {
                    imgcat = 1; 
                    } else if (cat=="Clothing") {
                    imgcat = 2; 
                    } else if (cat=="Art/culture") {
                    imgcat = 3; 
                    } else if (cat=="Food/beverages") {
                    imgcat = 4; 
                    } else if (cat=="Health/beauty") {
                    imgcat = 5; 
                    } else if (cat=="Musician/band") {
                    
                    imgcat = 6; 
                    } else if (cat=="Sport") {
                    imgcat = 7; 
                    }
                
                   var placeimage = imgplace[imgcat];
                   var markerplace = new MarkerWithLabel({
                                    position: new google.maps.LatLng(place.geometry.location.lat,place.geometry.location.lng),
                                    map: map,
                                    id:"cat_" + c +"_place_"+i,
                                    icon: placeimage
                                    });
                                     
                 
                                    allmarkersplace.push(markerplace);
                 
                    var latlngObj = {"id": markerplace.id, "point": new google.maps.LatLng(place.geometry.location.lat,place.geometry.location.lng)};
                 
                    LatLngList.push(latlngObj);
                     
                    mgr.addMarker(markerplace, 0);
                    
                                       
                                       //alert(markerplace.id);
              
                });
                               //boundMarker();
                               mgr.refresh();
                       });
      });
    }
    });

});