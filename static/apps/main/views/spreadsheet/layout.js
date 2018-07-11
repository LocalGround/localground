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
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(LayoutTemplate);
            },
            onRender: function () {
                this.showSpreadsheet();
            },

            showMenu: function () {
                console.log('showMenu');
            },
            showSpreadsheet: function () {
                const spreadsheet = new Spreadsheet({
                    app: this.app,
                    collection: this.collection,
                    fields: this.collection.getFields(),
                    //width: '100%',
                    height: $(window).height() - 180
                });
                this.spreadsheetRegion.show(spreadsheet)
            }

        });
        return SpreadsheetLayout;
    });
