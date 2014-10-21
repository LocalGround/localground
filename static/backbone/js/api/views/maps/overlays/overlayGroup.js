define(['marionette',
        'config',
        'jquery',
        'underscore'
    ],
    function (Marionette, Config, $, _) {
        'use strict';
        /**
         * The top-level view class that harnesses all of the map editor
         * functionality. Also coordinates event triggers across all of
         * the constituent views.
         * @class OverlayGroup
         */
        var OverlayGroup = Marionette.CollectionView.extend({
            /** A google.maps.Map object */
            map: null,

            initialize: function (opts) {
                $.extend(this, opts);
                this.collection = opts.collection;
                var configKey = this.collection.key.split("_")[0],
                    that = this;
                this.opts = opts;
                this.map = this.app.getMap();
                this.key = this.collection.key;
                this.childView = Config[configKey].Overlay;
                this.childViewOptions = _.extend({}, opts, {
                    infoBubbleTemplates: {
                        InfoBubbleTemplate: _.template(Config[configKey].InfoBubbleTemplate),
                        TipTemplate: _.template(Config[configKey].TipTemplate)
                    }
                });

                //Rerender photos on map zoom
                google.maps.event.addListener(this.map, 'zoom_changed', function () {
                    if (that.key !== 'photos') {
                        return;
                    }
                    for (var key in that.overlays) {
                        var overlay = that.overlays[key];
                        overlay.getGoogleOverlay().setIcon(overlay.getIcon());
                    }
                });

                //listen for new data:

                this.listenTo(this.collection, 'zoom-to-extent', this.zoomToExtent);
                this.listenTo(this.collection, 'show-all', this.showAll);
                this.listenTo(this.collection, 'hide-all', this.hideAll);
                //Have to manually render since this is an abstract view
                //attached to map elements rather than the DOM
                this.render();
            },

            /** Shows all of the map overlays */
            showAll: function () {
                this.isVisible = true;
                this.children.each(function (overlay) {
                    overlay.show();
                });
            },

            /** Hides all of the map overlays */
            hideAll: function () {
                this.isVisible = false;
                this.children.each(function (overlay) {
                    overlay.hide();
                });
            },

            /** Zooms to the extent of the collection */
            zoomToExtent: function () {
                var bounds = new google.maps.LatLngBounds();
                for (var key in this.overlays) {
                    try {
                        //for polylines, polygons, and groundoverlays:
                        bounds.union(this.overlays[key].overlay.getBounds());
                    }
                    catch (e) {
                        //for points:
                        bounds.extend(this.overlays[key].getCenter());
                    }
                }
                this.map.fitBounds(bounds);
            }

        });
        return OverlayGroup;
    });
