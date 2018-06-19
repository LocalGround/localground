define([
    "marionette",
    "backbone",
    "apps/presentation/router",
    "lib/maps/basemap",
    "lib/data/dataManager",
    "models/map",
    'collections/layers',
    //"apps/presentation/views/marker-overlays",
    "apps/presentation/views/layer-list-manager",
    "apps/presentation/views/map-header",
    "views/data-detail",
    "lib/popovers/popover",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, Basemap, DataManager, Map, Layers,
             LegendView, MapHeaderView, DataDetail, Popover, appUtilities) {
    "use strict";
    var PresentationApp = Marionette.Application.extend(_.extend(appUtilities, {
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

            this.loadRegions();

            this.listenTo(this.vent, 'show-detail', this.showMediaDetail);
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
                }
            });
            this.mapRegion.show(this.basemapView);
        },

        initLegend: function () {
            //SV: this line breaks the centering:
            //$("#map").css({"position": "fixed", 'z-index': '0'});
            if (this.model.get("panel_styles").display_legend === false) {
                this.hideLegend();
            } else {
                this.showLegend();
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

        updateDisplay: function () {
            var className = "none";
            if (this.showLeft) {
                className = "left";
            }
            this.container.$el.removeClass("left none");
            this.container.$el.addClass(className);
        },
        showMediaDetail: function (opts) {
            const dm = this.dataManager;
            const recordModel = dm.getModel(opts.dataType, parseInt(opts.id));
            recordModel.set("active", true);

            if (opts.dataType.indexOf("dataset_") != -1) {
                if (!recordModel.get("children")) {
                    recordModel.fetch({"reset": true});
                }
            }

            const detailView = new DataDetail({
                model: recordModel,
                app: this,
                panelStyles: this.model.get('panel_styles')
            });

            var paragraph = this.model.get('panel_styles').paragraph;
            if (paragraph && $(window).width() >= 900) {
               $('#marker-detail-panel').css('background-color', '#' + paragraph.backgroundColor);
            }

            this.sideRegion.show(detailView);
            this.unhideDetail();
        },

        unhideDetail: function () {
            this.showLeft = true;
            this.updateDisplay();
        }
    }));
    return PresentationApp;
});
