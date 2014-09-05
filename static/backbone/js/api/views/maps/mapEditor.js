define(
	[
		"views/maps/basemap",
		"views/maps/sidepanel/dataPanel",
		"lib/maps/data/dataManager",
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
		/** A {@link localground.maps.data.DataManager} object */
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
			
			var sb = {
				eventManager:this.eventManager,
				getWorkspace: function(){
					return JSON.parse(localStorage["workspace"]);
				},
				subscribe: function () { 
					//not sure if error handling should go here...
					if (core.is_obj(evts)) { 
						core.registerEvents(evts, module_selector); 
					}             
				},  
			};
			
			//listen for projects being added or removed:
			this.attachEvents();
			
			this.basemap = new localground.maps.views.Basemap(sb, {
				mapContainerID: "map_canvas",
				defaultLocation: opts.defaultLocation,
				includeSearchControl: true,
				includeGeolocationControl: false,
				activeMapTypeID: opts.activeMapTypeID,
				overlays: opts.overlays
			});
			
			this.bubbleManager = new localground.maps.views.InfoBubble(sb, {
				map: this.basemap.map
			});
			
			this.dataManager = new localground.maps.data.DataManager({
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
				basemap: this.basemap
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
			
		}
	});
	return localground.maps.views.MapEditor;
});
