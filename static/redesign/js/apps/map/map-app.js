define([
    "marionette",
    "backbone",
    "apps/gallery/router",
    "views/toolbar-global",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, Toolbar) {
    "use strict";
    var GalleryApp = Marionette.Application.extend({
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
            this.router = new Router({ app: this});
            Backbone.history.start();
        },
        initialize: function (options) {
            Marionette.Application.prototype.initialize.apply(this, [options]);

            //initialize toobar view
            this.toolbarView = new Toolbar({
                app: this
            });

            //load views into regions:
            this.toolbarRegion.show(this.toolbarView);
        }
    });
    return GalleryApp;
});
