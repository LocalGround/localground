define([
    "marionette",
    "backbone",
    "apps/presentation/router",
    "apps/map/views/map",
    "collections/projects",
    "collections/photos",
    "apps/presentation/views/marker-overlays",
    "apps/presentation/views/legend",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, Basemap, Projects, Photos,
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
            var that = this;
            this.photos = new Photos();
            this.listenTo(this.photos, 'reset', function () {
                console.log(that.map);
                that.overlays = new OverlayListView({
                    collection: that.photos,
                    app: that
                });
            });
            this.photos.fetch({reset: true});
        }
    }));
    return PresentationApp;
});
