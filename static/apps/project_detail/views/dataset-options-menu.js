define(["underscore",
        "marionette",
        "handlebars",
        "text!../templates/dataset-options-menu.html",
        'lib/spreadsheet/views/rename-dataset',
        "lib/spreadsheet/views/layout"
        ],
    function (_, Marionette, Handlebars, DatasetOptionsMenuTemplate, RenameDataset, SpreadsheetLayout) {
        'use strict';

        var MapOptionsMenu =  Marionette.ItemView.extend({
            events: {
                'click .open-dataset': 'openSpreadsheet',
                'click .rename-dataset': 'renameDataset'
            },

            initialize: function (opts) {
                _.extend(this, opts);
                this.modal = this.app.modal;
                console.log(this.model);
            },

            template: Handlebars.compile(DatasetOptionsMenuTemplate),

            openSpreadsheet: function(e) {
                if (e) {
                    e.preventDefault();
                }
                const spreadsheet = new SpreadsheetLayout({
                    app: this.app,
                    collection: this.app.dataManager.getCollection(this.model.get('dataType')),
                    layer: null
                });
                console.log(this.app.dataManager.getCollection(this.model.get('dataType')));
                this.modal.update({
                    app: this.app,
                    view: spreadsheet,
                    noTitle: true,
                    noFooter: true,
                    width: '97vw',
                    modalClass: 'spreadsheet',
                    showSaveButton: false,
                    showDeleteButton: false
                });
                this.app.popover.hide();
                this.modal.show();
            },

            renameDataset: function() {
                const collection = this.app.dataManager.getCollection(this.model.get('dataType'));
                const renameDatasetForm = new RenameDataset({
                    app: this.app,
                    model: collection.getForm(),
                    dataset: this.collection,
                    sourceModal: this.modal
                });

                this.modal.update({
                    app: this.app,
                    view: renameDatasetForm,
                    title: 'Rename Dataset',
                    width: '300px',
                    showSaveButton: true,
                    saveFunction: () => {
                        renameDatasetForm.saveDataset.bind(renameDatasetForm)();
                        this.updateDatasetName();
                    },
                    showDeleteButton: false
                });
                this.modal.show();
                if (e) {
                    e.preventDefault();
                }
            },

            

            
        });
        return MapOptionsMenu;
    });
