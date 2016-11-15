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
        initialize: function (data, opts) {
            console.log(data, opts);
            // This had to be made dynamic because there are different users
            // for each project
            if (this.collection && this.collection.url) {
                this.urlRoot = this.collection.url;
            } else if (opts.id) {
                this.urlRoot = '/api/0/projects/' + opts.id + '/users/';
            } else {
                alert("id initialization parameter required for ProjectUser");
                return;
            }
			Base.prototype.initialize.apply(this, arguments);
		},
        destroy: function (options) {
            //this.set("id", 1); //BUG: the ID needs to be set in order for the destroy to work.
            // needed to override the destroy method because the ProjectUser
            // endpoint doesn't have an ID, which Backbone requires:
            var opts = _.extend({url: this.urlRoot + this.get("user") + "/"}, options || {});
            console.log(opts);
            return Backbone.Model.prototype.destroy.call(this, opts);
        }
    });
    return ProjectUser;
});