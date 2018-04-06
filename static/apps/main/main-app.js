define([
    "marionette",
    "backbone",
    "apps/main/router",
    "lib/modals/modal",
    "views/breadcrumbs",
    "lib/maps/basemap",
    "lib/data/dataManager",
    "apps/main/views/left/left-panel",
    "apps/main/views/right/right-panel",
    "views/data-detail",
    "collections/projects",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, Modal, BreadCrumb, Basemap,
             DataManager, LeftPanel, RightPanel, DataDetail, Projects, appUtilities) {
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
        screenType: "style",
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
            options = options || {};
            Marionette.Application.prototype.initialize.apply(this, [options]);
            this.selectedProjectID = options.projectJSON.id;
            this.dataManager = new DataManager({
                vent: this.vent,
                projectJSON: options.projectJSON
            });
            this.modal = new Modal();
            this.showBreadcrumbs();
            this.showBasemap();
            this.listenTo(this.vent, 'hide-detail', this.hideDetail);
            this.listenTo(this.vent, 'unhide-detail', this.unhideDetail);
            this.listenTo(this.vent, 'unhide-list', this.unhideList);
            this.listenTo(this.vent, 'hide-list', this.hideList);
            //this.listenTo(this.vent, 'edit-layer', this.showRightLayout);
            this.listenTo(this.vent, 'show-data-detail', this.showDataDetail);
            this.listenTo(this.vent, 'show-modal', this.showModal);
            this.listenTo(this.vent, 'hide-modal', this.hideModal);
            this.addMessageListeners();
            this.showLeftLayout();
        },

        showLeftLayout: function () {
            //load view into left region:
            this.leftPanelView = new LeftPanel({
                app: this
            });
            this.leftRegion.show(this.leftPanelView);
        },

        // showRightLayout: function (layer, collection) {
        //     var rightPanelView = new RightPanel({
        //         app: this,
        //         model: layer,
        //         collection: collection
        //     });
        //     this.rightRegion.show(rightPanelView);
        // },

        showDataDetail: function(info) {
            this.dataDetailView = new DataDetail({
                model: this.dataManager.getModel(info.dataSource, info.markerId),
                app: this
            });

            this.rightRegion.show(this.dataDetailView);
            this.unhideDetail();

            this.vent.trigger('highlight-marker', this.dataDetailView.model);
        },

        showBreadcrumbs: function () {
            this.breadcrumb = new BreadCrumb({
                app: this,
                displayMap: true
            });
            this.breadcrumbRegion.show(this.breadcrumb);
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
