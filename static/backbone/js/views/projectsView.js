define(["lib/external/backbone-min", "collections/Projects", "models/Project"],
	   function(Backbone, Projects, Project) {
    var ProjectsView = Backbone.View.extend({
        initialize: function(opts) {
            this.projects = new Projects();
			this.projects.fetch({ reset: true });
			this.render();
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    return ProjectsView;
});
