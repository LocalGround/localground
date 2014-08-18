define([
		'lib/maps/overlays/photo',
		'lib/maps/overlays/marker'
		], function() {
	/** 
     * Class that adds a Search Box to the map.
     * @class OverlayManager
     * @param opts Initialization options for the Geolocation class.
     * @param {google.maps.Map} opts.map A google.maps.Map object, to which the
     * OverlayManager control should reference.
     */
	localground.maps.controls.OverlayManager = function (opts) {
		opts = opts || {};
		this.EventTypes = {
			SHOW_OVERLAY: "show_overlay",
			HIDE_OVERLAY: "hide_overlay",
			ZOOM_TO_OVERLAY: "zoom_to_overlay",
		};
		
		this.overlays = {};
		var map = opts.map;
		var eventManager = opts.eventManager;

		// check that object initialization params present:
		if (map == null)
			alert("\"map\" option required for localground.maps.OverlayManager object");
		if (eventManager == null)
			alert("\"eventManager\" option required for localground.maps.OverlayManager object");
			
		this.initialize = function() {
			var that = this;
			eventManager.on("show_overlay", function(model){
				//alert("show: " + model);
				var overlay = that.getOverlay(model);
				overlay.show();
				overlay.zoomTo();
			});
			eventManager.on("hide_overlay", function(model){
				that.getOverlay(model).hide();
			});
			eventManager.on("zoom_to_overlay", function(model){
				that.getOverlay(model).zoomTo();
			});
		};
		
		this.getOverlay = function(model){
			var key = model.getNamePlural();
			var id = model.id;	
			this.overlays[key] = this.overlays[key] || {};
			var opts = {
				model: model,
				map: map
			};
			if (this.overlays[key][id] == null) {
				switch (model.getNamePlural()) {
					case "photos":
						this.overlays[key][id] = new localground.maps.overlays.Photo(opts);
						break;
					case "markers":
						this.overlays[key][id] = new localground.maps.overlays.Marker(opts);
						break;
					default:
						this.overlays[key][id] = new localground.maps.overlays.Marker(opts);
						break;
				}
			}
			return this.overlays[key][id];
		}
		
		this.initialize();
	};
	return localground.maps.controls.OverlayManager;
});