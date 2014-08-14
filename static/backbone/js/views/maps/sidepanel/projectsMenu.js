define([
		"backbone",
		"config",
		"collections/projects",
		"models/project",
		"views/maps/sidepanel/items",
		"views/maps/sidepanel/item",
		"text!templates/sidepanel/projectItem.html"],
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
			'click div': 'stopPropagation',
			'click .project-item': 'triggerToggleProjectData'
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
		triggerToggleProjectData: function(e){
			var $cb = $(e.currentTarget).find('input');
			//I don't know why this has to be such a hack, but it is:
			$cb.attr('checked', !$cb.attr('checked'));
			$cb.trigger("click");
			$cb.attr('checked', !$cb.attr('checked'));
		},
		toggleProjectData: function(e) {
			var $cb = $(e.currentTarget);
			if ($cb.prop("checked"))
				this.dataManager.fetchDataByProjectID($cb.val());
			else
				this.dataManager.removeDataByProjectID($cb.val());
			e.stopPropagation();
		}
    });
    return ProjectsMenu;
});
