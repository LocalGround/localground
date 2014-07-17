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
        initialize: function(opts) {
            var that = this;
			this.projects = new Projects();
			this.projects.fetch({ reset: true , async: false});
        },
		template: _.template(projectItem),
		events: {
			'click .cb-project': 'toggleProjectData',
			'click #projectsMenu': 'stopPropagation' //todo: hardcoded HTML element
		},
		render: function() {
			this.$el.empty();
			this.projects.each(function(item) {
				this.renderProject(item);
			}, this);
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
				this.loadProjectData($cb.val());
				e.stopPropagation();
			}
			else {
				alert("hide project");
			}
		},
		loadProjectData: function(id) {
			var that = this;
			this.project = new Project({id: id});
			this.project.fetch({data: {format: 'json'}, success: function(r){
				that.renderData();
			}});
		},
		renderData: function(){
			$('body').find('.pane-body').empty();
			var children = this.project.get("children");
			//initialize sub-managers:
			for (key in children) {
				var opts = Config[key.split("_")[0]];
				opts.rawData = children[key].data;
				var view = new ItemsView(opts);
				$('body').find('.pane-body').append(view.render().el);
			}
		}
    });
    return ProjectsMenu;
});
