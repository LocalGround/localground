define(["lib/external/backbone-min"], function(Backbone) {
	var Audio = Backbone.Model.extend({
		defaults: {
			name: "Untitled"
		}
	});
	return Audio;
});
