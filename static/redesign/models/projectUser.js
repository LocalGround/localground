define(["underscore", "models/base"], function (_, Base) {
    "use strict";
    /**
     * A Backbone Model class for the Project datatype.
     * @class Project
     * @see <a href="//localground.org/api/0/projects/">//localground.org/api/0/projects/</a>
     */
    var ProjectUser = Base.extend({
        defaults: _.extend({}, Base.prototype.defaults, {
            isActive: false,
            isVisible: false,
            checked: false
        }),
        initialize: function (data, id) {
            if (!id) {
                alert("id initialization parameter required for ProjectUser");
                return;
            }
            // This had to be made dynamic because there are different users
            // for each project
            this.urlRoot = '/api/0/projects/' + id + '/users/';
			Base.prototype.initialize.apply(this, arguments);
		}
    });
    return ProjectUser;
});