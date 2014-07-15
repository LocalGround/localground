define(["lib/external/backbone-min"], function(Backbone) {
	var Marker = Backbone.Model.extend({
		defaults: {
			name: "Untitled"
		}
	});
	return Marker;
});
