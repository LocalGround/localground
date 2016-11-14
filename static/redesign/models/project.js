define(["underscore", "models/base"], function (_, Base) {
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

        // This one only returns the User with data
        // However, it does not return the array of users
        // or a collection of project users
        getProjectUserModel: function () {
            return Base.extend({
                defaults: _.extend({}, Base.prototype.defaults, {
                    isActive: false,
                    isVisible: false,
                    checked: false
                }),
                // This had to be made dynamic because there are different users
                // for each project
                //
                urlRoot: "/api/0/projects/" + this.get("id") + "/users/"
            });
        },
        shareWithUser: function (username, authorityID) {
            var ProjectUser = this.getProjectUserModel(),
                projectUser = new ProjectUser();
            projectUser.set("user", username);
            projectUser.set("authority", authorityID);
            projectUser.save();
        },

        // Apparently, there is not a way to get the array of users
        // from the project object directly
        // using inheritance-based ways
        getProjectUserCount: function(){
          var userCount = this.get("count"); // Does this work?
          return userCount;
        },

        // we get a collection of users by setting up
        // a temporary dummy user that has nothing inside
        // However, it returns undefined
        getProjectUserCollection: function(){
          var ProjectUser = this.getProjectUserModel(),
              projectUser = new ProjectUser();
              console.log(projectUser.attributes);
          return projectUser.collection;
        }

    });
    return Project;
});
