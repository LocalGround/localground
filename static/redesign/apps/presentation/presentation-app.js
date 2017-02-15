define([
    "marionette",
    "backbone",
    "apps/presentation/router",
    "lib/maps/basemap",
    "lib/data/dataManager",
    "models/map",
    "apps/presentation/views/marker-overlays",
    "apps/presentation/views/legend-layer-entry",
    "apps/gallery/views/data-detail",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, Basemap, DataManager, Map,
             OverlayListView, LegendView, DataDetail, appUtilities) {
    "use strict";
    var PresentationApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            container: ".main-panel",
            legendRegion: "#legend",
            mapRegion: "#map-panel",
            sideRegion: "#marker-detail-panel"
        },
        dataType: "markers",
        screenType: "presentation",
        showLeft: false,
        mode: "presentation",
        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            this.router = new Router({ app: this});
            Backbone.history.start();
            this.listenTo(this.vent, 'data-loaded', this.loadRegions);
            this.listenTo(this.vent, 'show-detail', this.showMediaDetail);
        },
        initialize: function (options) {
            Marionette.Application.prototype.initialize.apply(this, [options]);
            this.model = new Map({id: 1});
            this.model.fetch({
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
                app: this,
                model: this.model
            });
            this.legendRegion.show(this.legendView);
        },

        showMapMarkers: function () {
            this.overlays = new OverlayListView({
                collection: this.dataManager.getCollection(this.dataType),
                app: this
            });
        },
        updateDisplay: function () {
            var className = "none";
            if (this.showLeft) {
                className = "left";
            }
            this.container.$el.removeClass("left none");
            this.container.$el.addClass(className);
            this.basemapView.redraw({
                time: 500
            });
        },
        showMediaDetail: function (opts) {
            var collection = this.dataManager.getData(opts.dataType).collection,
                model = collection.get(opts.id);
            console.log(collection, model, opts.id);
            if (opts.dataType == "markers" || opts.dataType.indexOf("form_") != -1) {
                if (!model.get("children")) {
                    model.fetch({"reset": true});
                }
            }
            this.detailView = new DataDetail({
                model: model,
                app: this,
                dataType: opts.dataType
            });
            this.sideRegion.show(this.detailView);
            this.unhideDetail();
        },

        unhideDetail: function () {
            this.showLeft = true;
            this.updateDisplay();
        }
    }));
    return PresentationApp;
});
