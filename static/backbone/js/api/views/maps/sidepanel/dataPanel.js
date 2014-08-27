define(["backbone",
		"core",
		"text!" + templateDir + "/sidepanel/dataPanelHeader.html",
		"views/maps/sidepanel/projectsMenu",
		"views/maps/sidepanel/items",
		"lib/maps/managers/workspaceManager"],
	   function(Backbone, CORE, dataPanelHeader) {
	/**
	 * A class that handles display and rendering of the
	 * data panel and projects menu
	 * @class DataPanel
	 */
	localground.maps.views.DataPanel = Backbone.View.extend({
		/**
		 * @lends localground.maps.views.DataPanel#
		 */
		el: '#panels',
		template: _.template( dataPanelHeader ),
		dataManager: null,
		eventManager: null,
		basemap: null,
		//projectsMenu: null,
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
		initialize: function(sb){
			this.sb = sb;
			var that = this;
			
			CORE.create_module("projects-menu", function(sb){
				return new localground.maps.views.ProjectsMenu(sb);	
			});
			CORE.start("projects-menu");
			//this.projectsMenu = new localground.maps.views.ProjectsMenu(sb);
			
			/*this.workspaceManager = new localground.maps.managers.WorkspaceManager({
				dataViews: this.dataViews,
				basemap: this.basemap,
				dataManager: this.dataManager,
				eventManager: this.eventManager
			});*/
			this.render();
			
			// Listen for the "new_collection" event. On each new
			// collection event add a new ItemsView to the DataPanel.
			sb.listen({ 
                "new-collection-created": this.createItemsView
			});
			
		},
		
		createItemsView: function(collection){
			//todo: register this module too:
			var items = new localground.maps.views.Items(sb, {
				collection: collection,
			});
			this.$el.find('.pane-body').append(items.render().$el);
		},
		
		/**
		 * render projects menu if it doesn't currently exist
		 */
		renderProjectsMenu: function(){
			if (this.$el.find('.projects-menu').get(0) == null) {
				this.$el.empty().append(this.template());
				//this.projectsMenu.render();
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
			this.resize();
			return this;
		},
		
		destroy: function(){
			alert("todo: implement");
		},
		
		resize: function(){
			this.$el.find('.pane-body').height($('body').height() - 140);
		},
		
		saveWorkspace: function(){
			this.workspaceManager.saveWorkspace();
		}
	});
	return localground.maps.views.DataPanel;
});
