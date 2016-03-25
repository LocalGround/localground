define(["models/project", "collections/base", "collections/basePageable"], function (Project, Base,BasePageable) {
    "use strict";
    /**
     * @class localground.collections.Projects
     */
    var Projects = BasePageable.extend({
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
