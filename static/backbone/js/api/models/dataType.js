define(["models/base"], function(Base) {
	var DataType = Base.extend({
		defaults: {
			name: "Untitled"
		},
		toString: function() {
			return this.get('name');
		}
	});
	return DataType;
});
