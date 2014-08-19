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
		
		overlays: null,
		map: null,
		collection: null,
		isVisible: false,
		key: null,
		eventManager: null,
		initialize: function(opts) {
			$.extend(this, opts);
			this.overlays = {};
			this.key = this.collection.key;
			var that = this;
			this.collection.on('add', this.render, this);
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
				that.getOverlay(model).zoomTo();
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
			Overlay = localground.config.Config[configKey].Overlay
			this.overlays[id] = new Overlay({
				model: model,
				map: this.map,
				isVisible: this.isVisible
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
				bounds.extend(this.overlays[key].getCenter());
			this.map.fitBounds(bounds);
		},
		
		/** Gets the overlay from the overlay dictionary */
		getOverlay: function(model) {
			return this.overlays[model.id];
		}
	});
	return localground.maps.views.OverlayGroup;
});
