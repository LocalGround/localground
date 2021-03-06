define([
    "marionette",
    "views/data-detail",
    "views/create-media",
    "views/create-video",
    "lib/modals/modal",
], function (Marionette, DataDetail, CreateMedia, CreateVideo, Modal) {
    "use strict";
    return Marionette.Controller.extend({
        initialize: function (options) {
            this.app = options.app;
            this.modal = new Modal();
            this.listenTo(this.app.vent,
                "show-create-new", this.addNew);
        },
        dataList: function (arg1, arg2) {
            var dataType, screenType;
            if (arg1 && arg2) {
                screenType = arg1
                dataType = arg2
            } else {
                screenType = arg1
            }
            this.app.vent.trigger("show-list", screenType, dataType);
        },
        addNew: function (screenType, dataType) {
            // if datatype is photo, audio, or videos, trigger a new uploader modal
            if (dataType == "photos" || dataType == "audio") {
                this.createMediaUploadModal();
            }
            else if (dataType == "videos") {
                this.createVideoLinkModal();
            }
            else if (dataType == "map_images") {
                this.createMapImageUploadModal();
            } else {
                this.dataDetail(screenType, dataType);
            }
        },
        dataDetail: function (screenType, dataType, id) {
            console.log('ROUTING: dataDetail');
            this.app.screenType = screenType;
            this.app.dataType = dataType;
            var dm = this.app.dataManager,
                detailView;

            //1. for gallery and map:
            var model = dm.getModel(dataType, parseInt(id));
            if (dataType.indexOf("dataset_") != -1) {
                if (!model.get("children")) {
                    model.fetch({"reset": true});
                }
            }

            detailView = new DataDetail({
                model: model,
                app: this.app
            });

            this.app.vent.trigger("show-detail", detailView, false);

            //2. for spreadsheet:
            this.app.vent.trigger("add-row", {
                dataType: dataType
            }, false);
        },

        createMediaUploadModal: function (title, dataType) {
            var modalTitle = title != null ? title : "Upload Media";
            var setDatType = dataType != null ? dataType : "default";
            var uploadMediaForm = new CreateMedia({
                app: this.app
            });
            this.modal.update({
                view: uploadMediaForm,
                title: 'Upload Media',
                closeButtonText: "Done",
                showSaveButton: false,
                showDeleteButton: false
            });
            this.modal.show();
        },

        createVideoLinkModal: function (title, dataType) {
            var modalTitle = title != null ? title : "Get Video Link";
            var setDatType = dataType != null ? dataType : "default";
            var uploadVideoForm = new CreateVideo({
                app: this.app,
                modal: this.modal
            });
            uploadVideoForm.modal.update({
                view: uploadVideoForm,
                title: 'Get Video',
                closeButtonText: "Cancel",
                showDeleteButton: false,
                showSaveButton: true,
                saveFunction: uploadVideoForm.saveModel.bind(uploadVideoForm)
            });
            uploadVideoForm.modal.show();
        },

        createMapImageUploadModal: function () {
            var uploadMediaForm = new CreateMedia({
                app: this.app,
                dataType: 'map_images'
            });
            this.modal.update({
                view: uploadMediaForm,
                title: 'Upload Map Images',
                closeButtonText: "Done",
                showSaveButton: false,
                showDeleteButton: false
            });
            this.modal.show();
        },

        showGallery: function () {
            this.app.vent.trigger("show-list", "gallery");
        },
        showTable: function () {
            this.app.vent.trigger("show-list", "table");
        },
        showMap: function () {
            this.app.vent.trigger("show-list", "map");
        }
    });
});
