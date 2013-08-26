define([
	'backbone'

],function(
	Backbone

){
	
	return Backbone.Model.extend({

		defaults: {
			"fbid" : "",
			"fbname" : "",
			"fbpic" : "",
			"lat" : "",
			"lng" : "",
			"socketid" : ""
		}
		
	});
	
});