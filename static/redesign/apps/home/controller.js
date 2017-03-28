define([
    "marionette"
], function (Marionette) {
    "use strict";
    return Marionette.Controller.extend({
        initialize: function (options) {
            this.app = options.app;
        },
        mediaDetail: function (dataType, id) {
            this.app.vent.trigger("show-detail", {
                id: id,
                dataType: dataType
            }, false);
        },
        mediaList: function (dataType) {
            this.app.vent.trigger("show-list", dataType);
        }
    });
});