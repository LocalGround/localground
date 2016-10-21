define([
    "marionette",
    "backbone",
    "apps/home/router",
    "apps/home/views/main",
    "apps/home/views/toolbar",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, ProjectList, Toolbar, appUtilities) {
    "use strict";
    var HomeApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            projectRegion: ".main-panel",
            toolbarMainRegion: "#toolbar-main"
        },

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

            //add views to regions:
            this.loadRegions();
        },

        loadRegions: function () {
            this.showProjectList();
            this.showToolbar();
        },

        showToolbar: function () {
            this.toolbarView = new Toolbar({
                app: this
            });
            this.toolbarMainRegion.show(this.toolbarView);
        },

        showProjectList: function () {
            this.mainView = new ProjectList({
                app: this
            });
            this.projectRegion.show(this.mainView);
        }
    }));
    return HomeApp;
});
