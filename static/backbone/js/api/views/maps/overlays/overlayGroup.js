define(
	[
		'backbone',
		'config'
	], function() {
	/**
	 * The top-level view class that harnesses all of the map editor
	 * functionality. Also coordinates event triggers across all of
	 * the constituent views.
	 * @class OverlayGroup
	 */
	localground.maps.views.OverlayGroup = Backbone.View.extend({
		/**
		 * @lends localground.maps.views.OverlayGroup#
		 */
		
		/** A google.maps.Map object */
		map: null,
		
		/** A dictionary indexing the various
		 * {@link localground.maps.overlays.Overlay} objects.
		 */
		overlays: {},
		
		visibleItems: null, 
		
		/** A Backbone.Collection object */
		collection: null,
		/**
		 * Flag indicating whether or not the child elements should
		 * be visible
		 */
		isVisible: false,
		/** String that matches the collection's key */
		key: null,
		
		/**
		 * Initializes the OverlayGroup with a dictionary of options,
		 * and adds event listeners that pertain to OverlayGroup
		 * operations (batch operations like turn on everything, or
		 * zoom to extents).
		 */
		initialize: function(sb, opts) {
			this.sb = sb;
			this.map = sb.getMap();
			$.extend(this, opts);
			this.overlays = {};
			this.visibleItems = {}
			this.key = this.collection.key;
			var that = this;

			//listen for new data:
			this.collection.on('add', this.render, this);
			
			//listen for map zoom change, re-render photo icons:
			google.maps.event.addListener(this.map, 'zoom_changed', function() {
				if(that.key != 'photos') { return; }
				for(key in that.overlays){
					var overlay = that.overlays[key];
					overlay.getGoogleOverlay().setIcon(overlay.getIcon());
				}	
			});
			
			this.sb.listen({
				"show-overlay": this.showOverlay,
				"hide-overlay": this.hideOverlay,
				"zoom-to-overlay": this.zoomToOverlay,
			});
		},
		
		showOverlay: function(data) {
			if(!this.belongs(data.model)) { return; }
			var overlay = this.getOverlay(data.model);
			overlay.show();
			overlay.centerOn();
		},
		hideOverlay: function(data) {
			if(!this.belongs(data.model)) { return; }
			this.getOverlay(data.model).hide();
		},
		zoomToOverlay: function(data) {
			if(!this.belongs(data.model)) { return; }
			var overlay = this.getOverlay(data.model);
			overlay.zoomTo();
			this.sb.notify({
				type: "show-bubble",
				data: {
					model: data.model,
					center: overlay.getCenter()
				}
			});
		},
		
		/**
		 * Ensures that the model belongs to this particular overlayGroup.
		 * For example, if the key == "markers", ensure that the model
		 * belongs to the markers collection.
		 */
		belongs: function(model){
			return model.getKey() == this.key;
		},
		
		/**
		 * A little tricky. Basically, this method is called every time
		 * a new model is added to its corresponding collection in the
		 * dataManager. The method creates a new overlay for each model
		 * where the GeoJSON geometry is defined.
		 * @param {Backbone.Model} model
		 */
		render: function(model) {
			if (model.get("geometry") == null) { return; }
			var key = model.collection.key;
			var id = model.id;
			//retrieve the corresponding overlay type from the config.js.
			var configKey = key.split("_")[0];
			this.overlays[id] = this.sb.loadSubmodule(
				"overlay-" + model.getKey() + "-" + model.id,
				localground.config.Config[configKey].Overlay,
				{ model: model }
			);
		},
		
		/** Shows all of the map overlays */
		showAll: function() {
			this.isVisible = true;
			for (key in this.overlays)
				this.overlays[key].show();
		},
		
		/** Hides all of the map overlays */
		hideAll: function() {
			this.isVisible = false;
			for (key in this.overlays)
				this.overlays[key].hide();
		},
		
		/** Zooms to the extent of the collection */
		zoomToExtent: function() {
			var bounds = new google.maps.LatLngBounds();
			for (key in this.overlays)
				try {
					//for polylines, polygons, and groundoverlays:
					bounds.union(this.overlays[key].getBounds());
				}
				catch(e){
					//for points:
					bounds.extend(this.overlays[key].getCenter());	
				}
			this.map.fitBounds(bounds);
		},
		
		/** Gets the overlay from the overlay dictionary */
		getOverlay: function(model) {
			return this.overlays[model.id];
		},
		destroy: function(){
			alert("bye");	
		}
	});
	return localground.maps.views.OverlayGroup;
});
