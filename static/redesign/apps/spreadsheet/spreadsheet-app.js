define([
    "marionette",
    "backbone",
    "apps/spreadsheet/router",
    "views/toolbar-global",
    "apps/gallery/views/toolbar-dataview",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, ToolbarGlobal, ToolbarDataView) {
    "use strict";
    var GalleryApp = Marionette.Application.extend({
        regions: {
            spreadsheetRegion: ".main-panel",
            toolbarMainRegion: "#toolbar-main",
            toolbarDataViewRegion: "#toolbar-dataview"
        },

        currentCollection: null,

        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.router = new Router({ app: this});
            Backbone.history.start();
        },

        initialize: function (options) {
            Marionette.Application.prototype.initialize.apply(this, [options]);

            //initialize toobar view
            this.toolbarView = new ToolbarGlobal({
                app: this
            });
            this.toolbarDataView = new ToolbarDataView({
                app: this
            });

            //load views into regions:
            this.toolbarMainRegion.show(this.toolbarView);
            this.toolbarDataViewRegion.show(this.toolbarDataView);
        }
    });
    return GalleryApp;
});
