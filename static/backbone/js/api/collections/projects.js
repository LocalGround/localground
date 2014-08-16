define(["backbone", "models/project"], function(Backbone) {
    var Projects = Backbone.Collection.extend({
        model: localground.models.Project,
		name: 'Photos',
        url: '/api/0/projects/',
		parse : function(response) {
            return response.results;
        },
    });
    return Projects;
});
