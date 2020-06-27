define([
    "marionette",
    "backbone",
    "apps/project_detail/router",
    "lib/modals/modal",
    "lib/data/dataManager",
    "apps/project_detail/views/project-header",
    "apps/project_detail/views/project-info-container",
    "lib/popovers/popover",
    "lib/appUtilities",
    "lib/handlebars-helpers",
], function (Marionette, Backbone, Router, Modal, DataManager, ProjectHeaderView, InfoContainer, Popover, appUtilities) {
    "use strict";
    var ProjectDetailApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            breadcrumbRegion: '#breadcrumb',
            projectHeaderRegion: '.project_header',
            projectInfoRegion: '.project_info'
        },

        screenType: "presentation",
        showLeft: false,
        mode: "view",
        initialize: function (options) {
            options = options || {};
            Marionette.Application.prototype.initialize.apply(this, [options]);

            this.selectedProjectID = this.projectID = options.projectJSON.id;
            this.dataManager = new DataManager({
                vent: this.vent,
                projectJSON: options.projectJSON
            });
            this.popover = new Popover({
                app: this
            });

            this.modal = new Modal({
                app: this
            });
            this.model = this.dataManager.getProject(options.projectJSON.id)

            this.loadRegions();
        },
        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            //this.router = new Router({ app: this});
            Backbone.history.start();
        },
        fetchErrors: false,
        getMode: function () {
            return "view";
        },

        loadRegions: function () {
            this.showProjectHeader();
            this.showInfoSection();
        },

        showProjectHeader: function() {
            this.projectHeaderView = new ProjectHeaderView({
                model: this.model,
                app: this
            });
            this.projectHeaderRegion.show(this.projectHeaderView);
        },

        showInfoSection: function() {
            this.InfoContainer = new InfoContainer({
                model: this.model,
                app: this,
                collection: this.dataManager.getMaps()
            });
            this.projectInfoRegion.show(this.InfoContainer);
        }
    }));
    return ProjectDetailApp;
});
