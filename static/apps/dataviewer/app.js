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
    "apps/dataviewer/gallery/views/gallery-layout-view",
    "apps/dataviewer/map/views/map-layout-view",
    "apps/gallery/views/data-detail",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (_, Marionette, Backbone, Router, ToolbarGlobal, ToolbarDataView,
             DataManager, SpreadsheetView, TabView,
             GalleryView, MapView, GalleryDetail, appUtilities) {
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
        mode: "edit",
        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            this.router = new Router({ app: this});
            Backbone.history.start();
            this.loadFastRegions();
            this.listenTo(this.vent, 'data-loaded', this.loadMainRegion);
            this.listenTo(this.vent, 'show-list', this.initMainView);
            this.listenTo(this.vent, 'show-gallery', this.showGallery);
            this.listenTo(this.vent, 'show-table', this.showSpreadsheet);
            this.listenTo(this.vent, 'show-map', this.showMap);
            this.addMessageListeners();
            console.log('starting!!');
        },

        initialize: function (options) {
            Marionette.Application.prototype.initialize.apply(this, [options]);
            this.selectedProjectID = this.getProjectID();
            this.dataManager = new DataManager({ vent: this.vent, projectID: this.getProjectID() });
        },
        loadFastRegions: function () {
            this.toolbarView = new ToolbarGlobal({
                app: this
            });
            this.toolbarDataView = new ToolbarDataView({
                app: this
            });
            this.tabView = new TabView({
                app: this
            });
            this.toolbarMainRegion.show(this.toolbarView);
            this.toolbarDataViewRegion.show(this.toolbarDataView);
            this.tabViewRegion.show(this.tabView);
        },
        loadMainRegion: function () {
            this.initMainView();
        },

        showSpreadsheet: function (dataType) {
            this.initMainView(dataType, "spreadsheet");
        },

        showMap: function (dataType) {
            this.initMainView(dataType, "map");
        },

        showGallery: function (dataType) {
            this.initMainView(dataType, "gallery");
        },

        initMainView: function (dataType, mode) {
            this.dataType = dataType || this.dataType;
            this.screenType = mode || this.screenType;
            this.toolbarDataView.render();
            this.saveAppState();
            var data = this.getData(),
                opts = {
                    app: this,
                    collection: data.collection,
                    fields: data.fields
                };
            switch (this.screenType) {
                case 'spreadsheet':
                    this.mainView = new SpreadsheetView(opts);
                    break;
                case 'gallery':
                    this.mainView = new GalleryView(opts);
                    break;
                case 'map':
                    this.mainView = new MapView({app: this});
                    break;
            }
            this.mainRegion.show(this.mainView);
            this.adjustLayout();
        },

        adjustLayout: function () {
            this.mainRegion.$el.removeClass('spreadsheet gallery map');
            switch (this.screenType) {
                case 'spreadsheet':
                    this.tabViewRegion.$el.show();
                    this.mainRegion.$el.addClass('spreadsheet');
                    break;
                case 'gallery':
                    this.tabViewRegion.$el.show();
                    this.mainRegion.$el.addClass('gallery');
                    break;
                case 'map':
                    this.tabViewRegion.$el.hide();
                    this.mainRegion.$el.addClass('map');
                    break;
            }
        },

        getData: function () {
            try {
                return this.dataManager.getData(this.dataType);
            } catch (e) {
                this.dataType = "markers";
                return this.dataManager.getData(this.dataType);
            }
            console.error("Data type error:", this.dataType);
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
        }
    }));
    return DataApp;
});
