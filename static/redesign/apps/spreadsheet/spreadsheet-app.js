define([
    "underscore",
    "marionette",
    "backbone",
    "apps/spreadsheet/router",
    "views/toolbar-global",
    "apps/gallery/views/toolbar-dataview",
    "apps/spreadsheet/views/main",
    "collections/projects",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (_, Marionette, Backbone, Router, ToolbarGlobal, ToolbarDataView,
             SpreadsheetView, Projects, appUtilities) {
    "use strict";
    var GalleryApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            spreadsheetRegion: ".main-panel",
            toolbarMainRegion: "#toolbar-main",
            toolbarDataViewRegion: "#toolbar-dataview"
        },

        currentCollection: null,
        dataType: "photos",
        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            this.router = new Router({ app: this});
            Backbone.history.start();
        },

        initialize: function (options) {
            Marionette.Application.prototype.initialize.apply(this, [options]);
            this.selectProjectLoadRegions();

            this.listenTo(this.vent, 'show-list', this.showSpreadsheet);
        },
        selectProjectLoadRegions: function () {
            var that = this;
            this.projects = new Projects();
            this.projects.fetch({
                success: function () {
                    that.selectProject(); //located in appUtilities
                    that.loadRegions();
                }
            });
        },

        loadRegions: function () {
            //initialize toobar view
            this.toolbarView = new ToolbarGlobal({
                app: this
            });
            this.toolbarDataView = new ToolbarDataView({
                app: this
            });
            this.spreadsheetView = new SpreadsheetView({
                app: this
            });

            //load views into regions:
            this.toolbarMainRegion.show(this.toolbarView);
            this.toolbarDataViewRegion.show(this.toolbarDataView);
            this.spreadsheetRegion.show(this.spreadsheetView);
        },

        showSpreadsheet: function (mediaType) {
            this.dataType = mediaType;
            this.spreadsheetView = new SpreadsheetView({
                app: this
            });
            this.spreadsheetRegion.show(this.spreadsheetView);
        }
    }));
    return GalleryApp;
});
