define([
    "marionette",
    "backbone",
    "apps/gallery/router",
    "views/gallery",
    "views/media-detail",
    "views/media-editor",
    "views/toolbar-global",
    "views/toolbar-dataview",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, PhotoGallery, MediaDetail, MediaEditor, ToolbarGlobal, ToolbarDataView) {
    "use strict";
    var GalleryApp = Marionette.Application.extend({
        regions: {
            galleryRegion: ".main-panel",
            sideRegion: ".side-panel",
            toolbarMainRegion: "#toolbar-main",
            toolbarDataViewRegion: "#toolbar-dataview"
        },
        currentCollection: null,
        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.router = new Router({ app: this});
            Backbone.history.start();

            //add event listeners:
            this.listenTo(this.vent, 'show-detail', this.showMediaDetail);
            this.listenTo(this.vent, 'show-editor', this.showMediaEditor);
        },
        initialize: function (options) {
            Marionette.Application.prototype.initialize.apply(this, [options]);

            //initialize gallery view:
            this.mainView = new PhotoGallery({
                app: this
            });
            this.currentCollection = this.mainView.collection;

            //initialize toobar view
            this.toolbarView = new ToolbarGlobal({
                app: this
            });
            this.toolbarDataView = new ToolbarDataView({
                app: this
            });

            //load views into regions:
            this.galleryRegion.show(this.mainView);
            this.toolbarMainRegion.show(this.toolbarView);
            this.toolbarDataViewRegion.show(this.toolbarDataView);
        },
        showMediaDetail: function (id) {
            var model = this.currentCollection.get(id);
            this.mediaView = new MediaDetail({
                model: model,
                app: this
            });
            this.sideRegion.show(this.mediaView);
        },
        showMediaEditor: function (id) {
            var model = this.currentCollection.get(id);
            this.mediaEditor = new MediaEditor({
                model: model,
                app: this
            });
            this.sideRegion.show(this.mediaEditor);
        }
    });
    return GalleryApp;
});
