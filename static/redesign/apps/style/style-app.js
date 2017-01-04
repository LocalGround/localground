define([
    "marionette",
    "backbone",
    "apps/style/router",
    "views/toolbar-global",
    "apps/style/views/layer-listing",
    "apps/style/views/map",
    "apps/gallery/views/data-detail",
    "collections/projects",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, ToolbarGlobal,
             LayerListing, Basemap, DataDetail, Projects, appUtilities) {
    "use strict";
    /* TODO: Move some of this stuff to a Marionette LayoutView */
    var MapApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            container: ".main-panel",
            markerListRegion: "#marker-list-panel",
            mapRegion: "#map-panel",
            markerDetailRegion: "#marker-detail-panel",
            toolbarMainRegion: "#toolbar-main"
        },
        dataType: "photos",
        mode: "edit",
        screenType: "map",
        currentCollection: null,
        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            this.router = new Router({ app: this});
            Backbone.history.start();
            this.listenTo(this.vent, 'show-list', this.showMarkerList);
            this.listenTo(this.vent, 'show-detail', this.showMarkerDetail);
        },
        initialize: function (options) {
            Marionette.Application.prototype.initialize.apply(this, [options]);
            this.projects = new Projects();
            this.listenTo(this.projects, 'reset', this.selectProjectLoadRegions);
            this.projects.fetch({ reset: true });
        },
        selectProjectLoadRegions: function () {
            this.selectProject(); //located in appUtilities
            this.loadRegions();
        },

        loadRegions: function () {
            this.showGlobalToolbar();
            this.showBasemap();
            this.router.navigate('//photos', { trigger: true });
        },

        showGlobalToolbar: function () {
            this.toolbarView = new ToolbarGlobal({
                app: this
            });
            this.toolbarMainRegion.show(this.toolbarView);
        },

        showBasemap: function () {
            this.basemapView = new Basemap({
                app: this
            });
            this.mapRegion.show(this.basemapView);
        },

        showMarkerList: function (mediaType) {
            this.container.$el.removeClass("show-detail");
            this.dataType = mediaType;
            if (this.markerListView) {
                //destroys all of the existing overlays
                this.markerListView.remove();
            }
            this.markerListView = new LayerListing({
                app: this
            });
            this.markerListRegion.show(this.markerListView);
            this.currentCollection = this.markerListView.collection;
        },

        showMarkerDetail: function (opts) {
            this.container.$el.addClass("show-detail");
            var model = this.currentCollection.get(opts.id);
            this.dataDetail = new DataDetail({
                model: model,
                app: this
            });
            this.markerDetailRegion.show(this.dataDetail);
        }
    }));
    return MapApp;
});
