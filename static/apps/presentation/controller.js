define([
    "marionette"
], function (Marionette) {
    "use strict";
    return Marionette.Controller.extend({
        initialize: function (options) {
            this.app = options.app;
        },
        dataDetail: function (screenType, dataType, id) {
            this.app.vent.trigger("show-detail", {
                id: id,
                dataType: dataType
            }, false);
        },
        dataList: function (dataType) {
            this.app.vent.trigger("show-list", dataType);
        },
        fetchMap: function (slug) {
            //alert(slug);
            this.app.vent.trigger("fetch-map", slug);
        }
    });
});
