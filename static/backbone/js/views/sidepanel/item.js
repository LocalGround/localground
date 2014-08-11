define(["backbone"], function(Backbone) {
    var ItemView = Backbone.View.extend({
        template: null,
        map: null,
        overlay: null,
        events: {
            "click .close": "deleteItem",
            'click .cb-data': 'addMarker',
			'click .data-item': 'triggerToggleElement',
        },
		triggerToggleElement: function(e){
            var $cb = $(e.currentTarget).find('input');
			$cb.trigger("click");
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
        addMarker: function(e){
            var isChecked = $(e.currentTarget).prop('checked');
            var geom = this.model.get("geometry");
            if(isChecked && geom) {
                alert(this.model.get("geometry").coordinates);
            }
            e.stopPropagation();
        }
    });
    return ItemView;
});
