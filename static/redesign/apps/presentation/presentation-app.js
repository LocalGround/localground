define([
    "marionette",
    "backbone",
    "apps/presentation/router",
    "lib/maps/basemap",
    "lib/data/dataManager",
    "models/map/",
    "apps/presentation/views/marker-overlays",
    "apps/presentation/views/legend",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, Basemap, DataManager, Map,
             OverlayListView, LegendView, appUtilities) {
    "use strict";
    var PresentationApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            //container: ".main-panel",
            legendRegion: "#legend",
            mapRegion: "#map-panel"
            //markerDetailRegion: "#marker-detail-panel"
        },
        dataType: "photos",
        screenType: "presentation",
        currentCollection: null,
        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            this.router = new Router({ app: this});
            Backbone.history.start();
            this.listenTo(this.vent, 'data-loaded', this.loadRegions);
        },
        initialize: function (options) {
            Marionette.Application.prototype.initialize.apply(this, [options]);
            this.map = new Map({id: 1});
            this.map.fetch({
                success: this.getData.bind(this)
            });
        },

        getData: function () {
            console.log(this.map);
            this.dataManager = new DataManager({ app: this});
        },

        loadRegions: function () {
            this.showBasemap();
            this.showLegend();
            this.showMapMarkers();
        },

        showBasemap: function () {
            this.basemapView = new Basemap({
                app: this,
                showSearchControl: false
            });
            this.mapRegion.show(this.basemapView);
        },

        showLegend: function () {
            this.legendView = new LegendView({
                app: this
            });
            this.legendRegion.show(this.legendView);
        },

        showMapMarkers: function () {
            this.overlays = new OverlayListView({
                collection: this.dataManager.getCollection('photos'),
                app: this
            });
        }
    }));
    return PresentationApp;
});
