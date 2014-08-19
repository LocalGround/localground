define(
	[
		'backbone',
		'lib/maps/overlays/photo',
		'lib/maps/overlays/marker',
		'lib/maps/overlays/audio'
	], function() {
	/**
	 * The top-level view class that harnesses all of the map editor
	 * functionality. Also coordinates event triggers across all of
	 * the constituent views.
	 * @class MapEditor
	 */
	localground.maps.views.OverlayGroup = Backbone.View.extend({
		/**
		 * @lends localground.maps.views.OverlayGroupr#
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
				//check belonging, then proceed:
				if(model.collection.key != that.key) { return; }
				var overlay = that.getOverlay(model);
				overlay.show();
				overlay.centerOn();
			});
			this.eventManager.on(localground.events.EventTypes.HIDE_OVERLAY, function(model){
				//check belonging, then proceed:
				if(model.collection.key != that.key) { return; }
				that.getOverlay(model).hide();
			});
			this.eventManager.on(localground.events.EventTypes.ZOOM_TO_OVERLAY, function(model){
				//check belonging, then proceed:
				if(model.collection.key != that.key) { return; }
				that.getOverlay(model).zoomTo();
			});
		},
		
		/**
		 * A little tricky. Basically, this method is called every time
		 * a new model is added to its corresponding collection in the
		 * dataManager. The method creates a new overlay for each model
		 * where the GeoJSON geometry is defined.
		 * @param {Backbone.Model} model
		 */
		render: function(model) {
			console.log('firing ' + model.collection.key + ": " + model.get("id"));
			var key = model.collection.key;
			var id = model.id;
			//check belonging, then proceed:
			//console.log(key + ": " + Object.keys(this.overlays));
			if(key != this.key) {
				
				return;
			}
			if (model.get("geometry") == null) { return; }
			
			var opts = {
				model: model,
				map: this.map,
				isVisible: this.isVisible
			};
			if(key == "photos") {
				this.overlays[id] = new localground.maps.overlays.Photo(opts);
			}
			else if (key == "markers") {
				this.overlays[id] = new localground.maps.overlays.Marker(opts);
			}
			else if (key == "audio") {
				this.overlays[id] = new localground.maps.overlays.Audio(opts);
				//console.log(this.overlays);
			}
			else {
				this.overlays[id] = new localground.maps.overlays.Marker(opts);
			}
			//console.log(this.overlays);
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
