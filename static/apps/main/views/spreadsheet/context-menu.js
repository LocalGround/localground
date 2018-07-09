define(["underscore",
        "marionette",
        "handlebars",
        "text!../../templates/spreadsheet/context-menu.html",
        "apps/main/views/left/edit-layer-name-modal-view",
        "apps/main/views/left/edit-display-field-modal-view",
    ],
    function (_, Marionette, Handlebars, ContextMenuTemplate) {
        'use strict';

        var SpreadsheetMenu =  Marionette.ItemView.extend({
            events: {
                'click .sort-asc': 'sortAsc',
                'click .sort-desc': 'sortDesc',
                'click .insert-col-before': 'itemClicked',
                'click .insert-col-after': 'itemClicked',
                'click .duplicate-col': 'itemClicked',
                'click .delete-col': 'deleteColumn',
                'click .set-title-field': 'itemClicked'
            },

            initialize: function (opts) {
                _.extend(this, opts);
                this.modal = this.app.modal;
            },

            template: Handlebars.compile(ContextMenuTemplate),
            itemClicked: function (e) {
                console.log('Clicked:', e);
            },
            sortAsc: function (e) {
                this.sort('asc');
            },
            sortDesc: function (e) {
                this.sort('desc');
            },
            sort: function (direction) {
                /*
                MEGA HACK:
                https://github.com/handsontable/handsontable/blob/master/src/plugins/columnSorting/columnSorting.js
                */
                this.table.sortOrder = !this.table.sortOrder;
                if (direction === 'asc') {
                    this.table.sortOrder = undefined;
                } else {
                    this.table.sortOrder = true;
                }
                const oldSort = this.table.sortOrder;
                console.log(this.table.sortOrder);
                this.table.sort(this.columnID);
                if (oldSort === this.table.sortOrder === true) {
                    //yet another hack:
                    this.table.sort(this.columnID);
                }
                console.log(this.table.sortOrder);
            },
            deleteColumn: function (e) {
                e.preventDefault();
                if (!confirm("Do you want to delete this field?")){
                    return;
                }
                this.fields.at(this.columnID).destroy({
                    success: () => {
                        this.app.vent.trigger('render-spreadsheet');
                    },
                    error: (e) => {
                        console.error(e)
                    }
                });
            }

        });
        return SpreadsheetMenu;
    });
