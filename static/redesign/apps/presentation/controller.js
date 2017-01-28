define([
    "marionette"
], function (Marionette) {
    "use strict";
    return Marionette.Controller.extend({
        initialize: function (options) {
            this.app = options.app;
        },
        dataDetail: function (mediaType, id) {
            this.app.vent.trigger("show-detail", {
                id: id,
                mediaType: mediaType
            }, false);
        },
        dataList: function (mediaType) {
            this.app.vent.trigger("show-list", mediaType);
        }
    });
});