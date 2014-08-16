define(["models/base"], function() {
	/**
	 * A Backbone Model class for the Project datatype.
	 * @class Project
	 * @see <a href="http://localground.org/api/0/projects/">http://localground.org/api/0/projects/</a>
	 */
	localground.models.Project = localground.models.Base.extend({
		defaults: {
			name: "Untitled"
		},
		urlRoot: "/api/0/projects/",
	});
	return localground.models.Project;
});
