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
                'click #add-row': 'addRow'
            },
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(LayoutTemplate);
            },
            onRender: function () {
                this.showSpreadsheet();
            },
            addRow: function (e) {
                this.getSpreadsheet().addRow();
                if (e) {
                    e.preventDefault();
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
                        height: $(window).height() - 180
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
