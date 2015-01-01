define(["marionette",
        "backbone",
        "underscore",
        "views/maps/basemap",
        "views/maps/sidepanel/dataPanel",
        "views/maps/sidepanel/layerPanel",
        "views/maps/sidepanel/tabs",
        "views/maps/topBar",
        "lib/maps/data/dataManager",
        "lib/appUtilities",
        "collections/projects",
        "lib/maps/controls/georeferenceManager",
        "views/maps/overlays/layerManager",
        "jquery.bootstrap"
    ],
    function (Marionette, Backbone, _, BaseMap, DataPanel, LayerPanel, Tabs,
              TopBar, DataManager, appUtilities, Projects, GeoreferenceManager,
              LayerManager) {
        "use strict";

        var Mapplication = new Marionette.Application();
        _.extend(Mapplication, appUtilities);
        Mapplication.setMode('view');

        Mapplication.addRegions({
            tabsRegion: "#vertical-tabs",
            topBarRegion: "#topbar",
            mapRegion: "#map_canvas",
            dataPanelRegion: "#data_panel",
            layerPanelRegion: "#layer_panel"
        });

        Mapplication.navigate = function (route, options) {
            options = options || {};
            Backbone.history.navigate(route, options);
        };

        Mapplication.getCurrentRoute = function () {
            return Backbone.history.fragment;
        };

        Mapplication.on("start", function () {
            if (Backbone.history) {
                Backbone.history.start();
            }
        });

        Mapplication.addInitializer(function (options) {
            options.projects = new Projects();
            options.app = this;
            var basemap = new BaseMap(options),
                dataPanel = new DataPanel(options),
                tabs = new Tabs({app: this}),
                layerPanel = new LayerPanel(options),
                dataManager = new DataManager(options),
                georeferenceManager = new GeoreferenceManager(options, basemap),
                topBar = new TopBar(options),
                layerManager = new LayerManager(_.extend(options, {
                    dataManager: dataManager,
                    basemap: basemap
                }));
            this.map = basemap.map;
            Mapplication.tabsRegion.show(tabs);
            Mapplication.mapRegion.show(basemap);
            Mapplication.dataPanelRegion.show(dataPanel);
            Mapplication.layerPanelRegion.show(layerPanel);
            Mapplication.topBarRegion.show(topBar);

            this.initAJAX(options);
        });

        return Mapplication;
    });