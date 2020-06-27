define(["underscore",
        "marionette",
        "handlebars",
        "text!../templates/context-menu.html",
        "lib/modals/modal"
    ],
    function (_, Marionette, Handlebars, ContextMenuTemplate, Modal) {
        'use strict';

        var SpreadsheetMenu =  Marionette.ItemView.extend({
            events: {
                'click .sort-asc': 'sortAsc',
                'click .sort-desc': 'sortDesc',
                'click .insert-col-before': 'addFieldBefore',
                'click .insert-col-after': 'addFieldAfter',
                'click .duplicate-col': 'itemClicked',
                'click .delete-col': 'deleteField',
                'click .rename-col': 'editField'
            },

            initialize: function (opts) {
                _.extend(this, opts);
                this.fieldIndex = this.columnID - 3; //to account for admin columns
                this.modal = this.app.modal;
                this.popover = this.app.popover;
                this.secondaryModal = this.app.secondaryModal;
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
                this.table.sort(this.columnID);
                if (oldSort === this.table.sortOrder === true) {
                    //yet another hack:
                    this.table.sort(this.columnID);
                }
            },
            addFieldBefore: function (e) {
                //put the column in the same position as the reference column
                const ordering = this.fieldIndex + 1;
                this.app.vent.trigger('add-field', ordering);
                if (e) { e.preventDefault(); }
            },
            addFieldAfter: function (e) {
                //put the column one after the reference column
                const ordering = this.fieldIndex + 2;
                this.app.vent.trigger('add-field', ordering);
                if (e) { e.preventDefault(); }
            },
            editField: function (e) {
                this.app.vent.trigger('edit-field', this.fieldIndex);
                if (e) {
                    e.preventDefault();
                }
            },
            deleteField: function (e) {
                this.app.vent.trigger('delete-field', this.fieldIndex);
                if (e) { e.preventDefault(); }
            }

        });
        return SpreadsheetMenu;
    });
