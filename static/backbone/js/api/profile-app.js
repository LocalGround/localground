define([
    "marionette",
    "underscore",
    "lib/appUtilities"
], function (Marionette, _, appUtilities) {
    "use strict";
    var ProfileApp = new Marionette.Application();
    _.extend(ProfileApp, appUtilities);
    ProfileApp.addRegions({
        filterRegion: "#region1",
        mainRegion: "#region2"
    });

    ProfileApp.addInitializer(function (options) {
        var filterView = new Marionette.ItemView({
                template: "#filter-template"
            }),
            mainView = new Marionette.ItemView({
                template: "#profile-template"
            });
        ProfileApp.filterRegion.show(filterView);
        ProfileApp.mainRegion.show(mainView);
        this.initAJAX(options);
    });
    return ProfileApp;
});