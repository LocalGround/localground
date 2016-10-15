define([
    "marionette",
    "backbone",
    "apps/gallery/router",
    "apps/gallery/views/main",
    "apps/gallery/views/media-detail",
    "views/toolbar-global",
    "apps/gallery/views/toolbar-dataview",
    "models/project",
    "collections/projects",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, MediaList, MediaDetail, ToolbarGlobal, ToolbarDataView, Project, Projects, appUtilities) {
    "use strict";
    var GalleryApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            galleryRegion: ".main-panel",
            sideRegion: ".side-panel",
            toolbarMainRegion: "#toolbar-main",
            toolbarDataViewRegion: "#toolbar-dataview"
        },
        currentCollection: null,
        mode: "view",
        dataType: "photos",
        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            this.router = new Router({ app: this});
            Backbone.history.start();

            //add event listeners:
            this.listenTo(this.vent, 'show-detail', this.showMediaDetail);
            this.listenTo(this.vent, 'show-list', this.showMediaList);
        },
        initialize: function (options) {
            Marionette.Application.prototype.initialize.apply(this, [options]);

            //add views to regions:
            this.selectProjectLoadRegions();

        },
        selectProjectLoadRegions: function () {
            this.projects = new Projects();
            this.projects.fetch({ reset: true });
            this.listenTo(this.projects, 'reset', this.selectProject);
        },

        selectProject: function () {
            var id = this.getParameterByName('project_id');
            if (id) {
                this.selectedProject = this.projects.get(id);
            } else {
                this.selectedProject = this.projects.at(0);
            }
            this.loadRegions();
        },

        loadRegions: function () {
            this.showGlobalToolbar();
            this.showDataToolbar();
            this.router.navigate('//photos', { trigger: true });
            //this.showMediaList();
        },

        showGlobalToolbar: function () {
            this.toolbarView = new ToolbarGlobal({
                app: this
            });
            this.toolbarMainRegion.show(this.toolbarView);
        },

        showDataToolbar: function () {
            this.toolbarDataView = new ToolbarDataView({
                app: this
            });
            this.toolbarDataViewRegion.show(this.toolbarDataView);
        },

        showMediaList: function (mediaType) {
            this.dataType = mediaType;
            this.mainView = new MediaList({
                app: this
            });
            this.galleryRegion.show(this.mainView);
            this.currentCollection = this.mainView.collection;
        },

        showMediaDetail: function (opts) {
            var model = this.currentCollection.get(opts.id);
            this.mediaView = new MediaDetail({
                model: model,
                app: this
            });
            this.sideRegion.show(this.mediaView);
        }
    }));
    return GalleryApp;
});
