define(["backbone",
		"text!" + templateDir + "/sidepanel/dataPanelHeader.html",
		"views/maps/sidepanel/projectsMenu",
		"views/maps/sidepanel/items",
		"lib/maps/managers/workspaceManager",
		"config"],
	   function(Backbone, dataPanelHeader) {
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
		eventManager: null,
		basemap: null,
		projectsMenu: null,
		dataViews: {},
		events: {
			'click #save_workspace': 'saveWorkspace'
		},
		
		/**
		 * Initializes the dataPanel
		 * @param {Object} opts
		 * A dictionary of available options
		 * @param {google.maps.Map} opts.map
		 * A reference to the UI's Google Map object
		 * @param {localground.maps.managers.DataManager} opts.dataManager
		 * @param {Backbone.Events} opts.eventManager
		 * Coordinates the triggering and listening to events across shared
		 * objects.
		 *
		 */
		initialize: function(opts){
			var that = this;
			$.extend(this, opts);
			
			this.projectsMenu = new localground.maps.views.ProjectsMenu({
				dataManager: this.dataManager,
				eventManager: this.eventManager
			});
			
			// listen for changes in the selectedProjects, and re-render
			// accordingly
			this.dataManager.selectedProjects.on('add', this.render, this);
			this.dataManager.selectedProjects.on('remove', this.render, this);
			
			this.render();
			this.eventManager.trigger("loaded");
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
					var configKey = key.split("_")[0];
					this.dataViews[key] = new localground.maps.views.Items({
						collection: this.dataManager.collections[key],
						ItemTemplate: localground.config.Config[configKey].ItemTemplate,
						ItemView: localground.config.Config[configKey].ItemView,
						map: this.basemap.map,
						eventManager: this.eventManager
					});
				}
				this.$el.find('.pane-body')
					.append(
						this.dataViews[key].render().el);
			}
			
			//re-attach event handlers:
			this.projectsMenu.delegateEvents();
			this.resize();
			return this;
		},
		
		resize: function(){
			this.$el.find('.pane-body').height($('body').height() - 140);
		},
		
		saveWorkspace: function(){
			var workspaceManager = new localground.maps.managers.WorkspaceManager({
				dataViews: this.dataViews,
				basemap: this.basemap,
				dataManager: this.dataManager
			});
			workspaceManager.serializeWorkspace();
		}
	});
	return localground.maps.views.DataPanel;
});
