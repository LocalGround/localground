/**
 * Created by zmmachar on 12/11/14.
 */
define(["marionette",
        "backbone",
        "underscore",
        "views/maps/basemap",
        "lib/maps/data/viewLoader",
        "lib/appUtilities",
        "collections/projects",
        "lib/maps/controls/georeferenceManager",
        "jquery.bootstrap"
    ],
    function (Marionette, Backbone, _, BaseMap, ViewLoader, appUtilities, Projects, GeoreferenceManager) {
        "use strict";

        var Mapplication = new Marionette.Application();
        _.extend(Mapplication, appUtilities);
        Mapplication.setMode('view');

        Mapplication.addRegions({
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
            var viewLoader = new ViewLoader(options),
                basemap = new BaseMap(options);
            this.map = basemap.map;
            Mapplication.mapRegion.show(basemap);

            this.initAJAX(options);
        });

        return Mapplication;
    });