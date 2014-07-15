define(["lib/external/backbone-min"], function(Backbone) {
	var MapImage = Backbone.Model.extend({
		defaults: {
			name: "Untitled"
		}
	});
	return MapImage;
});
