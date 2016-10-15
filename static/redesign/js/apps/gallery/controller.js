define([
    "marionette"
], function (Marionette) {
    "use strict";
    return Marionette.Controller.extend({
        initialize: function (options) {
            this.app = options.app;
        },
        mediaDetail: function (mediaType, id) {
            this.app.vent.trigger("show-detail", id, false);
        }
    });
});