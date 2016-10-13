define([
    "underscore",
    "handlebars",
    "marionette",
    "text!../../templates/media-editor.html"
], function (_, Handlebars, Marionette, MediaEditorTemplate) {
    "use strict";
    var MediaEditor = Marionette.ItemView.extend({
        events: {
            'click .view-mode': 'switchToViewMode'
        },
        template: Handlebars.compile(MediaEditorTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            Marionette.ItemView.prototype.initialize.call(this);
            this.template = Handlebars.compile(MediaEditorTemplate);
        },
        switchToViewMode: function () {
            this.app.vent.trigger("show-detail", this.model.get("id"));
        }
    });
    return MediaEditor;
});