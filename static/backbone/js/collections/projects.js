define(["jquery", "lib/external/backbone-min", "models/project"], function($, Backbone, Project) {
    var Projects = Backbone.Collection.extend({
        model: Project,
		name: 'Photos',
        url: 'http://localground.org/api/0/projects/',
		parse : function(response) {
            return response.results;
        },
    });
    return Projects;
});
