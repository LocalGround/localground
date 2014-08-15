define(["backbone",
		"views/maps/sidepanel/items",
		"text!" + templateDir + "/sidepanel/dataPanelHeader.html",
		"views/maps/sidepanel/projectsMenu",
		"config"],
	   function(Backbone, ItemsView, dataPanelHeader) {
	/**
	 * A class that handles display and rendering of the
	 * data panel and projects menu
	 * @class DataPanel
	 */
	localground.maps.views.DataPanel = Backbone.View.extend({
		/**
		 * @lends localground.maps.views.DataPanel#
		 */
		
		template: _.template( dataPanelHeader ),
		dataManager: null,
		map: null,
		projectsMenu: null,
		dataViews: {},
		initialize: function(opts){
			$.extend(this, opts);
			
			this.projectsMenu = new localground.maps.views.ProjectsMenu({
				dataManager: this.dataManager
			});
			this.render();
		},
		/**
		 * render projects menu if it doesn't currently exist
		 */
		renderProjectsMenu: function(){
			if (this.$el.find('.projects-menu').get(0) == null) {
				this.$el.empty().append(this.template());
				this.$el.find('.projects-menu').append(
					this.projectsMenu.render().el
				);
			}	
		},
		
		/**
		 * Renders the HTML for the data panel. Called everytime
		 * project data changes. Note that the project panel is
		 * only rendered once.
		 */
		render: function() {
			//render projects menu:
			this.renderProjectsMenu();
			
			//render sub-views:
			this.$el.find('.pane-body').empty();
			for (key in this.dataManager.collections) {
				if (this.dataViews[key] == null) {
					this.dataViews[key] = new ItemsView({
						collection: this.dataManager.collections[key],
						itemTemplateHtml: localground.config.Config[key.split("_")[0]].itemTemplateHtml,
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
	return localground.maps.views.DataPanel;
});
