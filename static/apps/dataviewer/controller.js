define([
    "marionette"
], function (Marionette) {
    "use strict";
    return Marionette.Controller.extend({
        initialize: function (options) {
            this.app = options.app;
        },
        addRow: function (dataType) {
            this.app.vent.trigger("add-row", {
                dataType: dataType
            }, false);
        },
        dataList: function (dataType) {
            this.app.vent.trigger("show-list", dataType);
        },
        showGallery: function () {
            this.app.vent.trigger("show-gallery");
        },
        showTable: function () {
            this.app.vent.trigger("show-table");
        }
    });
});
