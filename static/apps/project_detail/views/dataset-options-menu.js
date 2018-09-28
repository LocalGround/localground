define(["underscore",
        "marionette",
        "handlebars",
        "text!../templates/dataset-options-menu.html",
        "lib/spreadsheet/views/layout"
        ],
    function (_, Marionette, Handlebars, DatasetOptionsMenuTemplate, SpreadsheetLayout) {
        'use strict';

        var MapOptionsMenu =  Marionette.ItemView.extend({
            events: {
                'click .open-dataset': 'openSpreadsheet'
            },

            initialize: function (opts) {
                _.extend(this, opts);
                this.modal = this.app.modal;
                console.log(this.model);
            },

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

      
            template: Handlebars.compile(DatasetOptionsMenuTemplate),

            
        });
        return MapOptionsMenu;
    });
