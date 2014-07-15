define(["lib/external/backbone-min",
		"config",
		"models/project",
		"collections/projects",
		"views/itemsview",
		"text!templates/dataPanelHeader.html"],
	   function(Backbone, Config, Project, Projects, ItemsView, dataPanelHeader) {
	var DataPanelView = Backbone.View.extend({
		template: _.template( dataPanelHeader ),
		projects: {},
		events: {
			'click #projects': 'showProjectsMenu'
		},
		render: function() {
			this.$el.empty();
			this.$el.append(this.template());
			return this;
		},
		showProjectsMenu: function(){
			alert("projects");	
		},
		loadProjectData: function(id) {
			var that = this;
			this.project = new Project({id: id});
			this.project.fetch({data: {format: 'json'}, success: function(r){
				that.$el.find('.pane-body').empty();
				var childLists = that.project.get("children");
				//initialize sub-managers:
				for (key in childLists) {
					var opts = Config[key.split("_")[0]];
					var models = [];
					$.each(childLists[key].data, function(){
						models.push(new opts.Model(this));
					});
					if (models.length > 0) {
						var view = new ItemsView({
							collection: new opts.Collection(models),
							itemTemplateHtml: opts.itemTemplateHtml
						})
						if (key.indexOf("form") != -1) {
							view.collection.name = childLists[key].name;
						}
						that.$el.find('.pane-body').append(view.render().el);
					}
				}
			}});
		}
	});
	return DataPanelView;
});
