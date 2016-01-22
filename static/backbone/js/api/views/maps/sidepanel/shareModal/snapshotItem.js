define(["marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/modals/snapshotItem.html",
        "models/snapshot"
    ],
    function (Marionette, _, $, snapshotItem) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * share view modal
         * @class DataPanel
         */

        var SnapshotItem = Marionette.ItemView.extend({
            tagName: 'a',
            className: 'snapshot-item list-group-item',
            /**
             * @lends localground.maps.views.DataPanel#
             */
            template: function (model) {
                if (!model.caption) {
                    model.caption = '';
                }
                return _.template(snapshotItem, _.extend({}, model, {urlRoot: document.location.origin}));
            },

            events: {
            },

            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.id = 'snapshot-item-' + this.model.id;
                this.el.id = this.id;
            }
        });
        return SnapshotItem;
    });