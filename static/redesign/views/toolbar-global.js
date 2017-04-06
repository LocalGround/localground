define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "lib/modals/modal",
    "views/generate-print",
    "text!../templates/toolbar-global.html"
], function ($, _, Handlebars, Marionette, Modal, GeneratePrintView, ToolbarTemplate) {
    "use strict";
    var Toolbar = Marionette.ItemView.extend({
        template: Handlebars.compile(ToolbarTemplate),

        templateHelpers: function () {
            return {
                activeTab: this.app.activeTab,
                name: this.model.get("name") === "Untitled" ? "" : this.model.get("name")
            };
        },

        events: {
            "click .print": "openPrintModal"
        },

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
        },

        setModel: function () {
            this.model = this.app.dataManager.model;
            this.render();
        },

        openPrintModal: function () {
            var generatePrintView = new GeneratePrintView({
                app: this.app
            });
            this.modal.update({
                view: generatePrintView,
                title: 'Generate Print',
                width: 800,
                height: 500,
                showSaveButton: true,
                saveButtonText: 'Print',
                showDeleteButton: false
                // bind the scope of the save function to the source view:
                //saveFunction: createForm.saveFormSettings.bind(createForm)
            });
            this.modal.show();
        }
    });
    return Toolbar;
});