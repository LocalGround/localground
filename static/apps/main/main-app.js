define([
    "marionette",
    "backbone",
    "apps/main/router",
    "lib/modals/modal",
    "views/breadcrumbs",
    "lib/maps/basemap",
    "lib/data/dataManager",
    "apps/main/views/left/left-panel",
    "views/data-detail",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, Modal, ToolbarGlobal, Basemap,
             DataManager, LeftPanel, DataDetail, appUtilities) {
    "use strict";
    /* TODO: Move some of this stuff to a Marionette LayoutView */
    var MapApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            container: ".main-panel",
            rightRegion: "#right-panel",
            mapRegion: "#map-panel",
            leftRegion: "#left-panel",
            breadcrumbRegion: "#breadcrumb"
        },
        mode: "edit",
        showLeft: true,
        showRight: false,
        layerHasBeenAltered: false,
        layerHasBeenSaved: false,
        currentCollection: null,
        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            this.router = new Router({ app: this });
            Backbone.history.start();
        },
        initialize: function (options) {
            console.log('init app');
            options = options || {};
            Marionette.Application.prototype.initialize.apply(this, [options]);
            this.selectedProjectID = options.projectJSON.id;
            this.dataManager = new DataManager({
                vent: this.vent,
                projectJSON: options.projectJSON
            });
            this.modal = new Modal({
                app: this
            });
            this.showBasemap();

            this.listenTo(this.vent, 'route-map', this.setActiveMapModel);
            this.listenTo(this.vent, 'hide-detail', this.hideDetail);
            this.listenTo(this.vent, 'unhide-detail', this.unhideDetail);
            this.listenTo(this.vent, 'unhide-list', this.unhideList);
            this.listenTo(this.vent, 'hide-list', this.hideList);
            //this.listenTo(this.vent, 'edit-layer', this.showRightLayout);
            this.listenTo(this.vent, 'show-data-detail', this.showDataDetail);
            this.listenTo(this.vent, 'show-modal', this.showModal);
            this.listenTo(this.vent, 'hide-modal', this.hideModal);
            this.addMessageListeners();

            //ONLY SHOW LEFT PANEL AND TOOLBAR AFTER MAP HAS BEEN ROUTED
            //this.showBreadcrumbs();
            //this.showLeftLayout();
        },

        showDataDetail: function(info) {
            var model = this.dataManager.getModel(info.dataSource, info.markerId);
            this.dataDetailView = new DataDetail({
                model: model,
                app: this
            });
            console.log(this.dataDetailView);


            this.rightRegion.show(this.dataDetailView);
            this.unhideDetail();

            // this won't do what we want here because the record model is not
            // represented by its own view (hence no 'model' exists for a given record).
            // Rather, the records are simply pieces of content in the SymbolSet itemView
            //dataDetailView.model.set("active", true);

            // instead we will trigger an event on the LayerList parent,
            // loop through children, call a function on the matching layer


            this.vent.trigger('highlight-marker', this.dataDetailView.model);
        },

        showBreadcrumbs: function () {
            this.breadcrumbRegion.show(new ToolbarGlobal({
                app: this,
                displayMap: true,
                model: this.dataManager.getProject(),
                activeMap: this.dataManager.getMap(),
                collection: this.dataManager.maps
            }));
        },


        showLeftLayout: function () {
            this.leftPanelView = new LeftPanel({
                app: this,
                model: this.dataManager.getMap()
            });
            this.leftRegion.show(this.leftPanelView);
        },

        setActiveMapModel: function (mapID) {
            this.dataManager.setMapById(mapID);
            const map = this.dataManager.getMap();
            map.fetch({ success: this.applyNewMap.bind(this) });
        },

        applyNewMap: function () {
            this.vent.trigger('new-map-loaded', this.dataManager.getMap());
            this.showBreadcrumbs();
            this.showLeftLayout();
        },

        getZoom: function () {
            return this.basemapView.getZoom();
        },

        getCenter: function () {
            var latLng = this.basemapView.getCenter();
            return {
                "type": "Point",
                "coordinates": [
                    latLng.lng(),
                    latLng.lat()
                ]
            };
        },

        getMapTypeId: function () {
            return this.basemapView.getMapTypeId();
        },

        showBasemap: function () {
            var opts = { app: this };
            this.basemapView = new Basemap(opts);
            this.mapRegion.show(this.basemapView);
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
            //wait 'til CSS animation completes before redrawing map
            setTimeout(this.basemapView.redraw, 220);
        },

        showModal: function (opts) {
            console.log('show modal');
            //generic function that displays a view in a modal
            var params = {};
            _.extend(params, opts);
            _.extend(params, {
                showSaveButton: opts.saveFunction ? true : false,
                showDeleteButton: opts.deleteFunction ? true : false,
                saveFunction: opts.saveFunction ? opts.saveFunction.bind(opts.view) : null,
                deleteFunction: opts.deleteFunction ? opts.deleteFunction.bind(opts.view) : null
            });
            this.modal.update(params);
            this.modal.show();
        },

        hideModal: function() {
            this.modal.hide();
        },

        hideList: function () {
            this.showLeft = false;
            this.updateDisplay();
        },
        unhideList: function () {
            this.showLeft = true;
            this.updateDisplay();
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
