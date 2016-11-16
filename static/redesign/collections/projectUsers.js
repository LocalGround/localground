define(
    ["models/projectUser", "collections/basePageable"],
    function (ProjectUser, BasePageable) {
        "use strict";
        /**
         * @class localground.collections.Projects
         */
        var ProjectUsers = BasePageable.extend({
            model: ProjectUser,
            name: 'ProjectUsers',
            initialize: function (recs, opts) {
                if (!opts.id) {
                    alert("The ProjectUsers collection requires a url parameter upon initialization");
                    return;
                }
                // This had to be made dynamic because there are different users
                // for each project
                this.url = '/api/0/projects/' + opts.id + '/users/';
                BasePageable.prototype.initialize.apply(this, arguments);
            }
        });
        return ProjectUsers;
    }
);
