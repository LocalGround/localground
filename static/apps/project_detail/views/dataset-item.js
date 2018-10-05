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
                console.log('dataset ', this.model);
                
            },

            templateHelpers: function() {
                const recordCount = this.model.get('models').length
                return {
                    recordCount: recordCount,
                    matchingMaps: this.getMatchingMaps()
                }
            },

            className: 'dataset-item',
            events: {
                'click .fa-ellipsis-v': 'showMenu',
                'click .dataset-item_name': 'openSpreadsheet'
            },

            modelEvents: {
                'change:name': 'render',
                'change:description': 'render'
            },

            getMatchingMaps: function() {
                const project_id = this.model.get('project_id');
                let matchingMaps = [];

                this.app.dataManager.getMaps().each((map) => {
                    let mapUsesDataset = false
                    map.getLayers().each((layer) => {
                        if (layer.getDataset(this.app.dataManager).dataType === this.model.get('dataType')) {
                            mapUsesDataset = true;
                        }
                    });
                    if (mapUsesDataset) {
                        matchingMaps.push({
                            name: map.get('name'),
                            id: map.get('id'),
                            mapUrl: `/projects/${project_id}/maps/#/${map.get('id')}`
                        })
                    } 
                });
                return matchingMaps;
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
                //this.app.popover.hide();
                this.app.modal.show();
            }
        });
        return DatasetItem;
    });