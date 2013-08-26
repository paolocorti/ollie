define([
    'underscore',
    'backbone',
    'jquery',
    'collection/profile_friends_collection',
    'text!template/content-1.html'

],function(
    _,
    Backbone,
    $,
    ProfileFriendCollection,
    ProfileTemplate
){
    
    var profilefriendcollection =  new ProfileFriendCollection();

    return Backbone.View.extend({

    template: _.template( ProfileTemplate ),


    initialize: function () {
        console.log('profile')
        this.render(); 
        $(".pulsante").addClass("cliccato");
        $(".pulsante_2").removeClass("cliccato");
        $(".pulsante_3").removeClass("cliccato_3");

        $.ajax ({type: "POST",url:'http://trinity.micc.unifi.it/ollie/ollie_php/user_near_me.php',
                 data: {fbid: this.model.get("id")} }).done(function(response ) {

            var data = $.parseJSON(response);

            profilefriendcollection.add(data);

            console.log("profile friend collection__"+JSON.stringify(profilefriendcollection));
        });

        this.createIcon();
    },

    render: function () {
        this.$el.html(this.template());
        this.me();

        return this;
    },

    me: function () {
        console.log(this.model.get("name"));
        $('#utente').append("<p class='p3'><strong>"+this.model.get("name")+"</strong></p>");
        $('#profile_image_container').append("<img class='photo_user' src='https://graph.facebook.com/"+this.model.get("id")+"/picture?type=large'></img>");
    },

    createIcon: function() {
        console.log("createIcon");
        profilefriendcollection.each(function( model ){
            console.log("model__"+model)
        }, this ); 
    }

    });
});
/*$(document).ready(function() {
	
    
    
    
		$.ajax ({type: "POST",url:'http://trinity.micc.unifi.it/ollie/ollie_php/user_near_me.php',
				 data: {fbid:profileID} }).done(function(response ) {
            						var data = $.parseJSON(response);
			 						function isArray(what) {
                                           return Object.prototype.toString.call(what) === '[object Array]';}
       
                                                                                                                              
          $.each(data, function(i,object){
                                                                                                                                     
                 if ($.isArray(object.cat)) {
                 
                 var cat = object.cat;
                 
                 $.each(cat, function(i,val){
                        
                        var category = val;
                
                        
                        if(category=="Media") {
                        
                        $('#3').empty();
                        $('#bookul').append("<li><div class='smart_photos'><img class='photo_user' src='"+object.pic+"'></img></div></li>");
                        
                        } else if (category=="Movie") {
                        $('#2').empty();
                        $('#cinemaul').append("<li><div class='smart_photos'><img class='photo_user' src='"+object.pic+"'></img></div></li>");
                        
                        } else if (category=="Clothing") {
                        $('#4').empty();
                        $('#fashionul').append("<li><div class='smart_photos'><img class='photo_user' src='"+object.pic+"'></img></div></li>");
                
                        } else if (category=="Art/culture") {
                        $('#5').empty();
                        $('#artul').append("<li><div class='smart_photos'><img class='photo_user' src='"+object.pic+"'></img></div></li>");
                     
                        } else if (category=="Food/beverages") {
                        $('#6').empty();
                        $('#foodul').append("<li><div class='smart_photos'><img class='photo_user' src='"+object.pic+"'></img></div></li>");
                    
                        } else if (category=="Health/beauty") {
                        $('#7').empty();
                        $('#healthul').append("<li><div class='smart_photos'><img class='photo_user' src='"+object.pic+"'></img></div></li>");
                        
                        } else if (category=="Musician/band") {
                        $('#1').empty();

                        $('#musicul').append("<li><div class='smart_photos'><img class='photo_user' src='"+object.pic+"'></img></div></li>");
                        
                        } else if (category=="Sport") {
                        $('#8').empty();
                        $('#sportul').append("<li><div class='smart_photos'><img class='photo_user' src='"+object.pic+"'></img></div></li>");
                        
                        } 
                        });
               }
                 
          if(!isArray(object.cat)) {
             for (var prop in object.cat) {
                if (object.cat.hasOwnProperty(prop)) {
                 
                 if(object.cat[prop]=="Media") {
                 $('#3').empty();
                 $('#bookul').append("<li><div class='smart_photos'><img class='photo_user' src='"+object.pic+"'></img></div></li>");
                 
                 } else if (object.cat[prop]=="Movie") {
                 $('#2').empty();
                 $('#cinemaul').append("<li><div class='smart_photos'><img class='photo_user' src='"+object.pic+"'></img></div></li>");
                
                 } else if (object.cat[prop]=="Clothing") {
                 $('#4').empty();
                 $('#fashionul').append("<li><div class='smart_photos'><img class='photo_user' src='"+object.pic+"'></img></div></li>");
             
                 } else if (object.cat[prop]=="Art/culture") {
                 $('#5').empty();
                 $('#artul').append("<li><div class='smart_photos'><img class='photo_user' src='"+object.pic+"'></img></div></li>");
       
                 } else if (object.cat[prop]=="Food/beverages") {
                 $('#6').empty();
                 $('#foodul').append("<li><div class='smart_photos'><img class='photo_user' src='"+object.pic+"'></img></div></li>");
   
                 } else if (object.cat[prop]=="Health/beauty") {
                 $('#7').empty();
                 $('#healthul').append("<li><div class='smart_photos'><img class='photo_user' src='"+object.pic+"'></img></div></li>");
                
                 
                 } else if (object.cat[prop]=="Musician/band") {
                 $('#1').empty();
                 $('#musicul').append("<li><div class='smart_photos'><img class='photo_user' src='"+object.pic+"'></img></div></li>");
           
                 } else if (object.cat[prop]=="Sport") {
                 $('#8').empty();
                 $('#sportul').append("<li><div class='smart_photos'><img class='photo_user' src='"+object.pic+"'></img></div></li>");
               
                 } 
				}
                                                                                                                                     }
                                                                                                                                     }
                                                                                                                                     });
                                                                                                                                       
    });
       
	
});
*/
