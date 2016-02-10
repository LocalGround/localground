define([
    "marionette",
    "underscore",
    "views/profile/filterView",
    "views/profile/listView",
    "lib/appUtilities"
], function (Marionette, _, FilterView, ListView, appUtilities) {
    "use strict";
    var ProfileApp = new Marionette.Application();
    _.extend(ProfileApp, appUtilities);
    ProfileApp.addRegions({
        filterRegion: "#region1",
        mainRegion: "#region2"
    });

    ProfileApp.addInitializer(function (options) {
        options.app = this;

        // create child views:
        var filterView = new FilterView(options),
            mainView = new ListView(options);

        // inject them into the regions:
        ProfileApp.filterRegion.show(filterView);
        ProfileApp.mainRegion.show(mainView);

        // initialize some AJAX helpers (from appUtilities library)
        this.initAJAX(options);
    });
    return ProfileApp;
});