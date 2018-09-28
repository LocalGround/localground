define(["underscore",
        "marionette",
        "handlebars",
        "apps/project_detail/views/map-options-menu",
        "lib/spreadsheet/views/layout",
        "text!../templates/map-item.html"
    ],
    function (_, Marionette, Handlebars, MapOptionsMenu, SpreadsheetLayout, MapItemTemplate) {
        'use strict';
        var MapItem = Marionette.ItemView.extend({

            template: Handlebars.compile(MapItemTemplate),

            initialize: function (opts) {
                _.extend(this, opts);

                this.popover = this.app.popover;
                this.modal = this.app.modal;

                this.render();
            },
            className: 'project_map-item',
            templateHelpers: function () {
                // let datasetList = this.model.get('layers').models.map((layer) => {
                //     return layer.get('dataset').overlay_type
                // });

                // let uniqueSet = Array.from(new Set(datasetList))

                return {
                    datasetList: this.getDatasetInfo(this.model),
                    accessLevel: this.getAccessLevel(this.model.get('metadata').accessLevel)
                };
            },
            events: {
                'click .fa-ellipsis-v': 'showMenu',
                'click .map_dataset-item': 'openSpreadsheet'
            },

            modelEvents: {
                'change:name': 'render'
            },

            getDatasetInfo: function(projectMap) {
                let datasetList = projectMap.get('layers').models.map((layer) => {
                    return layer.get('dataset').overlay_type
                });

                let uniqueSet = Array.from(new Set(datasetList));
                let finalInfo = uniqueSet.map((dataset) => {
                    const info = {
                        name: this.app.dataManager.getCollection(dataset).name,
                        alias: dataset
                    }
                    return info
                });
                return finalInfo;
            },

            getAccessLevel: function(accessVal) {
                switch(accessVal) {
                    case 1:
                        return 'Public'
                        break;
                    case 2:
                    return 'Anyone with link'
                        break;
                    case 3:
                    return 'Password protected'
                        break;
                }
            },

            showMenu: function(e) {
                this.popover.update({
                    $source: e.target,
                    view: new MapOptionsMenu({
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
                    collection: this.app.dataManager.getCollection(e.target.dataset.alias),
                    layer: null
                });
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
                //this.popover.hide();
                this.modal.show();
            },

        });
        return MapItem;
    });