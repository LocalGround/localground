define([], function() {
	/** 
     * Class that adds a Search Box to the map.
     * @class OverlayManager
     * @param opts Initialization options for the Geolocation class.
     * @param {google.maps.Map} opts.map A google.maps.Map object, to which the
     * OverlayManager control should reference.
     */
	localground.maps.controls.OverlayManager = (function (opts) {
		opts = opts || {};
		this.overlays = {};
		this.EventTypes = {
			SHOW_OVERLAY: "show_overlay",
			HIDE_OVERLAY: "hide_overlay",
			ZOOM_TO_OVERLAY: "zoom_to_overlay",
		};
		
		var map = opts.map;
		var eventManager = opts.eventManager;

		// check that object initialization params present:
		if (map == null)
			alert("\"map\" option required for localground.maps.OverlayManager object");
		if (eventManager == null)
			alert("\"eventManager\" option required for localground.maps.OverlayManager object");
			
		var initialize = function() {
			eventManager.on("show_overlay", function(overlay){
				alert("show: " + overlay);
			});
			eventManager.on("hide_overlay", function(overlay){
				alert("hide: " + overlay);
			});
			eventManager.on("zoom_to_overlay", function(overlay){
				alert("zoom to: " + overlay);
			});
		};
		initialize();
	});
	return localground.maps.controls.OverlayManager;
});