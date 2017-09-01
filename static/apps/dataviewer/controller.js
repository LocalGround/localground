define([
    "marionette",
    "apps/gallery/views/data-detail",
    "views/create-media",
    "lib/modals/modal",
], function (Marionette, DataDetail, CreateMedia, Modal) {
    "use strict";
    return Marionette.Controller.extend({
        initialize: function (options) {
            this.app = options.app;
        },
        dataList: function (arg1, arg2) {
            var dataType, screenType;
            if (arg1 && arg2) {
                screenType = arg1
                dataType = arg2
            } else {
                screenType = arg1
            }
            console.log("loading data Type")
            this.app.vent.trigger("show-list", screenType, dataType);
        },
        addNew: function (screenType, dataType) {
            // if datatype is photo, audio, or videos, trigger a new uploader modal
            if (dataType == "photos" || dataType == "audio" || dataType == "videos"){
                this.createMediaUploadModal();
            } else {
                this.dataDetail(screenType, dataType);
            }

        },
        dataDetail: function (screenType, dataType, id) {
            this.app.screenType = screenType;
            this.app.dataType = dataType;
            var dm = this.app.dataManager,
                detailView;
            if (!dm.dataLoaded) {
                // stash the model id, and then display once the
                // data has been loaded:
                this.app.deferredModelID = id;
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

        createMediaUploadModal: function () {
            var uploadMediaForm = new CreateMedia({
                app: this.app
            });
            this.modal.update({
                view: uploadMediaForm,
                title: 'Upload Media',
                //width: 800,
                //height: 350,
                closeButtonText: "Done",
                showSaveButton: false,
                showDeleteButton: false
                // bind the scope of the save function to the source view:
                //saveFunction: createForm.saveFormSettings.bind(createForm)
            });
            this.modal.show();
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
