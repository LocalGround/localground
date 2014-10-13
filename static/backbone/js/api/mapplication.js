define(["marionette",
        "backbone",
        "underscore",
        "views/maps/basemap",
        "views/maps/sidepanel/dataPanel",
        "lib/maps/data/dataManager",
        "lib/appUtilities",
        "jquery.bootstrap"
    ],
    function (Marionette, Backbone, _, BaseMap, DataPanel, DataManager, appUtilities) {
        "use strict";

        var Mapplication = new Marionette.Application();
        _.extend(Mapplication, appUtilities);

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
            var basemap = new BaseMap(this, options),
                sidePanel = new DataPanel(this, options),
                dataManager = new DataManager(this);
            this.map = basemap.map;
            Mapplication.mapRegion.show(basemap);
            Mapplication.sidebarRegion.show(sidePanel);
        });


        return Mapplication;
    });