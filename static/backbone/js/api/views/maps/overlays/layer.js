define(['marionette',
        'config',
        'jquery',
        'underscore',
        'views/maps/overlays/symbol',
        'lib/maps/overlays/symbolized'
    ],
    function (Backbone, Config, $, _, Symbol, Symbolized) {
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
            //models: null,
            //overlays: null,
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
                this.overlays = [];
                this.symbols = [];
                this.parseLayerItem();
                this.app.vent.on("filter-applied", this.redraw.bind(this));
            },

            parseLayerItem: function () {
                var symbol, key, i;
                for (i = 0; i < this.layerItem.children.length; i++) {
                    symbol = new Symbol(this.layerItem.children[i]);
                    for (key in this.dataManager.collections) {
                        this.addMatchingModels(symbol, this.dataManager.collections[key]);
                    }
                    this.symbols.push(symbol);
                }
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
                    this.overlays.push(new Symbolized(opts));
                }
            },


            /** Shows all of the map overlays */
            showAll: function () {
                this.isVisible = true;
                var i;
                for (i = 0; i < this.overlays.length; i++) {
                    this.overlays[i].show();
                }
            },

            /** Hides all of the map overlays */
            hideAll: function () {
                this.isVisible = false;
                var i;
                for (i = 0; i < this.overlays.length; i++) {
                    this.overlays[i].hide();
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
                    i;
                for (i = 0; i < this.overlays.length; i++) {
                    bounds.union(this.overlays[i].getBounds());
                }
                this.map.fitBounds(bounds);
            }

        });
        return Layer;
    });
