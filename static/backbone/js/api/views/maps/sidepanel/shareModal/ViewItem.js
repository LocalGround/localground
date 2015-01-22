define(["marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/modals/viewItem.html",
        "models/view"
    ],
    function (Marionette, _, $, viewItem) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * share view modal
         * @class DataPanel
         */

        var ViewItem = Marionette.ItemView.extend({
            tagName: 'a',
            className: 'view-item list-group-item',
            /**
             * @lends localground.maps.views.DataPanel#
             */
            template: function (model) {
                return _.template(viewItem, _.extend({}, model, {urlRoot: document.location.origin}));
            },

            events: {
            },

            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.id = 'view-item-' + this.model.id;
                this.el.id = this.id;
            }
        });
        return ViewItem;
    });