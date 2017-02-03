define([
    "underscore",
    "marionette",
    "backbone",
    "apps/spreadsheet/router",
    "views/toolbar-global",
    "apps/gallery/views/toolbar-dataview",
    "lib/data/dataManager",
    "apps/spreadsheet/views/main",
    "collections/projects",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (_, Marionette, Backbone, Router, ToolbarGlobal, ToolbarDataView,
             DataManager, SpreadsheetView, Projects, appUtilities) {
    "use strict";
    var SpreadsheetApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            spreadsheetRegion: ".main-panel",
            toolbarMainRegion: "#toolbar-main",
            toolbarDataViewRegion: "#toolbar-dataview"
        },

        currentCollection: null,
        dataType: "photos",
        screenType: "spreadsheet",
        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            this.router = new Router({ app: this});
            Backbone.history.start();

            this.listenTo(this.vent, 'data-loaded', this.loadRegions);
            this.listenTo(this.vent, 'show-list', this.showSpreadsheet);
        },

        initialize: function (options) {
            Marionette.Application.prototype.initialize.apply(this, [options]);
            this.selectedProjectID = this.getProjectID();
            this.dataManager = new DataManager({ app: this});
        },
        loadRegions: function () {
            //initialize toobar view
            var data = this.dataManager.getData(this.dataType);
            this.toolbarView = new ToolbarGlobal({
                app: this
            });
            this.toolbarDataView = new ToolbarDataView({
                app: this
            });
            //console.log(data.collection);
            this.spreadsheetView = new SpreadsheetView({
                app: this,
                collection: data.collection,
                fields: data.fields
            });

            //load views into regions:
            this.toolbarMainRegion.show(this.toolbarView);
            this.toolbarDataViewRegion.show(this.toolbarDataView);
            this.spreadsheetRegion.show(this.spreadsheetView);
        },

        showSpreadsheet: function (mediaType) {
            this.dataType = mediaType;
            var data = this.dataManager.getData(this.dataType);
            this.spreadsheetView = new SpreadsheetView({
                app: this,
                collection: data.collection,
                fields: data.fields
            });
            this.spreadsheetRegion.show(this.spreadsheetView);
        }
    }));
    return SpreadsheetApp;
});
