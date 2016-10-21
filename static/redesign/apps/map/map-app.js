define([
    "marionette",
    "backbone",
    "apps/gallery/router",
    "views/toolbar-global",
    "collections/projects",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, Toolbar, Projects, appUtilities) {
    "use strict";
    var GalleryApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            galleryRegion: ".main-panel",
            sideRegion: ".side-panel",
            toolbarRegion: "#toolbar-main"
        },
        currentCollection: null,
        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            this.router = new Router({ app: this});
            Backbone.history.start();
        },
        initialize: function (options) {
            Marionette.Application.prototype.initialize.apply(this, [options]);
            this.selectProjectLoadRegions();
        },
        selectProjectLoadRegions: function () {
            var that = this;
            this.projects = new Projects();
            this.projects.fetch({
                success: function () {
                    that.selectProject(); //located in appUtilities
                    that.loadRegions();
                }
            });
        },
        loadRegions: function () {
            this.toolbarView = new Toolbar({
                app: this
            });
            this.toolbarRegion.show(this.toolbarView);
        }
    }));
    return GalleryApp;
});
