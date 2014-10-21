define(["models/project", "collections/base"], function (Project, Base) {
    "use strict";
    /**
     * @class localground.collections.Projects
     */
    var Projects = Base.extend({
        model: Project,
        name: 'Projects',
        key: 'projects',
        overlay_type: 'project',
        url: '/api/0/projects/',
        parse: function (response) {
            return response.results;
        }
    });
    return Projects;
});
