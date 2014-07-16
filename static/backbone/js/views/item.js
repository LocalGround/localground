define(["lib/external/backbone-min"], function(Backbone) {
    var ItemView = Backbone.View.extend({
        initialize: function(opts) {
            this.template = opts.template;    
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    return ItemView;
});
