define([
	'backbone',
	'model/friends'
],function(
	Backbone,
	FriendsModel
){
	return Backbone.Collection.extend({

		model: FriendsModel
		
	});
	
});