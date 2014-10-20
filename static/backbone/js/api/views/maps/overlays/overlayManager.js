define(["backbone",
        "underscore",
        "views/maps/overlays/overlayGroup"
    ],
    function (Backbone, _, OverlayGroup) {
        'use strict';
        /**
         * Controls a dictionary of overlayGroups
         * @class OverlayManager
         */
        var OverlayManager = Backbone.View.extend({
            /**
             * @lends localground.maps.views.OverlayManager#
             */

            /**
             * Initializes the object.
             * @param {Object} sb
             * Sandbox
             */
            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.listenTo(this.app.vent, "new-collection-created", this.createOverlayGroup);
                this.overlayGroups = [];
            },
            createOverlayGroup: function (data) {
                var opts = _.clone(this.opts);
                opts = _.extend(opts, data);
                this.overlayGroups.push(new OverlayGroup(opts));

            },
            destroy: function () {
                this.remove();
            }
        });
        return OverlayManager;
    });
