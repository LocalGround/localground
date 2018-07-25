define(["underscore",
        "marionette",
        "handlebars",
        'apps/main/views/spreadsheet/rename-field',
        'apps/main/views/spreadsheet/add-field',
        "text!../../templates/spreadsheet/context-menu.html",
        "lib/modals/modal"
    ],
    function (_, Marionette, Handlebars, RenameField, AddField, ContextMenuTemplate, Modal) {
        'use strict';

        var SpreadsheetMenu =  Marionette.ItemView.extend({
            events: {
                'click .sort-asc': 'sortAsc',
                'click .sort-desc': 'sortDesc',
                'click .insert-col-before': 'addFieldBefore',
                'click .insert-col-after': 'addFieldAfter',
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
                    dataset: this.collection,
                    sourceModal: this.secondaryModal
                });

                this.secondaryModal.update({
                    app: this.app,
                    view: renameFieldForm,
                    title: 'Rename Column',
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
                this.table.sort(this.columnID);
                if (oldSort === this.table.sortOrder === true) {
                    //yet another hack:
                    this.table.sort(this.columnID);
                }
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
                this.popover.hide();
            },

            addField: function (ordering, e) {
                const addFieldForm = new AddField({
                    app: this.app,
                    dataset: this.collection,
                    sourceModal: this.secondaryModal,
                    ordering: ordering
                });

                this.secondaryModal.update({
                    app: this.app,
                    view: addFieldForm,
                    title: 'Add New Column',
                    width: '300px',
                    showSaveButton: true,
                    saveFunction: addFieldForm.saveField.bind(addFieldForm),
                    showDeleteButton: false
                });
                this.secondaryModal.show();
                this.popover.hide();
                if (e) {
                    e.preventDefault();
                }
            },
            addFieldBefore: function (e) {
                this.addField(this.columnID, e);
            },
            addFieldAfter: function (e) {
                this.addField(this.columnID + 1, e);
            }

        });
        return SpreadsheetMenu;
    });
