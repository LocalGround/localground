define([
    "marionette",
    "backbone",
    "apps/project-detail/router",
    "lib/data/dataManager",
    "models/map",
    //"apps/presentation/views/marker-overlays",
    "lib/popovers/popover",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, DataManager, Map,
            Popover, appUtilities) {
    "use strict";
    var ProjectDetailApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            container: ".main-panel",
            titleRegion: "#presentation-title",
            legendRegion: "#legend",
            mapRegion: "#map-panel",
            sideRegion: "#marker-detail-panel"
        },

        screenType: "presentation",
        showLeft: false,
        mode: "view",
        initialize: function (options) {
            options = options || {};
            Marionette.Application.prototype.initialize.apply(this, [options]);

            this.selectedProjectID = this.projectID = options.projectJSON.id;
            this.dataManager = new DataManager({
                vent: this.vent,
                projectJSON: options.projectJSON
            });
            this.popover = new Popover({
                app: this
            });
            this.model = this.dataManager.getMapBySlug(options.mapJSON.slug);

            this.routeInfo = null;

            this.loadRegions();

            this.listenTo(this.vent, 'show-detail', this.showMediaDetail);
            this.listenTo(this.vent, 'title-card', this.showTitleCard);
            this.listenToOnce(this.vent, 'map-loaded', this.initLegend);
            this.addMessageListeners();
        },
        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            this.router = new Router({ app: this});
            Backbone.history.start();
        },
        fetchErrors: false,
        getMode: function () {
            return "view";
        },

        loadRegions: function () {
            this.showMapTitle();
            this.showBasemap();
        },

        showBasemap: function () {
            this.basemapView = new Basemap({
                app: this,
                activeMapTypeID: this.model.get("basemap"),
                zoom: this.model.get("zoom"),
                center: {
                    lat: this.model.get("center").coordinates[1],
                    lng: this.model.get("center").coordinates[0]
                },
                showDropdownControl: false,
                showFullscreenControl: false,
                showSearchControl: false,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL,
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },
                rotateControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },
                allowPanZoom: this.model.get('metadata').allowPanZoom,
                allowStreetView: this.model.get('metadata').streetview
            });
            this.mapRegion.show(this.basemapView);
        },

        initLegend: function () {
            //SV: this line breaks the centering:
            //$("#map").css({"position": "fixed", 'z-index': '0'});
            if (this.model.get('metadata').displayLegend === false) {
                this.hideLegend();
            } else {
                this.showLegend();
            }
            if (this.routeInfo) {
                this.vent.trigger('highlight-current-record', this.routeInfo);
            }
        },

        showMapTitle: function () {
            this.mapHeaderView = new MapHeaderView({ model: this.model });
            this.titleRegion.show(this.mapHeaderView);
        },

        instantiateLegendView: function () {
            this.legendView = new LegendView({
                app: this,
                collection: this.model.getLayers(),
                model: this.model
            });
            this.legendRegion.show(this.legendView);
        },

        hideLegend: function () {
            this.instantiateLegendView();
            this.legendRegion.$el.hide();
            this.legendRegion.show(this.legendView);
            this.vent.trigger('show-all-markers');
        },
        showLegend: function () {
            this.instantiateLegendView();
            this.legendRegion.$el.show();
        },

        
    }));
    return ProjectDetailApp;
});
