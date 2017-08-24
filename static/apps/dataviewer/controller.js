define([
    "marionette",
    "apps/gallery/views/data-detail",
], function (Marionette, DataDetail) {
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
            console.log('dataList:', dataType);
            this.app.vent.trigger("show-list", dataType);
        },
        dataDetail: function (dataType, id) {
            console.log('dataDetail:', dataType, id);
            this.app.dataType = dataType;
            var collection = this.app.getData().collection,
                model = collection.get(id),
                detailView = new DataDetail({
                    model: model,
                    app: this.app
                });
            this.app.vent.trigger("show-detail", detailView, false);
        },
        showGallery: function () {
            this.app.vent.trigger("show-gallery");
        },
        showTable: function () {
            this.app.vent.trigger("show-table");
        },
        showMap: function () {
            this.app.vent.trigger("show-map");
        }
    });
});
