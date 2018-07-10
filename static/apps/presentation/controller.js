define([
    "marionette"
], function (Marionette) {
    "use strict";
    return Marionette.Controller.extend({
        initialize: function (options) {
            this.app = options.app;
        },
        dataDetail: function (layerId, dataType, recordId) {
            this.app.vent.trigger("show-detail", {
                layerId: layerId,
                id: recordId,
                dataType: dataType
            }, false);
        },
        dataList: function (dataType) {
            this.app.vent.trigger("show-list", dataType);
        },
        fetchMap: function (slug) {
            this.app.vent.trigger("fetch-map", slug);
        }
    });
});
