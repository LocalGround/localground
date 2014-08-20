define(
	["views/maps/overlays/overlayGroup"], function() {
	/**
	 * Controls a dictionary of overlayGroups 
	 * @class OverlayManager
	 */
	localground.maps.views.OverlayManager = Backbone.View.extend({
		/**
		 * @lends localground.maps.views.OverlayManager#
		 */
		
		/** A google.maps.Map object */
		map: null,
		/** A {@link localground.maps.managers.DataManager} object. */
		dataManager: null,
		/** A Backbone.Events object */
		eventManager: null,
		/** A dictionary indexing the various
		 * {@link localground.maps.views.OverlayGroup} objects.
		 */
		overlayGroups: {},
		
		/**
		 * Initializes the object.
		 * @param {Object} opts
		 * @param {localground.maps.managers.DataManager} opts.dataManager
		 * @param {Backbone.Events} opts.eventManager
		 * @param {google.maps.Map} opts.map
		 */
		initialize: function(opts) {
			$.extend(this, opts);
			this.attachEventHandlers();
		},
		
		/**
		 * Listens for collection-level events on the map
		 * Event handlers include:
		 *
		 * 1) Handler that listen for the creation of new collections
		 * within the app.
		 * 
		 * 2) Handler that zooms to the extent of the overlayGroup defined by the key
		 * The key refers to the collection associated with the
		 * {@link localground.maps.views.OverlayGroup}.
		 *
		 * 3) Handler that shows all overlays on the map that correspond to the key.
		 *
		 * 4) Handler that hides all overlays on the map that correspond to the key.
		 *
		 */
		attachEventHandlers: function() {
			var that = this;
			
			//listen for new additions to the collections:
			this.eventManager.on(localground.events.EventTypes.NEW_COLLECTION, function(collection){
				// for each child data collection in the dataManager,
				// add an add and a remove listener, so that a corresponding
				// map overlay can be generated / destroyed.
				that.overlayGroups[collection.key] = new localground.maps.views.OverlayGroup({
					map: that.map,
					collection: collection,
					eventManager: that.eventManager,
					isVisible: false
				});
			});
			
			// Zooms to the extent of the overlayGroup defined by the key
			this.eventManager.on(localground.events.EventTypes.ZOOM_TO_EXTENT, function(key){
				that.overlayGroups[key].zoomToExtent();
			});
			
			// Shows all overlays on the map that correspond to the key.
			this.eventManager.on(localground.events.EventTypes.SHOW_ALL, function(key){
				that.overlayGroups[key].showAll();
				that.overlayGroups[key].zoomToExtent();
			});
			
			// Shows all overlays on the map that correspond to the key.
			this.eventManager.on(localground.events.EventTypes.HIDE_ALL, function(key){
				that.overlayGroups[key].hideAll();
			});
		}
	});
	return localground.maps.views.OverlayManager;
});
