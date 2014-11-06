define(["marionette",
        "backbone",
        "underscore",
        "views/maps/basemap",
        "views/maps/sidepanel/dataPanel",
        "views/maps/topBar",
        "lib/maps/data/dataManager",
        "lib/appUtilities",
        "collections/projects",
        "lib/maps/controls/georeferenceManager",
        "jquery.bootstrap"
    ],
    function (Marionette, Backbone, _, BaseMap, DataPanel, TopBar, DataManager, appUtilities, Projects, GeoreferenceManager) {
        "use strict";

        var Mapplication = new Marionette.Application();
        _.extend(Mapplication, appUtilities);
        Mapplication.setMode('view');

        Mapplication.addRegions({
            topBarRegion: "#topbar",
            mapRegion: "#map_canvas",
            sidebarRegion: "#panels"
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
            var that = this,
                basemap = new BaseMap(options),
                sidePanel = new DataPanel(options),
                dataManager = new DataManager(options),
                georeferenceManager = new GeoreferenceManager(options, basemap),
                topBar = new TopBar(options);
            this.map = basemap.map;
            Mapplication.mapRegion.show(basemap);
            Mapplication.sidebarRegion.show(sidePanel);
            Mapplication.topBarRegion.show(topBar);

            this.initAJAX(options);
        });

        return Mapplication;
    });