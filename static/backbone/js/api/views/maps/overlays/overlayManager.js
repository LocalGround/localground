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
             * @param {Object} opts
             */
            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.listenTo(this.app.vent, "new-collection-created", this.createOverlayGroup);
                this.listenTo(this.app.vent, 'zoom-to-extent', this.zoomToExtent);
                this.overlayGroups = {};
            },

            createOverlayGroup: function (data) {
                var opts = _.clone(this.opts);
                opts = _.extend(opts, data);
                this.overlayGroups[opts.collection.key] = new OverlayGroup(opts);
            },

            destroy: function () {
                this.remove();
            },

            getMarkerOverlays: function () {
                return this.overlayGroups.markers || [];
            },

            getSites: function () {
                //returns a list of everything that isn't a media type
                var key,
                    overlays = [],
                    cv;
                for (key in this.overlayGroups) {
                    if (['photos', 'audio', 'map-images'].indexOf(key) == -1) {
                        cv = this.overlayGroups[key];
                        cv.children.each(function (view) {
                            overlays.push(view);
                        });
                        //overlays = overlays.concat(this.overlayGroups[key].children);
                        //console.log(key, this.overlayGroups[key].children);
                    } else {
                        console.log(key);
                    }
                }
                console.log(overlays);
                return overlays;
            }
        });
        return OverlayManager;
    });
