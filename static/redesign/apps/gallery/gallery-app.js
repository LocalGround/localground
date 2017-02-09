define([
    "marionette",
    "backbone",
    "apps/gallery/router",
    "apps/gallery/views/data-list",
    "apps/gallery/views/data-detail",
    "views/toolbar-global",
    "apps/gallery/views/toolbar-dataview",
    "lib/data/dataManager",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, DataList, DataDetail,
             ToolbarGlobal, ToolbarDataView, DataManager,
             appUtilities) {
    "use strict";
    var GalleryApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            galleryRegion: ".main-panel",
            sideRegion: ".side-panel",
            toolbarMainRegion: "#toolbar-main",
            toolbarDataViewRegion: "#toolbar-dataview"
        },
        currentCollection: null,
        mode: "edit",
        dataType: "photos",
        screenType: "gallery",
        activeTab: "media",
        dataManager: null,
        selectedProjectID: null,

        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            this.router = new Router({ app: this});
            Backbone.history.start();
            //this.loadRegions();

            //add event listeners:
            this.listenTo(this.vent, 'data-loaded', this.loadRegions);
            this.listenTo(this.vent, 'show-detail', this.showMediaDetail);
            this.listenTo(this.vent, 'hide-detail', this.hideMediaDetail);
            this.listenTo(this.vent, 'show-list', this.showMediaList);
        },
        initialize: function (options) {
            Marionette.Application.prototype.initialize.apply(this, [options]);
            this.selectedProjectID = this.getProjectID();
            this.dataManager = new DataManager({ app: this});
        },

        loadRegions: function () {
            this.showGlobalToolbar();
            this.showDataToolbar();
            console.log("about to navigate", this.router);
            this.router.navigate('//photos', { trigger: true });
        },

        showGlobalToolbar: function () {
            this.toolbarView = new ToolbarGlobal({
                app: this
            });
            this.toolbarMainRegion.show(this.toolbarView);
        },

        showDataToolbar: function () {
            this.toolbarDataView = new ToolbarDataView({
                app: this
            });
            this.toolbarDataViewRegion.show(this.toolbarDataView);
        },

        showMediaList: function (dataType) {
            var data = this.dataManager.getData(dataType);
            this.dataType = dataType;
            this.currentCollection = data.collection;
            this.mainView = new DataList({
                app: this,
                collection: this.currentCollection,
                fields: data.fields
            });
            this.galleryRegion.show(this.mainView);
            this.hideMediaDetail();
        },

        hideMediaDetail: function () {
            if (this.detailView) {
                this.detailView.doNotDisplay();
            }
        },

        createNewModelFromCurrentCollection: function () {
            //creates an empty model object:
            var Model = this.currentCollection.model,
                model = new Model();
            model.collection = this.currentCollection;
            // If we get the form, pass in the custom field
            if (this.dataType.indexOf("form_") != -1) {
                model.set("fields", this.mainView.fields.toJSON());
            }
            model.set("project_id", this.selectedProjectID);
            return model;
        },

        showMediaDetail: function (opts) {
            var model = null;
            if (opts.id) {
                model = this.currentCollection.get(opts.id);
                if (this.dataType == "markers" || this.dataType.indexOf("form_") != -1) {
                    if (!model.get("children")) {
                        model.fetch({"reset": true});
                    }
                }
            } else {
                model = this.createNewModelFromCurrentCollection();
            }
            this.detailView = new DataDetail({
                model: model,
                app: this
            });
            this.sideRegion.show(this.detailView);
        }
    }));
    return GalleryApp;
});
