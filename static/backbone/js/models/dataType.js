define(["lib/external/backbone-min"], function(Backbone) {
	var DataType = Backbone.Model.extend({
		defaults: {
			name: "Untitled"
		},
		toString: function() {
			return this.get('name');
		}
	});
	return DataType;
});
