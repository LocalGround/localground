define([
    "marionette",
    "apps/gallery/views/data-detail",
], function (Marionette, DataDetail) {
    "use strict";
    return Marionette.Controller.extend({
        initialize: function (options) {
            this.app = options.app;
        },
        dataList: function (dataType) {
            this.app.vent.trigger("show-list", dataType);
        },
        addNew: function (arg1, arg2) {
            var dataType;
            if (arg1 && arg2) {
                dataType = arg2
            } else {
                dataType = arg1
            }
            this.dataDetail(dataType);
        },
        dataDetail: function (dataType, id) {
            this.app.dataType = dataType;
            var dm = this.app.dataManager,
                detailView;
            if (!dm.dataLoaded) {
                return;
            }

            //1. for gallery and map:
            detailView = new DataDetail({
                    model: this.app.dataManager.getModel(dataType, id),
                    app: this.app
                });
            this.app.vent.trigger("show-detail", detailView, false);

            //2. for spreadsheet:
            this.app.vent.trigger("add-row", {
                dataType: dataType
            }, false);
        },
        showGallery: function () {
            this.app.vent.trigger("show-list", "gallery");
        },
        showTable: function () {
            this.app.vent.trigger("show-list", "spreadsheet");
        },
        showMap: function () {
            this.app.vent.trigger("show-list", "map");
        }
    });
});
