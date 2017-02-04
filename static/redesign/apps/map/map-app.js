define([
    "marionette",
    "backbone",
    "apps/map/router",
    "views/toolbar-global",
    "apps/gallery/views/toolbar-dataview",
    "lib/data/dataManager",
    "apps/map/views/marker-listing-manager",
    "lib/maps/basemap",
    "apps/gallery/views/data-detail",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, ToolbarGlobal, ToolbarDataView,
             DataManager, MarkerListingManager, Basemap, DataDetail, appUtilities) {
    "use strict";
    /* TODO: Move some of this stuff to a Marionette LayoutView */
    var MapApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            container: ".main-panel",
            markerListRegion: "#marker-list-panel",
            mapRegion: "#map-panel",
            markerDetailRegion: "#marker-detail-panel",
            toolbarMainRegion: "#toolbar-main",
            toolbarDataViewRegion: "#toolbar-dataview"
        },
        mode: "edit",
        screenType: "map",
        showLeft: true,
        showRight: false,
        currentCollection: null,
        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            this.router = new Router({ app: this});
            Backbone.history.start();
            this.listenTo(this.vent, 'data-loaded', this.loadRegions);
            this.listenTo(this.vent, 'show-detail', this.showDetail);
            this.listenTo(this.vent, 'unhide-list', this.unhideList);
            this.listenTo(this.vent, 'hide-list', this.hideList);
            this.listenTo(this.vent, 'hide-detail', this.hideDetail);
            this.listenTo(this.vent, 'unhide-detail', this.unhideDetail);
        },
        initialize: function (options) {
            Marionette.Application.prototype.initialize.apply(this, [options]);
            this.dataManager = new DataManager({ app: this});
        },

        loadRegions: function () {
            this.showGlobalToolbar();
            this.showDataToolbar();
            this.showBasemap();
            this.showMarkerListManager();
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

        updateDisplay: function () {
            var className = "none";
            if (this.showLeft && this.showRight) {
                className = "both";
            } else if (this.showLeft) {
                className = "left";
            } else if (this.showRight) {
                className = "right";
            }
            this.container.$el.removeClass("left right none both");
            this.container.$el.addClass(className);
            this.basemapView.redraw();
        },

        showBasemap: function () {
            this.basemapView = new Basemap({
                app: this
            });
            this.mapRegion.show(this.basemapView);
        },

        showMarkerListManager: function () {
            this.showLeft = true;
            this.updateDisplay();
            this.markerListManager = new MarkerListingManager({
                app: this
            });
            this.markerListRegion.show(this.markerListManager);
        },

        hideList: function () {
            this.showLeft = false;
            this.updateDisplay();
        },
        unhideList: function () {
            this.showLeft = true;
            this.updateDisplay();
        },

        createNewModelFromCurrentCollection: function () {
            var Model = this.currentCollection.model,
                model = new Model();
            model.collection = this.currentCollection;
            model.set("project_id", this.getProjectID());
            return model;
        },

        showDetail: function (opts) {
            var dataType = opts.dataType,
                dataEntry = this.dataManager.getData(dataType),
                model = null;
            this.currentCollection = dataEntry.collection;
            if (opts.id) {
                model = this.currentCollection.get(opts.id);
                if (dataType == "markers" || dataType.indexOf("form_") != -1) {
                    if (!model.get("children")) {
                        model.fetch({"reset": true});
                    }
                }
            } else {
                model = this.createNewModelFromCurrentCollection();
            }
            if (dataType.indexOf("form_") != -1) {
                model.set("fields", dataEntry.fields.toJSON());
            }
            this.dataDetail = new DataDetail({
                model: model,
                app: this,
                dataType: dataType
            });
            this.markerDetailRegion.show(this.dataDetail);
            this.unhideDetail();
        },

        hideDetail: function () {
            this.showRight = false;
            this.updateDisplay();
        },

        unhideDetail: function () {
            this.showRight = true;
            this.updateDisplay();
        }
    }));
    return MapApp;
});
