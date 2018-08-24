define(["marionette",
        "handlebars",
        "apps/main/views/spreadsheet/spreadsheet",
        'apps/main/views/spreadsheet/rename-dataset',
        "text!../../templates/spreadsheet/layout.html"
    ],
    function (Marionette, Handlebars, Spreadsheet, RenameDataset, LayoutTemplate)  {
        'use strict';
        const SpreadsheetLayout = Marionette.LayoutView.extend({
            regions: {
                spreadsheetRegion: '.spreadsheet-container',
                toolbarRegion: '.spreadsheet-toolbar'
            },
            events: {
                'click .title': 'openRenameForm'
            },
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(LayoutTemplate);
                this.secondaryModal = this.app.secondaryModal;
            },
            onRender: function () {
                this.showSpreadsheet();
            },
            openRenameForm: function (e) {
                const renameDatasetForm = new RenameDataset({
                    app: this.app,
                    model: this.collection.getForm(),
                    dataset: this.collection,
                    sourceModal: this.secondaryModal
                });

                this.secondaryModal.update({
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
                this.secondaryModal.show();
                if (e) {
                    e.preventDefault();
                }
            },
            updateDatasetName: function () {
                const formModel = this.collection.getForm();
                this.$el.find('.title h1').html(formModel.get('name'));
            },
            // addRow: function (e) {
            //     this.getSpreadsheet().addRow();
            //     if (e) {
            //         e.preventDefault();
            //     }
            // },
            templateHelpers: function () {
                return {
                    dataset_name: this.collection.getDatasetName()
                }
            },

            getSpreadsheet: function () {
                if (!this.spreadsheet) {
                    this.spreadsheet = new Spreadsheet({
                        app: this.app,
                        collection: this.collection,
                        fields: this.collection.getFields(),
                        layer: this.layer,
                        height: $(window).height() - 160
                    });
                }
                return this.spreadsheet;
            },
            showSpreadsheet: function () {
                this.spreadsheetRegion.show(this.getSpreadsheet());
            }

        });
        return SpreadsheetLayout;
    });
