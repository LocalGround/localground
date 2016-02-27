define([
    "marionette",
    "underscore",
    "views/profile/filterView",
    "views/profile/listEditView",
    "views/profile/listView",
    "lib/appUtilities"
], function (Marionette, _, FilterView, ListEditView, ListView, appUtilities) {
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
            mainView = new ListEditView(options);

        // inject them into the regions:
        ProfileApp.filterRegion.show(filterView);
        ProfileApp.mainRegion.show(mainView);

        // initialize some AJAX helpers (from appUtilities library)
        this.initAJAX(options);
    });

    ProfileApp.vent.on("show-edit-view", function(options){
      console.log(options);
      var mainView = new ListEditView(options);
      ProfileApp.mainRegion.show(mainView);
    });
    ProfileApp.vent.on("show-static-view", function(options){
      console.log(options);
      var mainView = new ListView(options);
      ProfileApp.mainRegion.show(mainView);
    });
    return ProfileApp;
});
