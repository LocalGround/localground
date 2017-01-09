define([
    "jquery",
    "marionette",
    "backbone",
    "apps/gallery/router",
    "apps/gallery/views/data-list",
    "apps/gallery/views/data-detail",
    "views/toolbar-global",
    "apps/gallery/views/toolbar-dataview",
    "models/project",
    "collections/projects",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function ($, Marionette, Backbone, Router, DataList, DataDetail, ToolbarGlobal, ToolbarDataView, Project, Projects, appUtilities) {
    "use strict";
    var GalleryApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            galleryRegion: ".main-panel",
            sideRegion: ".side-panel",
            toolbarMainRegion: "#toolbar-main",
            toolbarDataViewRegion: "#toolbar-dataview"
        },
        currentCollection: null,
        mode: "edit",
        dataType: "photos",
        screenType: "gallery",
        activeTab: "media",

        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            this.router = new Router({ app: this});
            Backbone.history.start();

            //add event listeners:
            this.listenTo(this.vent, 'show-detail', this.showMediaDetail);
            this.listenTo(this.vent, 'hide-detail', this.hideMediaDetail);
            this.listenTo(this.vent, 'show-list', this.showMediaList);
        },
        initialize: function (options) {
            Marionette.Application.prototype.initialize.apply(this, [options]);

            //add views to regions after projects load:
            this.projects = new Projects();
            this.listenTo(this.projects, 'reset', this.selectProjectLoadRegions);
            this.projects.fetch({ reset: true });
        },
        selectProjectLoadRegions: function () {
            this.selectProject(); //located in appUtilities
            this.loadRegions();
        },

        loadRegions: function () {
            this.showGlobalToolbar();
            this.showDataToolbar();
            this.router.navigate('//photos', { trigger: true });
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
            this.mainView = new DataList({
                app: this
            });
            this.galleryRegion.show(this.mainView);
            this.currentCollection = this.mainView.collection;
            this.hideMediaDetail();
        },

        hideMediaDetail: function () {
            if (this.detailView) {
                this.detailView.doNotDisplay();
            }
        },

        createNewModelFromCurrentCollection: function () {
            //creates an empty model object:
            var Model = this.currentCollection.model,
                model = new Model();
            model.collection = this.currentCollection;
            model.set("fields", this.mainView.fields.toJSON());
            model.set("project_id", this.selectedProject.get("id"));
            return model;
        },

        showMediaDetail: function (opts) {
            var model = null;
            if (opts.id) {
                model = this.currentCollection.get(opts.id);
            } else {
                model = this.createNewModelFromCurrentCollection();
            }
            this.detailView = new DataDetail({
                model: model,
                app: this
            });
            this.sideRegion.show(this.detailView);
        }
    }));
    return GalleryApp;
});
