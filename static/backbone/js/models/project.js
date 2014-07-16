define(["lib/external/backbone-min"], function(Backbone) {
	var Project = Backbone.Model.extend({
		defaults: {
			name: "Untitled"
		},
		urlRoot: "/api/0/projects/",
	});
	return Project;
});
