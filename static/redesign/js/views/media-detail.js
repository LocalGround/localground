define([
    "underscore",
    "handlebars",
    "marionette",
    "text!../../templates/media-detail.html"
], function (_, Handlebars, Marionette, StoreTemplate) {
    "use strict";
    var MediaDetail = Marionette.ItemView.extend({
        events: {
            'click .edit-mode': 'switchToEditMode'
        },
        template: Handlebars.compile(StoreTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            Marionette.ItemView.prototype.initialize.call(this);
            this.template = Handlebars.compile(StoreTemplate);
        },
        switchToEditMode: function () {
            this.app.vent.trigger("show-editor", this.model.get("id"));
        }
    });
    return MediaDetail;
});