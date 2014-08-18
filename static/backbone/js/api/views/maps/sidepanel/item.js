define(["backbone"], function(Backbone) {
    /** 
     * Class that controls the right-hand listing of a single
     * Backbone Model.
     * @class Item
     */
	localground.maps.views.Item = Backbone.View.extend({
		/**
		 * @lends localground.maps.views.Item#
		 */
		
		/** A rendered item template */
        template: null,
		
		/** A google.maps.Map object */
        map: null,
		
		/** A Backbone model */
		model: null,
		
		/**
		 * A google.maps.Overlay object (Point, Polyline, Polygon,
		 * or GroundOverlay)
		 */
        googleOverlay: null,
		
		/**
		 * Event listeners: Listens for delete checkbox toggle,
		 * or div click (which triggers a checkbox toggle).
		 */
        events: {
            "click .close": "deleteItem",
            'click .cb-data': 'toggleCheckbox',
			'click .data-item': 'triggerToggleCheckbox',
			'click a': 'zoomTo',
        },
		
		/**
		 * Initializes the object and populates the map and
		 * template properties
		 * @param {Object} opts
		 * Dictionary of initialization options
		 * @param {Backbone.Model} opts.model: item,
		 * Backbone Model
		 * @param {Object} opts.template
		 * Rendered templates
		 * @param {Object} opts.map
		 * google.maps.Map object
		 */
        initialize: function(opts) {
            $.extend(this, opts);
            this.listenTo(this.model, 'destroy', this.remove); 
        },
		
		/**
		 * Triggers the eventManager's global event handler, so that
		 * other objects (like the overlayManager) who are listening
		 * for this event can take measures.
		 * @param {Boolean} isChecked
		 * A flag that tells the method whether to turn the overlay
		 * on or off.
		 */
		toggleElement: function(isChecked){
			if (isChecked)
				this.eventManager.trigger("show_overlay", this.model);
			else
				this.eventManager.trigger("hide_overlay", this.model);	
		},
		
		/**
		 * Helps the checkbox communicate with the toggleElement function.
		 * @param {Event} e
		 */
		toggleCheckbox: function(e){
			this.toggleElement($(e.currentTarget).attr('checked'));
            e.stopPropagation();
		},
		
		/**
		 * Helps the div containing the checkbox to communicate
		 * with the toggleElement function.
		 * @param {Event} e
		 */
		triggerToggleCheckbox: function(e){
			var $cb = $(e.currentTarget).find('input');
			if ($cb.css('visibility') != 'hidden') {
				$cb.attr('checked', !$cb.attr('checked'));
				this.toggleElement($cb.attr('checked'));
			}
            e.stopPropagation();
		},
		
		/**
		 * Helps the checkbox communicate with the toggleElement function.
		 * @param {Event} e
		 */
		zoomTo: function(e){
			if (this.model.get("geometry"))
				this.eventManager.trigger("zoom_to_overlay", this.model);	
            e.stopPropagation();
		},
		
		/**
		 * Renders the HTML from the model
		 */
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
		
		/**
		 * Handles the "delete click." Upon confirmation, the underlying
		 * model is destroyed.
		 * @param {Event} e
		 */
        deleteItem: function (e) {
            var answer = confirm("Are you sure you want to delete the \"" +
                                  (this.model.get("name") || "Untitled") + "\" " +
                                  this.model.get("overlay_type") + " file?");
            if(answer) {
                this.model.destroy();
            }
            e.stopPropagation();
        },
		
		/**
		 * Converts the models's GeoJSON into a
		 * google.maps.LatLng object
		 */
		getGoogleLatLng: function(){
			var geom = this.model.get("geometry");
			return new google.maps.LatLng(
				geom.coordinates[1],
				geom.coordinates[0]
			);
		},
		
		/**
		 * Creates a google.maps.Marker overlay with a photo icon
		 * if one doesn't already exist, and returns it.
		 * @returns {google.maps.Marker}
		 */
		getGoogleOverlay: function(){
			if (this.googleOverlay == null) {
				this.googleOverlay = new google.maps.Marker({
					position: this.getGoogleLatLng()
				});
			}
			return this.googleOverlay;
		},
		
		/**
		 * Adds a marker to the map if isChecked == true,
		 * removes the marker otherwise. This function should
		 * probably be renamed.
		 * @param {Boolean} isChecked
		 * Flag that indicates whether or not the marker shoud
		 *
		 */
		showMarker: function(isChecked){
			//console.log("showMarker photoItem!");
			var geom = this.model.get("geometry");
			//console.log(geom);
            if(isChecked && geom) {
                this.getGoogleOverlay().setMap(this.map);
				//this.map.panTo(this.getGoogleLatLng());
            }
			else {
				if (this.googleOverlay) {
					this.getGoogleOverlay().setMap(null);
				}
			}
        }	
    });
    return localground.maps.views.Item;
});
