define([
		'lib/maps/overlays/photo',
		'lib/maps/overlays/marker',
		'lib/maps/overlays/audio'
		], function() {
	/** 
     * Class that manages the display of map overlays that are attached
     * to Backbone.Model data objects.
     * @class OverlayManager
     * @param {Object} opts
	 * A dictionary of available options (the map and the eventManager)
	 * @param {google.maps.Map} opts.map
	 * A reference to the UI's Google Map object
	 * @param {Backbone.Events} opts.eventManager
	 * Coordinates the triggering and listening to events across shared
	 * objects.
     */
	localground.maps.managers.OverlayManager = function (opts) {
		opts = opts || {};
		
		/** Reference to a google.maps.Map */
		this.map = null;
		
		/**
		 * Reference to the app's eventManager, which is passed
		 * throughout the app to trigger and listen for key events.
		 */
		this.eventManager = null;
		
		/**
		 * A dictionary of dictionaries that reference overlays
		 * that are rendered on the map. Each key corresponds to
		 * a particular data type ('markers', 'photos', etc.) and
		 * each value is a dictionary of id:overlay pairs (for easy
		 * lookup).
		 */
		this.overlays = {};
		
		/**
		 * Sets the member variables on instantiation and
		 * listens for key events
		 * @param {Object} opts
		 * A dictionary of available options (the map and the eventManager)
		 * @param {google.maps.Map} map
		 * A reference to the UI's Google Map object
		 * @param {Backbone.Events} eventManager
		 * Coordinates the triggering and listening to events across shared
		 * objects.
		 */
		this.initialize = function(opts) {
			opts = opts || {};
			$.extend(this, opts);
	
			// check that object initialization params present:
			if (this.map == null)
				alert("\"map\" option required for localground.maps.OverlayManager object");
			if (this.eventManager == null)
				alert("\"eventManager\" option required for localground.maps.OverlayManager object");
		
			this.attachEventHandlers();
		};
		
		/**
		 * Listens for important events triggered by the UI
		 */
		this.attachEventHandlers= function() {
			var that = this;
			this.eventManager.on(localground.events.EventTypes.SHOW_OVERLAY, function(model){
				var overlay = that.getOverlay(model);
				overlay.show();
				overlay.zoomTo();
			});
			this.eventManager.on(localground.events.EventTypes.HIDE_OVERLAY, function(model){
				that.getOverlay(model).hide();
			});
			this.eventManager.on(localground.events.EventTypes.ZOOM_TO_OVERLAY, function(model){
				that.getOverlay(model).zoomTo();
			});
			
			this.eventManager.on(localground.events.EventTypes.SHOW_ALL, function(key){
				that.showAll(key);
			});	
		};
		
		this.getOverlay = function(model){
			var key = model.collection.key;
			var id = model.id;	
			this.overlays[key] = this.overlays[key] || {};
			var opts = {
				model: model,
				map: this.map
			};
			if (this.overlays[key][id] == null) {
				if(key == "photos")
					this.overlays[key][id] = new localground.maps.overlays.Photo(opts);
				else if (key == "markers")
					this.overlays[key][id] = new localground.maps.overlays.Marker(opts);
				else if (key == "audio")
					this.overlays[key][id] = new localground.maps.overlays.Audio(opts);
				else
					this.overlays[key][id] = new localground.maps.overlays.Marker(opts);
			}
			return this.overlays[key][id];
		};
		
		this.showAll = function(key) {
			this.overlays[key] = this.overlays[key] || {};
			for (id in this.overlays[key]) {
				this.overlays[key][id].setMap(this.map);
			}
		};
		
		this.hideAll = function(key) {
			this.overlays[key] = this.overlays[key] || {};
			for (id in this.overlays[key]) {
				this.overlays[key][id].setMap(null);
			}
		};
		
		this.initialize(opts);
	};

	return localground.maps.managers.OverlayManager;
});