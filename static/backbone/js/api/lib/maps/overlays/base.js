define(["backbone",
		"lib/maps/overlays/point",
		"lib/maps/overlays/polyline",
		"lib/maps/overlays/polygon"
		], function(Backbone) {
    /** 
     * This class controls the rendering and underlying
     * visibility of Google overlay objects, including points,
     * lines, and polygons
     * @class Overlay
     */
	localground.maps.overlays.Base = Backbone.View.extend({
		
		sb: null,
		map: null,
		model: null,
		overlay: null,

		/** called when object created */
		initialize: function(sb, opts) {
			//alert(localground.maps.overlays.Polyline);
			this.sb = sb;
			$.extend(opts, this.restoreState());
			this.map = sb.getMap();
			this.model = opts.model;
			this.initOverlayType(opts.isVisible || false);
			
			this.listenTo(this.model, 'remove', this.remove);
			this.listenTo(this.model, 'show-overlay', this.show);
			this.listenTo(this.model, 'hide-overlay', this.hide);
			this.listenTo(this.model, 'zoom-to-overlay', this.zoomTo);
			this.listenTo(this.model, 'change', this.redraw);
			this.sb.listen({
				"mode-change" : this.changeMode
			});
			
		},
		
		initOverlayType: function(isVisible){
			var geoJSON = this.model.get("geometry");
			var opts = {
				model: this.model,
				map: this.map,
				isVisible: isVisible
			};
			if (geoJSON.type == 'Point')
				this.overlay = new localground.maps.overlays.Point(this.sb, opts);
			else if (geoJSON.type == 'LineString')
				this.overlay = new localground.maps.overlays.Polyline(this.sb, opts);
			else if (geoJSON.type == 'Polygon')
				this.overlay = new localground.maps.overlays.Polygon(this.sb, opts);
			else
				alert('Unknown Geometry Type');
				
			this.attachEventHandlers();
		},
		
		attachEventHandlers: function(){
			var that = this;
			//attach click event:
			google.maps.event.addListener(this.getGoogleOverlay(), 'click', function() {
				that.sb.notify({
					type : "show-bubble",
					data : { model: that.model, center: that.getCenter() } 
				});
			});
			//attach mouseover event:
			google.maps.event.addListener(this.getGoogleOverlay(), 'mouseover', function() {
				that.sb.notify({
					type : "show-tip",
					data : { model: that.model, center: that.getCenter() } 
				});
			});
			//attach mouseout event:
			google.maps.event.addListener(this.getGoogleOverlay(), 'mouseout', function() {
				that.sb.notify({
					type : "hide-tip",
				});
			});
		},
		
		/** determines whether the overlay is visible on the map. */	
		isVisible: function(){
			return this.getGoogleOverlay().getMap() != null;
		},
		
		/** shows the google.maps overlay on the map. */		
		show: function(){
			var overlay = this.getGoogleOverlay();
			overlay.setMap(this.map);
			this.saveState();
		},
		
		/** hides the google.maps overlay from the map. */
		hide: function(){
			var overlay = this.getGoogleOverlay();
			overlay.setMap(null);
			this.sb.notify({ 
				type : "hide-bubble", 
				data : { model: this.model } 
			}); 
			this.saveState();
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
		
		remove: function(){
			var overlay = this.getGoogleOverlay();
			overlay.setMap(null);
			localground.maps.overlays.Base.__super__.remove.apply(this); 
		},
		
		/**
		 * Needs to be implemented
		 */
		destroy: function(){
			this.remove();
		},
		
		/********************************************************/
		/** DELEGATED METHODS ***********************************/
		/********************************************************/
		
		/**
		 * Returns the overlay's googleOverlay
		 * @returns {Object}
		 * Either a google.maps.Marker, google.maps.Polyline,
		 * google.maps.Polygon, or google.maps.GroundOverlay
		 */
		getGoogleOverlay: function(){
			return this.overlay._googleOverlay;
		},
		
		/** zooms to the google.maps overlay. */
		zoomTo: function(){
			this.overlay.zoomTo();
			this.sb.notify({
				type: "show-bubble",
				data: {
					model: this.model,
					center: this.getCenter()
				}
			});
		},
		
		/** centers the map at the google.maps overlay */
		centerOn: function(){
			this.overlay.centerOn();
		},
		
		/**
		 * Delegates to underlying geometry.
		 * @returns {google.maps.LatLng} object
		 */
		getCenter: function(){
			return this.overlay.getCenter();
		},
		
		changeMode: function(){
			if (this.sb.getMode() == "view")
				this.makeViewable();
			else
				this.makeEditable();
		},
		
		makeViewable: function(){
			this.overlay.makeViewable();	
		},
		
		makeEditable: function(){
			this.overlay.makeEditable(this.model);
		},
		
		redraw: function(){
			alert("implement in child class");
		}

	});
	return localground.maps.overlays.Base;
});