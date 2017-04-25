define([
    "underscore",
    "handlebars",
    "marionette",
    "lib/modals/modal",
    "collections/maps",
    "views/generate-print",
    "text!../templates/toolbar-global.html"
], function (_, Handlebars, Marionette,
             Modal, Maps, PrintLayoutView, ToolbarTemplate) {
    "use strict";
    var Toolbar = Marionette.ItemView.extend({
        template: Handlebars.compile(ToolbarTemplate),
        previewURL: null,
        templateHelpers: function () {
            return {
                activeTab: this.app.activeTab,
                name: this.model.get("name") === "Untitled" ? "" : this.model.get("name"),
                previewURL: this.previewURL,
                screenType: this.app.screenType
            };
        },

        events: {
            'click .print-button': "showModal"
        },

        modal: null,

        initialize: function (opts) {
            _.extend(this, opts);
            if (this.app.dataManager) {
                this.model = this.app.dataManager.model;
            }
            this.app.activeTab = "data";
            if (this.app.screenType == "style") {
                this.app.activeTab = "style";
            }

            this.modal = new Modal();

            Marionette.ItemView.prototype.initialize.call(this);
            this.listenTo(this.app.vent, 'data-loaded', this.setModel);
            this.getPreviewMap();
        },

        getPreviewMap: function () {
            var that = this;
            this.maps = new Maps();
            this.maps.setServerQuery("WHERE project = " + this.app.getProjectID());
            this.maps.fetch({
                reset: true,
                success: function (collection) {
                    if (collection.length > 0) {
                        that.previewURL = collection.at(0).get("slug");
                        that.render();
                    }
                }
            });
        },

        showModal: function (opts) {
            ///*
            var printLayout = new PrintLayoutView({
                app: this.app
            });
            //*/
            this.modal.update({
                view: printLayout,
                title: 'Generate Print',
                width: 1200,
                height: 500,
                closeButtonText: "Done",
                showSaveButton: false,
                showDeleteButton: false
                // bind the scope of the save function to the source view:
                //saveFunction: createForm.saveFormSettings.bind(createForm)
            });
            this.modal.show();
        },

        setModel: function () {
            this.model = this.app.dataManager.model;
            this.render();
        }
    });
    return Toolbar;
});
