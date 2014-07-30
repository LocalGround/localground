define(["lib/external/backbone-min"], function(Backbone) {
	var Form = Backbone.Model.extend({
		defaults: {
			name: "Untitled"
		}
	});
	return Form;
});
