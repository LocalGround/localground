define(["marionette",
        "underscore",
        "lib/appUtilities",
        "jquery.bootstrap"
    ],
    function (Marionette, _, appUtilities) {
        "use strict";
        var TableApp = new Marionette.Application();
        _.extend(TableApp, appUtilities);

        TableApp.addRegions({
            topBarRegion: "#topbar",
            mapRegion: "#map_canvas",
            sidebarRegion: "#panels"
        });

        TableApp.addInitializer(function (options) {
            this.initAJAX(options);
        });

        return TableApp;
    });