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
			'mouseout .data-item': 'hideTip',
			'click .project-item': 'triggerToggleProjectData',
			'click .cb-project': 'toggleProjectData'
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
		 * @param {Object} opts.element
		 * jQuery selector element
		 */
        initialize: function(sb, opts) {
            $.extend(this, opts);
			this.setElement(opts.el)
			this.sb = sb;
			this.render();
            this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'removeView', this.remove);
        },

		/**
		 * Notifies other objects (like the overlayManager)
		 * who are listening for this event can take measures.
		 * @param {Boolean} isChecked
		 * A flag that tells the method whether to turn the overlay
		 * on or off.
		 */
		toggleElement: function(isChecked){
			if (isChecked) {
				this.sb.notify({ 
					type : "show-overlay", 
					data : { model: this.model } 
				}); 
			}
			else {
				this.sb.notify({ 
					type : "hide-overlay", 
					data : { model: this.model } 
				}); 
			}
			this.saveState();
		},
		
		/**
		 * Helps the checkbox communicate with the toggleElement function.
		 * @param {Event} e
		 */
		toggleCheckbox: function(e){
			var $cb = this.$el.find('input');
			this.toggleElement($cb.attr('checked'));
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
		 * Triggers the checkbox event from a DIV click event
		 * @param {Event} e
		 */
		triggerToggleProjectData: function(e){
			var $cb = this.$el.find('input');
			$cb.attr('checked', !$cb.attr('checked'));
			this.toggleProjectData(e);
            e.stopPropagation();
			
		},
		/**
		 * Control that adds / removes project data within the
		 * data manager
		 * @param {Event} e
		 */
		toggleProjectData: function(e) {
			var $cb = this.$el.find('input');
			if ($cb.prop("checked")) {
				this.sb.notify({
					type : "project-requested",
					data: { id: $cb.val() }
				});
			}
			else {
				this.sb.notify({
					type : "project-removal-requested",
					data: { id: $cb.val() }
				});
			}
			this.saveState();
			e.stopPropagation();
		},
		
		isVisible: function(){
			return this.$el.find('input').attr('checked') == "checked";
		},
		/**
		 * Helps the checkbox communicate with the toggleElement function.
		 * @param {Event} e
		 */
		zoomTo: function(e){
			if (this.model.get("geometry")) {
				this.sb.notify({ 
					type : "zoom-to-overlay", 
					data : { model: this.model } 
				}); 
			}
            e.stopPropagation();
		},
		
		/**
		 * Renders the HTML from the model
		 */
        render: function() {
			//todo: restore state here:
			opts = this.restoreState();
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
			if (this.model.get("geometry") && this.isVisible()) {
				this.sb.notify({ 
					type : "show-tip", 
					data : { model: this.model } 
				}); 	
			}
		},
		
		/** Hide the map tooltip */
		hideTip: function() {
			this.sb.notify({ 
				type : "hide-tip", 
				data : { model: this.model } 
			});
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
		
		destroy: function(){
			this.remove();
		}
    });
    return localground.maps.views.Item;
});
