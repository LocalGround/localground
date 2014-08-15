define(
	[
		"views/maps/basemap",
		"views/maps/sidepanel/dataPanel",
		"lib/maps/data/dataManager"
		
	], function() {
	/**
	 * The top-level view class that harnesses all of the map editor
	 * functionality. Also coordinates event triggers across all of
	 * the constituent views.
	 * @class MapEditor
	 */
	localground.maps.views.MapEditor = Backbone.View.extend({
		/**
		 * @lends localground.maps.views.MapEditor#
		 */
		
		el: "#panels",
		/** A {@link localground.maps.views.Basemap} object */
		basemap: null,
		/** A {@link localground.maps.data.DataManager} object */
		dataManager: null,
		
		/** A {@link localground.maps.views.DataPanel} object */
		dataPanel: null,
		/**
		 * Initializes the BasemapView and all of the panels.
		 * @method initialize
		 * @param {Object} opts
		 * Dictionary of initialization options
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
			
			this.basemap = new localground.maps.views.Basemap({
				mapContainerID: "map_canvas",
				defaultLocation: opts.defaultLocation,
				searchControl: true,
				geolocationControl: false,
				activeMapTypeID: opts.activeMapTypeID,
				overlays: opts.overlays 
			});
			
			this.dataManager = new localground.maps.data.DataManager();
			
			this.dataPanel = new localground.maps.views.DataPanel({
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
	return localground.maps.views.MapEditor;
});
