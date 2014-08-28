define(["lib/maps/geometry/point"], function() {
    /** 
     * Class that controls marker point model overlays.
     * @class Overlay
     */
	localground.maps.overlays.Overlay = Backbone.View.extend({
		
		sb: null,
		map: null,
		model: null,

		/** called when object created */
		initialize: function(sb, opts) {
			this.sb = sb;
			$.extend(opts, this.restoreState());
			this.map = sb.getMap();
			this.model = opts.model;
			if(opts.isVisible) {this.createOverlay(); }	
		},
		
		/**
		 * Creates a google.maps.Marker overlay with a photo icon
		 * if one doesn't already exist, and returns it.
		 * @returns {Object}
		 * Either a google.maps.Marker, google.maps.Polyline,
		 * google.maps.Polygon, or google.maps.GroundOverlay
		 */
		getGoogleOverlay: function(){
			if (this.googleOverlay == null) {
				this.createOverlay();
			}
			return this.googleOverlay;
		},
		
		createOverlay: function(){
			alert("implement in child class");	
		},
		attachEventHandlers: function(){
			var that = this;
			//attach click event:
			google.maps.event.addListener(this.googleOverlay, 'click', function() {
				that.sb.notify({
					type : "show-bubble",
					data : { model: that.model, center: that.getCenter() } 
				});
			});
			//attach mouseover event:
			google.maps.event.addListener(this.googleOverlay, 'mouseover', function() {
				that.sb.notify({
					type : "show-tip",
					data : { model: that.model, center: that.getCenter() } 
				});
			});
			//attach mouseout event:
			google.maps.event.addListener(this.googleOverlay, 'mouseout', function() {
				that.sb.notify({
					type : "hide-tip",
				});
			});
		},
		isVisible: function(){
			return this.getGoogleOverlay().getMap() != null;
		},
		
		/** shows the google.maps overlay on the map. */
		show : function(){
			var overlay = this.getGoogleOverlay();
			overlay.setMap(this.map);
			this.saveState();
		},
		
		/** hides the google.maps overlay from the map. */
		hide: function(){
			var overlay = this.getGoogleOverlay();
			overlay.setMap(null);
			this.saveState();
		},
		
		/** zooms to the google.maps overlay. */
		zoomTo: function(){
			this.map.panTo(this.getCenter());
			if(this.map.getZoom() <17){ this.map.setZoom(17); }
		},
		
		/** centers the map at the google.maps overlay */
		centerOn: function(){
			this.map.panTo(this.getCenter());
		},
		
		/**
		 * Calculates the approximate center point
		 * @returns {google.maps.LatLng} object
		 */
		getCenter: function(){
			return this.getGoogleOverlay().getPosition();
		},
		saveState: function(){
			this.sb.saveState({
				isVisible: this.isVisible()
			});
		},
		restoreState: function(){
			var state = this.sb.restoreState();
			if (state == null)
				return { isVisible: false };
			else
				return state;
		},
		
		/**
		 * Needs to be implemented
		 */
		destroy: function(){
			alert("bye");	
		}

	});
	return localground.maps.overlays.Overlay;
});