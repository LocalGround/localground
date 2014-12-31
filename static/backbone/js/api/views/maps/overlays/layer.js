define(['marionette',
        'config',
        'jquery',
        'underscore',
        'lib/maps/overlays/symbolized'
    ],
    function (Backbone, Config, $, _, Symbolized) {
        'use strict';
        /**
         * The top-level view class that harnesses all of the map editor
         * functionality. Also coordinates event triggers across all of
         * the constituent views.
         * @class OverlayGroup
         */
        var Layer = Backbone.View.extend({
            /** A google.maps.Map object */
            map: null,
            dataManager: null,
            layerItem: null,
            overlays: null,
            isVisible: false,
            symbols: null,

            initialize: function (opts) {
                $.extend(this, opts);
                this.dataManager = opts.dataManager;
                this.layerItem = opts.layerItem;
                this.map = opts.basemap.map;
                this.overlays = {};
                this.symbols = [];
                this.parseLayerItem();
                //this.app.vent.on("filter-applied", this.redraw.bind(this));
                this.listenTo(this.app.vent, 'selected-projects-updated', this.parseLayerItem);
                this.app.vent.on("filter-applied", this.redraw.bind(this));
            },

            parseLayerItem: function () {
                console.log("parseLayerItem");
                var that = this;
                this.symbols = this.layerItem.getSymbols();
                _.each(this.symbols, function (symbol) {
                    //clear out old overlays and models
                    that.clear(symbol);
                    _.each(_.values(that.dataManager.collections), function (collection) {
                        that.addMatchingModels(symbol, collection);
                    });
                });
            },

            clear: function (symbol) {
                symbol.models = [];
                this.hide(symbol.rule);
                this.overlays[symbol.rule] = [];
            },

            addMatchingModels: function (symbol, collection) {
                var match = false,
                    that = this;
                collection.each(function (model) {
                    match = symbol.checkModel(model);
                    if (match) {
                        symbol.addModel(model);
                        that.addOverlay(symbol, model);
                    }
                });
            },

            addOverlay: function (symbol, model) {
                var configKey,
                    opts;
                if (model.get('geometry') != null) {
                    configKey = model.getKey().split("_")[0];
                    opts = {
                        app: this.app,
                        model: model,
                        symbol: symbol,
                        map: this.map,
                        infoBubbleTemplates: {
                            InfoBubbleTemplate: _.template(Config[configKey].InfoBubbleTemplate),
                            TipTemplate: _.template(Config[configKey].TipTemplate)
                        }
                    };
                    if (this.overlays[symbol.rule] == null) {
                        this.overlays[symbol.rule] = [];
                    }
                    this.overlays[symbol.rule].push(new Symbolized(opts));
                }
            },

            /** Shows all of the map overlays */
            show: function (rule) {
                var i;
                if (!this.overlays[rule]) {
                    return;
                }
                for (i = 0; i < this.overlays[rule].length; i++) {
                    this.overlays[rule][i].show();
                }
            },


            /** Shows all of the map overlays */
            showAll: function () {
                this.isVisible = true;
                var key;
                for (key in this.overlays) {
                    this.show(key);
                }
            },

            /** Hides all of the map overlays */
            hide: function (rule) {
                var i;
                if (!this.overlays[rule]) {
                    return;
                }
                for (i = 0; i < this.overlays[rule].length; i++) {
                    this.overlays[rule][i].hide();
                }
            },

            /** Hides all of the map overlays */
            hideAll: function () {
                this.isVisible = false;
                var key;
                for (key in this.overlays) {
                    this.hide(key);
                }
            },

            redraw: function () {
                if (this.isVisible) {
                    this.showAll();
                }
            },

            /** Zooms to the extent of the collection */
            zoomToExtent: function () {
                //console.log("zoom to extent");
                var bounds = new google.maps.LatLngBounds(),
                    i,
                    key;
                for (key in this.overlays) {
                    for (i = 0; i < this.overlays[key].length; i++) {
                        bounds.union(this.overlays[key][i].getBounds());
                    }
                }
                this.map.fitBounds(bounds);
            }

        });
        return Layer;
    });
