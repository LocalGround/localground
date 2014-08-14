define(["models/base"], function(Base) {
	var Form = Base.extend({
		defaults: {
			name: "Untitled"
		}
	});
	return Form;
});
