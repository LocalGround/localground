define(["backbone",
		"config",
		"views/sidepanel/projectsMenu",
		"views/sidepanel/items",
		"text!templates/sidepanel/dataPanelHeader.html"],
	   function(Backbone, Config, ProjectsMenu, ItemsView, dataPanelHeader) {
	var DataPanel = Backbone.View.extend({
		template: _.template( dataPanelHeader ),
		dataManager: null,
		map: null,
		projectsMenu: null,
		dataViews: {},
		initialize: function(opts){
			$.extend(this, opts);
			
			this.projectsMenu = new ProjectsMenu({
				dataManager: this.dataManager
			});
			this.render();
		},
		render: function() {
			//render projects menu if it doesn't currently exist:
			if (this.$el.find('.projects-menu').get(0) == null) {
				this.$el.empty().append(this.template());
				this.$el.find('.projects-menu').append(
					this.projectsMenu.render().el
				);
			}
			
			//render sub-views:
			this.$el.find('.pane-body').empty();
			for (key in this.dataManager.collections) {
				if (this.dataViews[key] == null) {
					//alert("adding new!");
					this.dataViews[key] = new ItemsView({
						collection: this.dataManager.collections[key],
						itemTemplateHtml: Config[key.split("_")[0]].itemTemplateHtml,
						map: this.map
					});
				}
				this.$el.find('.pane-body').append(this.dataViews[key].render().el);
			}
			
			//re-attach event handlers:
			this.projectsMenu.delegateEvents();
			return this;
		}
	});
	return DataPanel;
});
