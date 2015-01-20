define(["marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/modals/shareModal.html",
        "collections/views",
        "views/maps/sidepanel/shareModal/viewItem"
    ],
    function (Marionette, _, $, shareModal, Views, ViewItem) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * share view modal
         * @class DataPanel
         */

        var ShareModal = Marionette.CompositeView.extend({
            id: 'share-modal',
            childView: ViewItem,

            childViewContainer: "#view-list-container",
            /**
             * @lends localground.maps.views.DataPanel#
             */
            template: function () {
                return _.template(shareModal);
            },

            events: {
            },

            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.collection = new Views();
                this.app.vent.trigger('load-view-list', this.collection);
            }
        });
        return ShareModal;
    });