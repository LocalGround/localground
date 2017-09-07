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
    "apps/gallery/views/data-detail",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, Basemap, DataManager, Map, Layers,
             LegendView, MapHeaderView, DataDetail, appUtilities) {
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
        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            this.router = new Router({ app: this});
            Backbone.history.start();

            //map slug needs to be in the url:
            var slug = Backbone.history.getFragment();
            /*if (slug === "") {
                alert("map slug must be included");
                return;
            }*/
            this.fetchMap(slug);
            this.listenTo(this.vent, 'fetch-map', this.fetchMap);
            this.listenTo(this.vent, 'data-loaded', this.loadRegions);
            this.listenTo(this.vent, 'show-detail', this.showMediaDetail);
            this.addMessageListeners();
        },
        fetchErrors: false,
        getMode: function () {
            return "view";
        },

        fetchMap: function (slug) {
            this.slug = slug;
            this.model = new Map();
            this.model.getMapBySlug({
                slug: this.slug,
                successCallback: this.getData.bind(this),
                errorCallback: this.getSlugFromLocalStorage.bind(this)
            });
        },

        getData: function () {
            this.saveState("presentation", {slug: this.slug });
            this.setProjectID(this.model.get("project_id"));
            this.dataManager = new DataManager({ vent: this.vent, projectID: this.getProjectID() });
            console.log(this.model.get("panel_styles").display_legend);
        },

        getSlugFromLocalStorage: function () {
            if (this.fetchErrors) {
                alert("map slug must be included");
            }
            this.fetchErrors = true;
            var newSlug = this.restoreState("presentation").slug;
            if (newSlug !== this.slug) {
                this.router.navigate("//" + newSlug);
            } else {
                alert("map slug must be included");
            }
        },

        loadRegions: function () {
            this.showMapTitle();
            this.showBasemap();
            if (this.model.get("panel_styles").display_legend === false) {
                this.hideLegend();
            } else {
                this.showLegend();
            }
        //    $('#marker-detail-panel').addClass('parallax').attr('data-scroll-speed', '1');
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
            setTimeout(function () {
                $("#map").css({"position": "fixed",
            'z-index': '0'});
            }, 500);
            this.mapRegion.show(this.basemapView);
        },

        showMapTitle: function () {
            this.mapHeaderView = new MapHeaderView({ model: this.model });
            this.titleRegion.show(this.mapHeaderView);
        },

        instantiateLegendView: function () {
            this.legendView = new LegendView({
                app: this,
                collection: new Layers(
                    this.model.get("layers"),
                    { mapID: this.model.get("id") }
                ),
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
            this.basemapView.redraw({
                time: 500
            });
        },
        showMediaDetail: function (opts) {
            var dataEntry = this.dataManager.getData(opts.dataType),
                collection = dataEntry.collection,
                model = collection.get(opts.id);
            if (opts.dataType == "markers" || opts.dataType.indexOf("form_") != -1) {
                if (!model.get("children")) {
                    model.fetch({"reset": true});
                }
            }
            if (opts.dataType.indexOf("form_") != -1) {
                model.set("fields", dataEntry.fields.toJSON());
            }
            model.set("active", true);
            this.vent.trigger('highlight-marker', model);
            console.log(opts, opts.dataType, dataEntry, this.model);
            this.detailView = new DataDetail({
                model: model,
                app: this,
                dataType: opts.dataType,
                panelStyles: this.model.get('panel_styles')
            });


            var paragraph = this.model.get('panel_styles').paragraph;
            if (paragraph && $(window).width() >= 900) {
                console.log(paragraph.color);
               $('#marker-detail-panel').css('background-color', '#' + paragraph.backgroundColor);
            }

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
