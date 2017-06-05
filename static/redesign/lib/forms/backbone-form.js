define([
    "backbone",
    "form",
    "form-list",
    "lib/forms/backbone-form-editors"
], function (Backbone) {
    "use strict";
    var DataForm = Backbone.Form.extend({

        initialize: function (options) {
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
