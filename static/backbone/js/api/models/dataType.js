define(["models/base"], function() {
	var DataType = localground.models.Base.extend({
		defaults: {
			name: "Untitled"
		},
		toString: function() {
			return this.get('name');
		}
	});
	return DataType;
});
