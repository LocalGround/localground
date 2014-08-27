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
		
		/** A Backbone model */
		model: null,
		
		/** Whether or not the item should be visible when it's rendered */
		isVisible: false,
		
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
			'mouseover .data-item': 'showTip',
			'mouseout .data-item': 'hideTip'
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
		 */
        initialize: function(sb, opts) {
            $.extend(this, opts);
			this.setElement(opts.el)
			this.sb = sb;
			this.render();
            this.listenTo(this.model, 'destroy', this.remove); 
        },
		
		detectIfVisible: function(){
			return this.$el.find('input').attr('checked');
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
			if (isChecked) {
				this.eventManager.trigger("show_overlay", this.model);
			}
			else {
				this.eventManager.trigger("hide_overlay", this.model);	
			}
		},
		
		/**
		 * Helps the checkbox communicate with the toggleElement function.
		 * @param {Event} e
		 */
		toggleCheckbox: function(e){
			alert("toggle");
			this.toggleElement($(e.currentTarget).attr('checked'));
            e.stopPropagation();
		},
		
		/**
		 * Helps the div containing the checkbox to communicate
		 * with the toggleElement function.
		 * @param {Event} e
		 */
		triggerToggleCheckbox: function(e){
			var $cb = this.$el.find('input');
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
        render: function(opts) {
			//todo: restore state here:
			opts = opts || { isVisible: true};
			$.extend(opts, this.model.toJSON());
			//for the marker model:
			if (this.model.getDescriptiveText) {
				opts.descriptiveText = this.model.getDescriptiveText();
			}
            this.$el.html(this.template(opts));
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

		/** Show a tooltip on the map if the geometry exists */
		showTip: function() {
			if (this.model.get("geometry") && this.detectIfVisible())
				this.eventManager.trigger("show_tip", this.model);	
		},
		
		/** Hide the map tooltip */
		hideTip: function() {
			this.eventManager.trigger("hide_tip");	
		},
		
		destroy: function(){
			alert("todo: implement");
		}
    });
    return localground.maps.views.Item;
});
