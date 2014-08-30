define(["backbone", "models/project", "collections/base"], function(Backbone) {
    /**
	 * @class localground.collections.Projects
	 */
	localground.collections.Projects = localground.collections.Base.extend({
        model: localground.models.Project,
		name: 'Projects',
		key: 'projects',
		overlay_type: 'project',
        url: '/api/0/projects/',
		parse : function(response) {
            return response.results;
        },
    });
    return localground.collections.Projects;
});
