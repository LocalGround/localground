define(["underscore",
        "marionette",
        "handlebars",
        "apps/project_detail/views/dataset-options-menu",
        "lib/spreadsheet/views/layout",
        "text!../templates/dataset-item.html"
    ],
    function (_, Marionette, Handlebars, DatasetOptionsMenu, SpreadsheetLayout, DatasetItemTemplate) {
        'use strict';
        var DatasetItem = Marionette.ItemView.extend({

            template: Handlebars.compile(DatasetItemTemplate),

            initialize: function (opts) {
                _.extend(this, opts);
                this.render();
                console.log('dataset ', this.model);
                
            },

            templateHelpers: function() {
                const recordCount = this.model.get('models').length
                return {
                    recordCount: recordCount
                }
            },

            className: 'dataset-item',
            events: {
                'click .fa-ellipsis-v': 'showMenu',
                'click .dataset-item_name': 'openSpreadsheet'
            },

            showMenu: function(e) {
                this.app.popover.update({
                    $source: e.target,
                    view: new DatasetOptionsMenu({
                        app: this.app,
                        model: this.model
                    }),
                    placement: 'bottom',
                    width: '150px'
                });
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
                this.app.modal.update({
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
                this.app.modal.show();
            }
        });
        return DatasetItem;
    });