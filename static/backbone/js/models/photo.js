define(["models/base"], function(Base) {
	var Photo = Base.extend({
		defaults: {
			name: "Untitled"
		}
	});
	return Photo;
});
