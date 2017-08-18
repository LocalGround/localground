define([
    "underscore",
    "marionette",
    "backbone",
    "apps/dataviewer/router",
    "views/toolbar-global",
    "apps/gallery/views/toolbar-dataview",
    "lib/data/dataManager",
    "apps/spreadsheet/views/main",
    "apps/spreadsheet/views/tabs",
    "apps/dataviewer/views/datagallery",
    "apps/gallery/views/data-detail",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (_, Marionette, Backbone, Router, ToolbarGlobal, ToolbarDataView,
             DataManager, SpreadsheetView, TabView,
             GalleryView, GalleryDetail, appUtilities) {
    "use strict";
    var DataApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            mainRegion: ".main-panel",
            toolbarMainRegion: "#toolbar-main",
            toolbarDataViewRegion: "#toolbar-dataview",
            tabViewRegion: "#tab-panel"
        },

        currentCollection: null,
        dataType: "markers",
        screenType: "gallery",
        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            this.router = new Router({ app: this});
            Backbone.history.start();

            this.listenTo(this.vent, 'data-loaded', this.loadRegions);
            this.listenTo(this.vent, 'show-list', this.showGallery);
            this.listenTo(this.vent, 'show-gallery', this.showGallery);
            this.listenTo(this.vent, 'show-table', this.showSpreadsheet);
            this.addMessageListeners();
            console.log('starting!!');
        },

        initialize: function (options) {
            Marionette.Application.prototype.initialize.apply(this, [options]);
            this.selectedProjectID = this.getProjectID();
            this.dataManager = new DataManager({ vent: this.vent, projectID: this.getProjectID() });
            console.log("initialize");
        },
        loadRegions: function () {
            //initialize toobar view
            console.log("Loading Regions");
            this.restoreAppState();
            var data;
            try {
                data = this.dataManager.getData(this.dataType);
            } catch (e) {
                this.dataType = "markers";
                data = this.dataManager.getData(this.dataType);
            }
            this.toolbarView = new ToolbarGlobal({
                app: this
            });
            this.toolbarDataView = new ToolbarDataView({
                app: this
            });
            this.spreadsheetView = new SpreadsheetView({
                app: this,
                collection: data.collection,
                fields: data.fields
            });

            this.galleryView = new GalleryView({
                app: this,
                collection: data.collection,
                fields: data.fields
            });
            this.tabView = new TabView({
                app: this
            });

            //load views into regions:
            this.toolbarMainRegion.show(this.toolbarView);
            this.toolbarDataViewRegion.show(this.toolbarDataView);
            this.mainRegion.show(this.galleryView);
            this.tabViewRegion.show(this.tabView);
        },

        showSpreadsheet: function (dataType) {
            this.dataType = dataType;
            this.screenType = "spreadsheet";
            this.toolbarDataView.render();
            this.mainRegion.$el.addClass("spreadsheet-main-panel");
            this.saveAppState();
            var data;
            try {
                data = this.dataManager.getData(this.dataType);
            } catch (e) {
                this.dataType = "markers";
                data = this.dataManager.getData(this.dataType);
            }
            this.spreadsheetView = new SpreadsheetView({
                app: this,
                collection: data.collection,
                fields: data.fields
            });
            this.mainRegion.show(this.spreadsheetView);

        },
        showGallery: function (dataType) {
            this.dataType = dataType;
            this.screenType = "gallery";
            this.toolbarDataView.render();
            this.mainRegion.$el.removeClass("spreadsheet-main-panel")
            this.saveAppState();

            var data;
            try {
                data = this.dataManager.getData(this.dataType);
            } catch (e) {
                this.dataType = "markers";
                data = this.dataManager.getData(this.dataType);
            }
            this.galleryView = new GalleryView({
                app: this,
                collection: data.collection,
                fields: data.fields
            });
            this.mainRegion.show(this.galleryView);
        },
        saveAppState: function () {
            this.saveState("dataView", {
                dataType: this.dataType
            }, true);
        },
        restoreAppState: function () {
            var state = this.restoreState("dataView");
            if (state) {
                this.dataType = state.dataType;
            } else if (this.dataManager) {
                this.dataType = this.dataManager.getDataSources()[1].value;
            }
            //console.log('restored', this.dataType);
        }
    }));
    return DataApp;
});
