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
                if (this.get("id")) {
                    this.projectUsers = new ProjectUsers(null, { id: this.get("id") });
                }
                Base.prototype.initialize.apply(this, arguments);
            },

            shareWithUser: function (username, authorityID, errorCallback) {
                var projectUser = new ProjectUser(null, { id: this.get("id") }),
                    that = this;
                projectUser.set("user", username);
                projectUser.set("authority", authorityID);
                projectUser.save(null, {
                    success: function () {
                        that.getProjectUsers();
                    },
                    error: errorCallback
                });
            },

            getProjectUserCount: function () {
                return this.projectUsers.length;
            },


            getProjectUsers: function () {
                this.projectUsers.fetch({ reset: true });
            },

            getProjectUserByUsername: function (username) {
                var i, pu, u;
                for (i = 0; i < this.projectUsers.length; i++) {
                    pu = this.projectUsers.at(i);
                    u = pu.get("user");
                    if (u === username) {
                        return pu;
                    }
                }
                return null;
            }

        });
        return Project;
    }
);
