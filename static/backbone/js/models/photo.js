define(["lib/external/backbone-min"], function(Backbone) {
	var Photo = Backbone.Model.extend({
		defaults: {
			name: "Untitled"
		}
	});
	return Photo;
});
