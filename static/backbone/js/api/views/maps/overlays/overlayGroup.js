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
        var OverlayGroup = Marionette.View.extend({
            /**
             * @lends localground.maps.views.OverlayGroup#
             */

            /** A google.maps.Map object */
            map: null,

            /** A dictionary indexing the various
             * {@link localground.maps.overlays.Overlay} objects.
             */
            overlays: {},

            visibleItems: null,

            /** A Backbone.Collection object */
            collection: null,
            /**
             * Flag indicating whether or not the child elements should
             * be visible
             */
            isVisible: false,
            /** String that matches the collection's key */
            key: null,

            /**
             * Initializes the OverlayGroup with a dictionary of options,
             * and adds event listeners that pertain to OverlayGroup
             * operations (batch operations like turn on everything, or
             * zoom to extents).
             */
            initialize: function (opts) {
                $.extend(this, opts);
                this.opts = opts;
                this.map = this.app.getMap();
                this.overlays = {};
                this.visibleItems = {};
                this.key = this.collection.key;
                var that = this;

                //listen for new data:
                //this.collection.on('add', this.render, this);
                this.listenTo(this.collection, 'add', this.addOverlay);
                this.listenTo(this.collection, 'change', this.updateOverlay);
                this.listenTo(this.collection, 'zoom-to-extent', this.zoomToExtent);
                this.listenTo(this.collection, 'show-all', this.showAll);
                this.listenTo(this.collection, 'hide-all', this.hideAll);
                this.listenTo(this.collection, 'remove', this.removeItem);


                //listen for map zoom change, re-render photo icons:
                google.maps.event.addListener(this.map, 'zoom_changed', function () {
                    if (that.key !== 'photos') {
                        return;
                    }
                    for (var key in that.overlays) {
                        var overlay = that.overlays[key];
                        overlay.getGoogleOverlay().setIcon(overlay.getIcon());
                    }
                });
            },

            /**
             * A little tricky. Basically, this method is called every time
             * a new model is added to its corresponding collection in the
             * dataManager. The method creates a new overlay for each model
             * where the GeoJSON geometry is defined.
             * @param {Backbone.Model} model
             */
            addOverlay: function (model) {
                if (!model.get("geometry")) {
                    return;
                }
                var key = model.collection.key;
                var id = model.id;
                //retrieve the corresponding overlay type from the config.js.
                var configKey = key.split("_")[0];
                var opts = _.clone(this.opts);
                opts.model = model;
                //TODO: instantiate overlays
                this.overlays[id] = new Config[configKey].Overlay(opts);
                /*this.overlays[id] = this.sb.loadSubmodule(
                    "overlay-" + model.getKey() + "-" + model.id,
                    Config[configKey].Overlay,
                    { model: model }
                );*/
            },

            updateOverlay: function (model) {
                if (!model.get("geometry")) {
                    return;
                }
                var overlay = this.getOverlay(model);
                if (overlay) {
                    overlay.remove();
                }
                var key = model.collection.key;
                var id = model.id;
                //retrieve the corresponding overlay type from the config.js.
                var configKey = key.split("_")[0];
                var opts = _.clone(this.opts);
                opts.model = model;
                this.overlays[id] = new Config[configKey].Overlay(opts);
                /* TODO: instantiate overlaysf
                this.overlays[id] = this.sb.loadSubmodule(
                    "overlay-" + model.getKey() + "-" + model.id,
                    localground.config.Config[configKey].Overlay,
                    { model: model }
                );*/
                this.overlays[id].changeMode();
                this.overlays[id].show();
            },

            /** Shows all of the map overlays */
            showAll: function () {
                this.isVisible = true;
                for (var key in  this.overlays) {
                    this.overlays[key].show();
                }
            },

            /** Hides all of the map overlays */
            hideAll: function () {
                this.isVisible = false;
                for (var key in this.overlays) {
                    this.overlays[key].hide();
                }
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
            },

            /** Gets the overlay from the overlay dictionary */
            getOverlay: function (model) {
                return this.overlays[model.id];
            },
            destroy: function () {
                this.remove();
            },
            removeItem: function (model) {
                delete this.overlays[model.id];
            }
        });
        return OverlayGroup;
    });
