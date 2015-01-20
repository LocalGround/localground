define(["marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/modals/viewItem.html",
        "models/view"
    ],
    function (Marionette, _, $, viewItem, View) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * share view modal
         * @class DataPanel
         */

        var ViewItem = Marionette.ItemView.extend({
            class: 'view-item',
            /**
             * @lends localground.maps.views.DataPanel#
             */
            template: function (model) {
                return _.template(viewItem, model);
            },

            events: {
            },

            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
            }
        });
        return ViewItem;
    });