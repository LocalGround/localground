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
		
        template: null,
        map: null,
        overlay: null,
        events: {
            "click .close": "deleteItem",
            'click .cb-data': 'toggleElement',
			'click .data-item': 'triggerToggleElement',
        },
		toggleElement: function(e){
			this.addMarker($(e.currentTarget).attr('checked'));
            e.stopPropagation();
		},
		triggerToggleElement: function(e){
			var $cb = $(e.currentTarget).find('input');
			$cb.attr('checked', !$cb.attr('checked'));
			this.addMarker($cb.attr('checked'));
            e.stopPropagation();
		},
        initialize: function(opts) {
            $.extend(this, opts);
            this.listenTo(this.model, 'destroy', this.remove); 
        },
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
        deleteItem: function (e) {
            var answer = confirm("Are you sure you want to delete the \"" +
                                  (this.model.get("name") || "Untitled") + "\" " +
                                  this.model.get("overlay_type") + " file?");
            if(answer) {
                this.model.destroy();
            }
            e.stopPropagation();
        },
		getGoogleLatLng: function(){
			var geom = this.model.get("geometry");
			return new google.maps.LatLng(
				geom.coordinates[1],
				geom.coordinates[0]
			);
		},
        addMarker: function(isChecked){
			var geom = this.model.get("geometry");
            if(isChecked && geom) {
                alert(this.model.get("geometry").coordinates);
            }
            e.stopPropagation();
        }
    });
    return localground.maps.views.Item;
});
