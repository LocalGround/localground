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
                'click .sort-asc': 'itemClicked',
                'click .sort-desc': 'itemClicked',
                'click .insert-col-before': 'itemClicked',
                'click .insert-col-after': 'itemClicked',
                'click .duplicate-col': 'itemClicked',
                'click .delete-col': 'itemClicked',
                'click .set-title-field': 'itemClicked'
            },

            initialize: function (opts) {
                _.extend(this, opts);
                this.modal = this.app.modal;
            },

            template: Handlebars.compile(ContextMenuTemplate),
            itemClicked: function (e) {
                console.log('Clicked:', e);
            }

        });
        return SpreadsheetMenu;
    });
