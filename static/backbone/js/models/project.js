define(["models/base"], function(Base) {
	var Project = Base.extend({
		defaults: {
			name: "Untitled"
		},
		urlRoot: "/api/0/projects/",
	});
	return Project;
});
