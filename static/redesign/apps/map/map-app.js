define([
    "marionette",
    "backbone",
    "apps/map/router",
    "views/toolbar-global",
    "apps/gallery/views/toolbar-dataview",
    "apps/map/views/marker-listing",
    "apps/gallery/views/media-detail",
    "collections/projects",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, ToolbarGlobal, ToolbarDataView, MarkerListing, MediaDetail, Projects, appUtilities) {
    "use strict";
    var MapApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            markerListRegion: "#marker-list-panel",
            mapRegion: "#map-panel",
            markerDetailRegion: "#marker-detail-panel",
            toolbarMainRegion: "#toolbar-main",
            toolbarDataViewRegion: "#toolbar-dataview"
        },
        dataType: "photos",
        mode: "view",
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
            this.showDataToolbar();
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

        showMarkerList: function (mediaType) {
            this.dataType = mediaType;
            this.markerListView = new MarkerListing({
                app: this
            });
            this.markerListRegion.show(this.markerListView);
            this.currentCollection = this.markerListView.collection;
        },

        showMarkerDetail: function (opts) {
            var model = this.currentCollection.get(opts.id);
            this.mediaView = new MediaDetail({
                model: model,
                app: this
            });
            this.markerDetailRegion.show(this.mediaView);
        }
    }));
    return MapApp;
});
