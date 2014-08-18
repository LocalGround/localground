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
		 * Reference to the app's dataManager.
		 */
		this.dataManager = null;
		
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
		 * @param {google.maps.Map} opts.map
		 * A reference to the UI's Google Map object
		 * @param {localground.maps.managers.DataManager} opts.dataManager
		 * @param {Backbone.Events} opts.eventManager
		 * Coordinates the triggering and listening to events across shared
		 * objects.
		 */
		this.initialize = function(opts) {
			opts = opts || {};
			$.extend(this, opts);
	
			// check that object initialization params present:
			if (this.map == null)
				alert("\"map\" option required for localground.maps.managers.OverlayManager object");
			if (this.eventManager == null)
				alert("\"eventManager\" option required for localground.maps.managers.OverlayManager object");
			if (this.dataManager == null)
				alert("\"dataManager\" option required for localground.maps.managers.OverlayManager object");
		
			this.attachEventHandlers();
		};
		
		/**
		 * Listens for important events triggered by the UI
		 */
		this.attachEventHandlers= function() {
			var that = this;
			
			//listen for new additions to the collections:
			//this.dataManager.selectedProjects.on('add', this.test, this);
			//this.dataManager.selectedProjects.on('remove', this.test, this);
			this.eventManager.on(localground.events.EventTypes.NEW_COLLECTION, function(collection){
				// for each child data collection in the dataManager,
				// add an add and a remove listener, so that a corresponding
				// map overlay can be generated / destroyed.
				that.overlays[collection.key] = {};
				collection.on('add', that.createOverlay, that);
				collection.on('remove', that.test, that);
			});
			
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
			
			this.eventManager.on(localground.events.EventTypes.HIDE_ALL, function(key){
				that.hideAll(key);
			});	
		};
		
		/**
		 * A little tricky. Basically, this method is called every time
		 * a new model is added to its corresponding collection in the
		 * dataManager. The method creates a new overlay for each model
		 * where the GeoJSON geometry is defined.
		 * @param {Backbone.Model} model
		 */
		this.createOverlay = function(model) {
			if (model.get("geometry") == null) { return; }
			
			var key = model.collection.key;
			var id = model.id;
			var opts = {
				model: model,
				map: this.map
			};
			if(key == "photos")
				this.overlays[key][id] = new localground.maps.overlays.Photo(opts);
			else if (key == "markers")
				this.overlays[key][id] = new localground.maps.overlays.Marker(opts);
			else if (key == "audio")
				this.overlays[key][id] = new localground.maps.overlays.Audio(opts);
			else
				this.overlays[key][id] = new localground.maps.overlays.Marker(opts);
		};
		
		/**
		 * Gets the overlay on behalf of the eventListener
		 * @returns {Object} overlay
		 * A localground.overlays.* object.
		 */
		this.getOverlay = function(model){
			var key = model.collection.key;
			return this.overlays[key][model.id];
		};
		
		/**
		 * Shows all of the overlays that correspond to the key
		 * @param {String} key
		 * The key that corresponds with the corresponding collection
		 * key in the dataManager.
		 */
		this.showAll = function(key) {
			this.overlays[key] = this.overlays[key] || {};
			for (id in this.overlays[key]) {
				this.overlays[key][id].show();
			}
		};
		
		/**
		 * Hides all of the overlays that correspond to the key
		 * @param {String} key
		 * The key that corresponds with the corresponding collection
		 * key in the dataManager.
		 */
		this.hideAll = function(key) {
			this.overlays[key] = this.overlays[key] || {};
			for (id in this.overlays[key]) {
				this.overlays[key][id].hide();
			}
		};
		
		this.initialize(opts);
	};

	return localground.maps.managers.OverlayManager;
});