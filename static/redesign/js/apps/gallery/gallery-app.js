define([
    "marionette",
    "backbone",
    "apps/gallery/router",
    "apps/gallery/views/main",
    "apps/gallery/views/media-detail",
    "apps/gallery/views/media-editor",
    "views/toolbar-global",
    "views/toolbar-dataview",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, PhotoGallery, MediaDetail, MediaEditor, ToolbarGlobal, ToolbarDataView, appUtilities) {
    "use strict";
    var GalleryApp = Marionette.Application.extend(_.extend(appUtilities, {
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
            
            this.initAJAX(options);
            this.listenTo(this.vent, 'show-detail', this.showMediaDetail);
            this.listenTo(this.vent, 'show-editor', this.showMediaEditor);
            this.listenTo(this.vent, 'change-media-type', this.changeMediaType);
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
        changeMediaType: function (mediaType) {
            alert("instantiate a new gallery.js object with a " +
                  mediaType +
                  " collection and new params"
                );
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
    }));
    console.log(appUtilities);
    //_.extend(GalleryApp, appUtilities);
    console.log(GalleryApp);
    return GalleryApp;
});
