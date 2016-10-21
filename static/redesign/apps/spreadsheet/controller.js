define([
    "marionette"
], function (Marionette) {
    "use strict";
    return Marionette.Controller.extend({
        initialize: function (options) {
            this.app = options.app;
        },
        mediaList: function (mediaType) {
            this.app.vent.trigger("show-list", mediaType);
        }
    });
});