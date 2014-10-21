define(["underscore", "models/base"], function (_, Base) {
    "use strict";
    /**
     * A Backbone Model class for the Project datatype.
     * @class Project
     * @see <a href="http://localground.org/api/0/projects/">http://localground.org/api/0/projects/</a>
     */
    var Project = Base.extend({
        defaults: _.extend({}, Base.prototype.defaults, {
            isActive: false,
            isVisible: true
        }),
        urlRoot: "/api/0/projects/"
    });
    return Project;
});
