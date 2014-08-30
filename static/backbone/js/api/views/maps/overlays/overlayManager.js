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
		
		/** A dictionary indexing the various
		 * {@link localground.maps.views.OverlayGroup} objects.
		 */
		overlayGroups: {},
		
		/**
		 * Initializes the object.
		 * @param {Object} sb
		 * Sandbox
		 */
		initialize: function(sb) {
			this.sb = sb;
			this.map = sb.getMap();
			sb.listen({ 
                "new-collection-created" : this.createOverlayGroup,
                //"zoom-to-extent" : this.zoomToExtent,
                //"show-all" : this.showAll,
                //"hide-all" : this.hideAll
            });
		},
		createOverlayGroup: function(data) {
			this.overlayGroups[data.collection.key] = this.sb.loadSubmodule(
				"overlayGroup-" + data.collection.key,
				localground.maps.views.OverlayGroup,
				{ collection: data.collection, isVisible: false }
			);
		},
		/*zoomToExtent: function(data) {
			this.overlayGroups[data.key].zoomToExtent();
		},
		showAll: function(data) {
			console.log(data);
			this.overlayGroups[data.key].showAll();
			this.overlayGroups[data.key].zoomToExtent();
		},
		hideAll: function(data) {
			this.overlayGroups[data.key].hideAll();
		},*/
		getOverlay: function(model){
			return this.overlayGroups[model.collection.key].getOverlay(model);
		},
		destroy: function(){
			alert("bye");	
		}
	});
	return localground.maps.views.OverlayManager;
});
