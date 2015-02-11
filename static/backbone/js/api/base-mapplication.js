/**
 * Created by zmmachar on 2/11/15.
 */
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
        "collections/layers",
        "lib/maps/controls/georeferenceManager",
        "views/maps/overlays/layerManager",
        "jquery.bootstrap"
    ],
    function (Marionette, Backbone, _, BaseMap, DataPanel, LayerPanel, Tabs,
              TopBar, DataManager, appUtilities, Projects, Layers,
              GeoreferenceManager, LayerManager) {
        "use strict";

        var BaseMapplication = new Marionette.Application();
        _.extend(BaseMapplication, appUtilities);
        BaseMapplication.setMode('view');

        BaseMapplication.addRegions({
            tabsRegion: "#vertical-tabs",
            topBarRegion: "#topbar",
            mapRegion: "#map_canvas",
            dataPanelRegion: "#data_panel",
            layerPanelRegion: "#layer_panel"
        });

        BaseMapplication.navigate = function (route, options) {
            options = options || {};
            Backbone.history.navigate(route, options);
        };

        BaseMapplication.getCurrentRoute = function () {
            return Backbone.history.fragment;
        };

        BaseMapplication.on("start", function () {
            if (Backbone.history) {
                Backbone.history.start();
            }
        });

        BaseMapplication.addInitializer(function (options) {
            options.app = this;
            var layerOpts = _.extend(_.clone(options), { selectedLayers: new Layers() }),
                dataOpts = _.extend(_.clone(options), { availableProjects: new Projects() }),
                basemap = new BaseMap(options),
                dataPanel = new DataPanel(dataOpts),
                tabs = new Tabs({app: this}),
                layerPanel = new LayerPanel(layerOpts),
                dataManager = new DataManager(dataOpts),
                georeferenceManager = new GeoreferenceManager(options),
                topBar = new TopBar(options),
                layerManager = new LayerManager(layerOpts);
            this.dataManager = dataManager;
            this.map = basemap.map;

            BaseMapplication.tabsRegion.show(tabs);
            BaseMapplication.mapRegion.show(basemap);
            BaseMapplication.dataPanelRegion.show(dataPanel);
            BaseMapplication.layerPanelRegion.show(layerPanel);
            BaseMapplication.topBarRegion.show(topBar);

            this.initAJAX(options);
        });

        return BaseMapplication;
    });