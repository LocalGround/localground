define(
    ["underscore", "models/base", "models/projectUser", "collections/projectUsers"],
    function (_, Base, ProjectUser, ProjectUsers) {
        "use strict";
        /**
         * A Backbone Model class for the Project datatype.
         * @class Project
         * @see <a href="//localground.org/api/0/projects/">//localground.org/api/0/projects/</a>
         */
        var Project = Base.extend({
            defaults: _.extend({}, Base.prototype.defaults, {
                isActive: false,
                isVisible: false,
                checked: false
            }),
            urlRoot: "/api/0/projects/",
            initialize: function (data, opts) {
                this.projectUsers = new ProjectUsers(null, { id: this.get("id") });
                Base.prototype.initialize.apply(this, arguments);
            },

            shareWithUser: function (username, authorityID) {
                console.log("shareWithUser");
                var projectUser = new ProjectUser(null, { id: this.get("id") }),
                    that = this;
                projectUser.set("user", username);
                projectUser.set("authority", authorityID);
                projectUser.save(null, {
                    success: function () {
                        that.getProjectUsers();
                    }
                });
            },

            // Apparently, there is not a way to get the array of users
            // from the project object directly
            // using inheritance-based ways
            getProjectUserCount: function () {
                return this.projectUsers.length;
            },

            // we get a collection of users by setting up
            // a temporary dummy user that has nothing inside
            // However, it returns undefined
            getProjectUsers: function () {
                this.projectUsers.fetch({ reset: true });
            }

        });
        return Project;
    }
);
