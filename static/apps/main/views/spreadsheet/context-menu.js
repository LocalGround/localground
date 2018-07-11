define(["underscore",
        "marionette",
        "handlebars",
        'apps/main/views/spreadsheet/rename-field',
        "text!../../templates/spreadsheet/context-menu.html",
        "lib/modals/modal"
    ],
    function (_, Marionette, Handlebars, RenameField, ContextMenuTemplate, Modal) {
        'use strict';

        var SpreadsheetMenu =  Marionette.ItemView.extend({
            events: {
                'click .sort-asc': 'sortAsc',
                'click .sort-desc': 'sortDesc',
                'click .insert-col-before': 'itemClicked',
                'click .insert-col-after': 'itemClicked',
                'click .duplicate-col': 'itemClicked',
                'click .delete-col': 'deleteColumn',
                'click .rename-col': 'renameColumn'
            },

            initialize: function (opts) {
                _.extend(this, opts);
                this.modal = this.app.modal;
                this.popover = this.app.popover;
                this.secondaryModal = new Modal({
                    app: this.app
                });
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
            renameColumn: function (e) {
                const renameFieldForm = new RenameField({
                    app: this.app,
                    model: this.field,
                    layer: this.layer,
                    sourceModal: this.secondaryModal
                });

                this.secondaryModal.update({
                    app: this.app,
                    view: renameFieldForm,
                    title: 'Rename Field',
                    width: '300px',
                    showSaveButton: true,
                    saveFunction: renameFieldForm.saveField.bind(renameFieldForm),
                    showDeleteButton: false
                });
                this.secondaryModal.show();
                this.popover.hide();
                if (e) {
                    e.preventDefault();
                }
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
