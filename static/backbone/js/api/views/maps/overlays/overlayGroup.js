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
		/** A Backbone.Events object */
		eventManager: null,
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
		initialize: function(opts) {
			$.extend(this, opts);
			this.overlays = {};
			this.visibleItems = {}
			this.key = this.collection.key;
			var that = this;
			
			this.restoreState();
			/*
			 *this.collection.each(function(model){
				that.render(model);
			});
			*/
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
			
			this.eventManager.on(localground.events.EventTypes.SHOW_OVERLAY, function(model){
				if(!that.belongs(model)) { return; }
				var overlay = that.getOverlay(model);
				overlay.show();
				overlay.centerOn();
			});
			
			this.eventManager.on(localground.events.EventTypes.HIDE_OVERLAY, function(model){
				if(!that.belongs(model)) { return; }
				that.getOverlay(model).hide();
			});
			
			this.eventManager.on(localground.events.EventTypes.ZOOM_TO_OVERLAY, function(model){
				if(!that.belongs(model)) { return; }
				var overlay = that.getOverlay(model);
				overlay.zoomTo();
				that.eventManager.trigger("show_bubble", model, overlay.getCenter());
			});
		},
		
		/**
		 * Ensures that the model belongs to this particular overlayGroup.
		 * For example, if the key == "markers", ensure that the model
		 * belongs to the markers collection.
		 */
		belongs: function(model){
			return model.collection.key == this.key;
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
			Overlay = localground.config.Config[configKey].Overlay;
			var isVisible = this.isVisible || (this.visibleItems[id] || false);
			this.overlays[id] = new Overlay({
				model: model,
				map: this.map,
				eventManager: this.eventManager,
				isVisible: isVisible
			});
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
		restoreState: function(){
			var workspace = JSON.parse(localStorage["workspace"]);
			if (workspace == null) { return; }
			var state = workspace.elements[this.collection.key];
			if (state == null) { return; }
			var that = this;
			$.each(state.visibleItems, function(){
				that.visibleItems[this] = true;	
			});
		}
	});
	return localground.maps.views.OverlayGroup;
});
