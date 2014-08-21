define(
	[
		"views/maps/basemap",
		"views/maps/sidepanel/dataPanel",
		"lib/maps/managers/dataManager",
		"views/maps/overlays/overlayManager",
		"views/maps/overlays/bubbleManager"
		
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
		
		el: "body",
		/** A {@link localground.maps.views.Basemap} object */
		basemap: null,
		/** A {@link localground.maps.managers.DataManager} object */
		dataManager: null,
		
		/** A {@link localground.maps.controls.OverlayManager} object */
		overlayManager: null,
		
		/** A object that coordinates events across objects */
		eventManager: _.extend({}, Backbone.Events),
		
		/** A {@link localground.maps.views.DataPanel} object */
		dataPanel: null,
		/** A Map InfoBubble */
		infoBubble: null,
		/** A Map InfoBubble tooltip */
		toolTip: null,
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
			
			//listen for projects being added or removed:
			this.attachEvents();
			
			this.basemap = new localground.maps.views.Basemap({
				mapContainerID: "map_canvas",
				defaultLocation: opts.defaultLocation,
				searchControl: true,
				geolocationControl: false,
				activeMapTypeID: opts.activeMapTypeID,
				overlays: opts.overlays 
			});
			
			this.bubbleManager = new localground.maps.views.InfoBubble({
				map: this.basemap.map,
				eventManager: this.eventManager
			});
			
			this.dataManager = new localground.maps.managers.DataManager({
				eventManager: this.eventManager
			});
			
			/** Controls the map overlays */
			this.overlayManager = new localground.maps.views.OverlayManager({
				dataManager: this.dataManager,
				eventManager: this.eventManager,
				map: this.basemap.map
			});
			
			/** Controls the side panel overlay listings */
			this.dataPanel = new localground.maps.views.DataPanel({
				dataManager: this.dataManager,
				eventManager: this.eventManager,
				map: this.basemap.map
			});
			this.$el.find('#panels').append(this.dataPanel.render().el);
		},

		/**
		 * Adds event listeners to listen for window resize
		 */
		attachEvents: function(){
			var that = this;
			$(window).off('resize');
			$(window).on('resize', function(){
				that.dataPanel.resize();	
			});
			
			this.eventManager.on("loaded", function(){
				that.restoreData();
			});
		},
		
		/** */
		restoreData: function(){
			//return;
			var workspace = JSON.parse(localStorage["workspace"]);
			for (var i=0; i < workspace.project_ids.length; i++) {
				this.dataManager.fetchDataByProjectID(workspace.project_ids[i]);
			}
		}
	});
	return localground.maps.views.MapEditor;
});
