define([
    "marionette",
    "backbone",
    "apps/style/router",
    "views/toolbar-global",
    "apps/style/views/map",
    "apps/style/views/left-panel",
    "collections/projects",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, ToolbarGlobal,
             Basemap, LeftPanel, Projects, appUtilities) {
    "use strict";
    /* TODO: Move some of this stuff to a Marionette LayoutView */
    var MapApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            container: ".main-panel",
            rightRegion: "#right-panel",
            mapRegion: "#map-panel",
            leftRegion: "#left-panel",
            toolbarMainRegion: "#toolbar-main"
        },
        currentCollection: null,
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
            this.projects = new Projects();
            this.listenTo(this.projects, 'reset', this.selectProjectLoadRegions);
            this.projects.fetch({ reset: true });
            this.listenTo(this.vent, 'resize-map', this.resizeMap);
        },
        selectProjectLoadRegions: function () {
            this.selectProject(); //located in appUtilities
            this.loadRegions();
        },

        loadRegions: function () {
            this.showGlobalToolbar();
            this.showBasemap();
            this.showLeftLayout();
        },

        showLeftLayout: function () {
            //load view into left region:
            this.leftPanelView = new LeftPanel({
                app: this
            });
            this.leftRegion.show(this.leftPanelView);
        },

        showGlobalToolbar: function () {
            this.toolbarView = new ToolbarGlobal({
                app: this
            });
            this.toolbarMainRegion.show(this.toolbarView);
        },

        showBasemap: function () {
            var opts = { app: this };
            this.basemapView = new Basemap(opts);
            this.mapRegion.show(this.basemapView);
        },
        resizeMap: function (width) {
            this.mapRegion.$el.css({
                width: width
            });
            this.vent.trigger('google-redraw');
        }
    }));
    return MapApp;
});
