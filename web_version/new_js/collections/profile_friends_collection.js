define([
	'backbone',
	'model/profile_friends'
],function(
	Backbone,
	ProfileFriendsModel
){
	return Backbone.Collection.extend({

		model: ProfileFriendsModel
		
	});
	
});