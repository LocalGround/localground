define(["lib/external/backbone-min"], function(Backbone) {
    var ItemView = Backbone.View.extend({
        events: {
            "click .close": "deleteItem",
            'change input[type="checkbox"]': 'addMarker'
        },
        initialize: function(opts) {
            this.template = opts.template;
            this.listenTo(this.model, 'destroy', this.remove); 
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        deleteItem: function () {
            var answer = confirm("Are you sure you want to delete the \"" +
                                  (this.model.get("name") || "Untitled") + "\" " +
                                  this.model.get("overlay_type") + " file?");
            if(answer) {
                this.model.destroy();
            }
        },
        addMarker: function(){
            var isChecked = this.$el.find('input').prop('checked');
            var geom = this.model.get("geometry");
            if(isChecked && geom) {
                alert(this.model.get("geometry").coordinates);
            }
        }
    });
    return ItemView;
});
