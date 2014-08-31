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
		
		/**
		 * Initializes the object.
		 * @param {Object} sb
		 * Sandbox
		 */
		initialize: function(sb) {
			this.sb = sb;
			sb.listen({ 
                "new-collection-created" : this.createOverlayGroup
            });
		},
		createOverlayGroup: function(data) {
			this.sb.loadSubmodule(
				"overlayGroup-" + data.collection.key,
				localground.maps.views.OverlayGroup,
				{ collection: data.collection, isVisible: false }
			);
		},
		destroy: function(){
			this.remove();
		}
	});
	return localground.maps.views.OverlayManager;
});
