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
            alert('add row');
            this.app.vent.trigger("add-row", {
                dataType: dataType
            }, false);
        },
        dataList: function (dataType) {
            console.log('dataList:', dataType);
            this.app.vent.trigger("show-list", dataType);
        },
        addNew: function (screenType, dataType, id) {
            this.dataDetail(dataType);
        },
        dataDetail: function (dataType, id) {
            this.app.dataType = dataType;
            //for gallery and map:
            var detailView = new DataDetail({
                model: this.app.dataManager.getModel(dataType, id) ,
                app: this.app
            });
            this.app.vent.trigger("show-detail", detailView, false);

            //for spreadsheet:
            this.app.vent.trigger("add-row", {
                dataType: dataType
            }, false);
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
