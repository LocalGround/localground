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
		
		map: null,
		dataManager: null,
		eventManager: null,
		overlayGroups: {},
		initialize: function(opts) {
			$.extend(this, opts);
			this.attachEventHandlers();
		},
		
		attachEventHandlers: function() {
			var that = this;
			
			//listen for new additions to the collections:
			//this.dataManager.selectedProjects.on('add', this.test, this);
			//this.dataManager.selectedProjects.on('remove', this.test, this);
			this.eventManager.on(localground.events.EventTypes.NEW_COLLECTION, function(collection){
				// for each child data collection in the dataManager,
				// add an add and a remove listener, so that a corresponding
				// map overlay can be generated / destroyed.
				console.log('creating a new localground.maps.views.OverlayGroup for the ' + collection.key + ' collection.')
				that.overlayGroups[collection.key] = new localground.maps.views.OverlayGroup({
					map: that.map,
					collection: collection,
					eventManager: that.eventManager,
					isVisible: false
				});
			});
			
				
			this.eventManager.on(localground.events.EventTypes.ZOOM_TO_EXTENT, function(key){
				that.overlayGroups[key].zoomToExtent();
			});
			
			this.eventManager.on(localground.events.EventTypes.SHOW_ALL, function(key){
				that.overlayGroups[key].showAll();
				console.log(that.overlayGroups);
			});
			
			this.eventManager.on(localground.events.EventTypes.HIDE_ALL, function(key){
				that.overlayGroups[key].hideAll();
			});
		}
	});
	return localground.maps.views.OverlayManager;
});
