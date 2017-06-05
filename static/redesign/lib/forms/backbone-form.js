define([
    "backbone",
    "underscore",
    "form",
    "form-list",
    "lib/forms/backbone-form-editors"
], function (Backbone, _) {
    "use strict";
    var DataForm = Backbone.Form.extend({
        initialize: function (options) {
            _.extend(this, options);
            Backbone.Form.prototype.initialize.call(this, options);
        },
        render: function () {
            Backbone.Form.prototype.render.call(this);
            //this.sortMediaTable();
            console.log('hello');
            //console.log(this.$el.html());
            return this;
        }
    });
    return DataForm;
});
