define(["models/base"], function() {
	var Form = localground.models.Base.extend({
		defaults: {
			name: "Untitled"
		}
	});
	return Form;
});
