define([
    "marionette",
    "backbone",
    "apps/project_detail/router",
    "lib/modals/modal",
    "lib/data/dataManager",
    "apps/project_detail/views/project-header",
    "apps/project_detail/views/map-list-manager",
    "apps/project_detail/views/dataset-list-manager",
    //"apps/presentation/views/marker-overlays",
    "lib/popovers/popover",
    "lib/appUtilities",
    "lib/handlebars-helpers",
], function (Marionette, Backbone, Router, Modal, DataManager, ProjectHeaderView, MapListView,
            DatasetListView, Popover, appUtilities) {
    "use strict";
    var ProjectDetailApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            breadcrumbRegion: '#breadcrumb',
            projectHeaderRegion: '.project_header',
            mapListRegion: '.project_map-list',
            datasetListRegion: '.project_dataset-list'
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

            this.modal = new Modal({
                app: this
            });
            this.model = this.dataManager.getProject(options.projectJSON.id)
            console.log(this.model);


            this.loadRegions();

    
            //this.listenToOnce(this.vent, 'map-loaded', this.initLegend);
            //this.addMessageListeners();
        },
        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            //this.router = new Router({ app: this});
            Backbone.history.start();
        },
        fetchErrors: false,
        getMode: function () {
            return "view";
        },

        loadRegions: function () {
            this.showProjectHeader();
            this.showMapList();
            this.showDatasetList();
        },

        showProjectHeader: function() {
            this.projectHeaderView = new ProjectHeaderView({
                model: this.model,
                app: this
            });
            this.projectHeaderRegion.show(this.projectHeaderView);
        },

        showMapList: function() {
            this.mapListView = new MapListView({
                model: this.model,
                app: this,
                collection: this.dataManager.getMaps()
            });
            this.mapListRegion.show(this.mapListView);
        },
        showDatasetList: function() {
            console.log('not a bacbone collection', this.dataManager.getDatasets());
            console.log(new Backbone.Collection(this.dataManager.getDatasets()));
            let datasets = this.dataManager.getDatasets().map((item) => {
                return {
                    name: item.name,
                    models: item.models,
                    dataType: item.dataType,
                    description: item.description,
                    projectID: item.projectID
                }
            });

            this.datasetListView = new DatasetListView({
                model: this.model,
                app: this,
                collection: new Backbone.Collection(datasets)
            });
            this.datasetListRegion.show(this.datasetListView);
        },

        // showBasemap: function () {
        //     this.basemapView = new Basemap({
        //         app: this,
        //         activeMapTypeID: this.model.get("basemap"),
        //         zoom: this.model.get("zoom"),
        //         center: {
        //             lat: this.model.get("center").coordinates[1],
        //             lng: this.model.get("center").coordinates[0]
        //         },
        //         showDropdownControl: false,
        //         showFullscreenControl: false,
        //         showSearchControl: false,
        //         zoomControlOptions: {
        //             style: google.maps.ZoomControlStyle.SMALL,
        //             position: google.maps.ControlPosition.LEFT_BOTTOM
        //         },
        //         streetViewControlOptions: {
        //             position: google.maps.ControlPosition.LEFT_BOTTOM
        //         },
        //         rotateControlOptions: {
        //             position: google.maps.ControlPosition.LEFT_BOTTOM
        //         },
        //         allowPanZoom: this.model.get('metadata').allowPanZoom,
        //         allowStreetView: this.model.get('metadata').streetview
        //     });
        //     this.mapRegion.show(this.basemapView);
        // },

        // initLegend: function () {
        //     //SV: this line breaks the centering:
        //     //$("#map").css({"position": "fixed", 'z-index': '0'});
        //     if (this.model.get('metadata').displayLegend === false) {
        //         this.hideLegend();
        //     } else {
        //         this.showLegend();
        //     }
        //     if (this.routeInfo) {
        //         this.vent.trigger('highlight-current-record', this.routeInfo);
        //     }
        // },

        // showMapTitle: function () {
        //     this.mapHeaderView = new MapHeaderView({ model: this.model });
        //     this.titleRegion.show(this.mapHeaderView);
        // },

        // instantiateLegendView: function () {
        //     this.legendView = new LegendView({
        //         app: this,
        //         collection: this.model.getLayers(),
        //         model: this.model
        //     });
        //     this.legendRegion.show(this.legendView);
        // },

        // hideLegend: function () {
        //     this.instantiateLegendView();
        //     this.legendRegion.$el.hide();
        //     this.legendRegion.show(this.legendView);
        //     this.vent.trigger('show-all-markers');
        // },
        // showLegend: function () {
        //     this.instantiateLegendView();
        //     this.legendRegion.$el.show();
        // },

        
    }));
    return ProjectDetailApp;
});
