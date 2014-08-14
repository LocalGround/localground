define(
	[
		"views/maps/sidepanel/dataPanel",
		"views/maps/basemap",
		"lib/map/data/dataManager"
		
	], function(DataPanel, BasemapView) {
	/**
	 * The top-level view class that harnesses all of the map editor
	 * functionality. Also coordinates event triggers across all of
	 * the constituent views.
	 * @class MapEditor
	 */
	localground.map.views.MapEditor = Backbone.View.extend({
		/**
		 * @lends localground.map.views.MapEditor#
		 */
		
		el: "#panels",
		/** A localground.map.views.BasemapView object */
		basemap: null,
		/** A localground.map.data.DataManager object */
		dataManager: null,
		
		/** A localground.map.views.DataPanel object */
		dataPanel: null,
		/**
		 * Initializes the BasemapView and all of the panels. 
		 */
		initialize: function(opts) {
			$.extend(this, opts);
			
			/*this.panelManager = new PanelManagerView([
				'data',
				'symbols',
				'presentations',
				'downloads'
			]);
			*/
			
			this.basemap = new BasemapView({
				mapContainerID: "map_canvas",
				defaultLocation: opts.defaultLocation,
				searchControl: true,
				geolocationControl: false,
				activeMapTypeID: opts.activeMapTypeID,
				overlays: opts.overlays 
			});
			
			this.dataManager = new localground.map.data.DataManager();
			
			this.dataPanel = new DataPanel({
				dataManager: this.dataManager,
				map: this.basemap.map
			});
			this.$el.append(this.dataPanel.render().el);
			
			//listen for projects being added or removed:
			this.dataManager.selectedProjects.on('add', this.updatePanel, this);
			this.dataManager.selectedProjects.on('remove', this.updatePanel, this);
		},
		/**
		 * Triggered when a new project is loaded or removed
		 */
		updatePanel: function(){
			//console.log("update panel triggered");
			this.dataPanel.render();
		}
	});
	return localground.map.views.MapEditor;
});
