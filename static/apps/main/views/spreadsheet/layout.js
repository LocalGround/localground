define(["marionette",
        "handlebars",
        "apps/main/views/spreadsheet/spreadsheet",
        "text!../../templates/spreadsheet/layout.html"
    ],
    function (Marionette, Handlebars, Spreadsheet, LayoutTemplate)  {
        'use strict';
        const SpreadsheetLayout = Marionette.LayoutView.extend({
            regions: {
                spreadsheetRegion: '.spreadsheet-container',
                toolbarRegion: '.spreadsheet-toolbar'
            },
            events: {
                'click #add-row': 'addRow',
                'click .title': 'openRenameForm'
            },
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(LayoutTemplate);
            },
            onRender: function () {
                this.showSpreadsheet();
            },
            openRenameForm: function () {
                alert('rename!');
            },
            addRow: function (e) {
                this.getSpreadsheet().addRow();
                if (e) {
                    e.preventDefault();
                }
            },
            templateHelpers: function () {
                return {
                    dataset_name: this.collection.name
                }
            },

            showMenu: function () {
                console.log('showMenu');
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
