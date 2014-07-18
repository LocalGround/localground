define([
		"lib/external/backbone-min",
		"config",
		"collections/projects",
		"models/project",
		"views/items",
		"views/item",
		"text!templates/projectItem.html"],
	   function(Backbone, Config, Projects, Project, ItemsView, ItemView, projectItem) {
    
	var ProjectsMenu = Backbone.View.extend({
		dataManager: null,
        initialize: function(opts) {
			$.extend(this, opts);
            this.dataManager.fetchProjects();
        },
		template: _.template(projectItem),
		events: {
			'click .cb-project': 'toggleProjectData',
			'click div': 'stopPropagation'
		},
		render: function() {
			//alert("rendering project menu");
			this.$el.empty();
			this.dataManager.projects.each(function(item) {
				this.renderProject(item);
			}, this);
			this.delegateEvents();
			return this;
		},
		renderProject: function(item) {
			var itemView = new ItemView({
				model: item,
				template: _.template( projectItem ),
			});
			this.$el.append(itemView.render().el);
		},
		stopPropagation: function(e) {
			e.stopPropagation();	
		},
		toggleProjectData: function(e) {
			var $cb = $(e.currentTarget);
			if ($cb.prop("checked")) {
				this.dataManager.fetchDataByProjectID($cb.val());
				e.stopPropagation();
			}
			else {
				alert("hide project");
				//http://backbonejs.org/#Collection-remove
			}
		}
    });
    return ProjectsMenu;
});
