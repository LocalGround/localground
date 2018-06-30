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
                'click .sort': 'sort',
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
            sort: function (e) {
                this.table.sort(this.columnID);
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
