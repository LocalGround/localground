define([
    "marionette",
    "underscore",
    "views/profile/filterView",
    "views/profile/listEditView",
    "views/profile/listView",
    "views/profile/sideBarView",
    "collections/photos",
    "collections/audio",
    "collections/mapimages",
    "lib/appUtilities"
], function (Marionette, _, FilterView, ListEditView, ListView, SideBarView, Photos, Audios, MapImages, appUtilities) {
    "use strict";
    var ProfileApp = new Marionette.Application();
    _.extend(ProfileApp, appUtilities);
    ProfileApp.addRegions({
        filterRegion: "#region1",
        mainRegion: "#region2",
        sideBarRegion : "#region3"
    });

    ProfileApp.addInitializer(function (options) {
        options.app = this;
        options.view = "photos"
        options.collection = new Photos();
        

        // create child views:
        var filterView = new FilterView(options),
            mainView = new ListEditView(options),
            sideBarView = new SideBarView(options);

        // inject them into the regions:
        ProfileApp.filterRegion.show(filterView);
        ProfileApp.mainRegion.show(mainView);
        ProfileApp.sideBarRegion.show(sideBarView);

        // initialize some AJAX helpers (from appUtilities library)
        this.initAJAX(options);
    });

    ProfileApp.vent.on("show-edit-view", function (options) {

        if (options.view == "photos") {
            options.collection = new Photos();
        }
        else if (options.view == "scan") {
            options.collection = new MapImages();
        }
        else if (options.view == "audio") {
            options.collection = new Audios();
        }

        var mainView = new ListEditView(options);
        ProfileApp.mainRegion.show(mainView);
    });
    ProfileApp.vent.on("show-static-view", function (options) {

        if (options.view == "photos") {
            options.collection = new Photos();
        }
        else if (options.view == "scan") {
            options.collection = new MapImages();
        }
        else if (options.view == "audio") {
            options.collection = new Audios();
        }

        var mainView = new ListView(options);
        ProfileApp.mainRegion.show(mainView);
    });
    return ProfileApp;
});
