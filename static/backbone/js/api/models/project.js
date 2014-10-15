define(["models/base"], function (Base) {
    "use strict";
    /**
     * A Backbone Model class for the Project datatype.
     * @class Project
     * @see <a href="http://localground.org/api/0/projects/">http://localground.org/api/0/projects/</a>
     */
    var Project = Base.extend({
        defaults: {
            name: "Untitled",
            isActive: false
        },
        urlRoot: "/api/0/projects/"
    });
    return Project;
});
