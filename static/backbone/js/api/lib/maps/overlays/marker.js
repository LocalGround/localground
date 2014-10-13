define([
		"lib/maps/overlays/base"
		], function() {
    /** 
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Overlay}.
     * @class Marker
     */
	localground.maps.overlays.Marker = localground.maps.overlays.Base.extend({
		MARKER_RADIUS: 10,		
		/**
		 * Get the corresponding SVG marker icon
		 * @returns {Object} icon definition
		 */
		getIcon: function() {
			//return null;
			return {
				fillColor: '#' + this.model.get("color"),
				strokeColor: "#FFF",
				strokeWeight: 1.5,
				fillOpacity: 1,
				path: this.overlay.Shapes.MAP_PIN_HOLLOW,
				scale: 1.6,
				anchor: new google.maps.Point(16,30), 		// anchor (x, y)
				size: new google.maps.Size(15, 30),			// size (width, height)
				origin: new google.maps.Point(0,0)			// origin (x, y)
			};
		},
		
		getHighlightIcon: function(){
			var icon = this.getIcon();
			icon.fillColor = '#73FF81';
			return icon;
		},
		
		/** adds icon to overlay. */
		initialize: function(sb, opts){
			localground.maps.overlays.Marker.__super__.initialize.apply(this, arguments); 
			this.redraw();
			this.sb.listen({
				"check-intersection" : this.checkIntersection
			});
		},
		
		/** shows the google.maps overlay on the map. */
		show : function(){
			localground.maps.overlays.Marker.__super__.show.apply(this); 
			this.redraw();
		},
		
		redraw : function(){
			if(this.overlay.getType() == "Point")
				this.overlay.setIcon(this.getIcon());
			else
				this.overlay.redraw();
		},
		
		checkIntersection : function(data){
			var googleOverlay = this.getGoogleOverlay();
			
			//validation checks:
			if(googleOverlay.map == null) { return; }
			
			//right now, it only intersects with point markers:
			var isMarker = googleOverlay instanceof google.maps.Marker;
			if (!isMarker) { return; }
			
			var projection = this.sb.getOverlayView().getProjection();
			var candidatePos = projection.fromLatLngToContainerPixel(googleOverlay.getPosition());
			
			var r = this.MARKER_RADIUS;
			var orig = googleOverlay.icon;
			var withinBuffer = candidatePos.y  <= data.bottom + r &&
							   candidatePos.y >= data.top - 2*r &&
							   candidatePos.x <= data.right + r &&
							   candidatePos.x >= data.left - r;
				
			if(withinBuffer) {
				if (data.commit) {
					this.model.attach(data.model);
					this.clearHighlight();
					data.model.trigger('hide-overlay');
					data.model.trigger('hide-item');
				}
				else {
					this.highlight();	
				}
			}
			else {
				this.clearHighlight();
			}
		},
		
		highlight : function(data) {
			var googleOverlay = this.getGoogleOverlay();
			googleOverlay.setOptions({
				'draggable': false,
				'icon': this.getHighlightIcon()
			});
			this.sb.getBufferCircle().setOptions({
				center: googleOverlay.getPosition(),
				map: this.map,
				//scales radius no matter what the zoom level:
				radius: Math.pow(2, (21 - this.map.getZoom())) * 1128.49 * 0.002
			});	
		},
		
		clearHighlight : function() {
			var googleOverlay = this.getGoogleOverlay();
			googleOverlay.setIcon(this.getIcon());
			googleOverlay.setOptions({ 'draggable': true });
			this.sb.getBufferCircle().setMap(null);	
		}
	});
	
	return localground.maps.overlays.Marker;
});