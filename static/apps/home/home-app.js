define([
    "marionette",
    "backbone",
    "apps/home/router",
    "apps/home/views/main",
    "apps/home/views/toolbar",
    "apps/home/views/shareForm",
    "lib/modals/modal",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, ProjectList, Toolbar, ShareForm, Modal, appUtilities) {
    "use strict";
    var HomeApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            projectRegion: ".main-panel",
            toolbarMainRegion: "#toolbar-main",
            shareFormRegion: "#share-form"
        },

        modal: null,

        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            this.router = new Router({ app: this});
            Backbone.history.start();
        },
        initialize: function (options) {
            _.extend(this, options);
            this.username = username;

            Marionette.Application.prototype.initialize.apply(this, [options]);

            //add views to regions:
            this.loadRegions();
            this.modal = new Modal();
            this.listenTo(this.vent, 'share-project', this.showShareForm);
            this.listenTo(this.vent, 'hide-modal', this.hideShareForm);
            this.addMessageListeners();
        },

        loadRegions: function () {
            this.showProjectList();
            this.showToolbar();
        },

        showShareForm: function (opts) {
            var shareFormView = new ShareForm({
                    app: this,
                    model: opts.model
                }),
                title = ((opts.model && opts.model.get("name"))
                            ? "Update " + opts.model.get("name") + " Settings" :
                            "Create New Project");
            this.modal.update({
                view: shareFormView,
                title: title,
                width: 500,
                // bind the scope of the save function to the source view:
                saveFunction: shareFormView.saveProjectSettings.bind(shareFormView),
                showDeleteButton: opts.model != null,
                deleteFunction: shareFormView.deleteProject.bind(shareFormView)
            });
            this.modal.show();
        },
        hideShareForm: function () {
            this.modal.hide();
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
