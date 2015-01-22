define(['marionette',
        'config',
        'underscore',
        'lib/maps/overlays/symbolized'
    ],
    function (Marionette, Config, _, Symbolized) {
        'use strict';
        /**
         * The top-level view class that harnesses all of the map editor
         * functionality. Also coordinates event triggers across all of
         * the constituent views.
         * @class OverlayGroup
         */
        var Layer = Marionette.ItemView.extend({
            /** A google.maps.Map object */
            map: null,
            dataManager: null,
            overlayMap: null,
            model: null,
            isShowingOnMap: false,
            symbols: null,
            modelEvents: {
                'change:isShowingOnMap': 'redraw',
                'symbol-change': 'renderSymbol',
                'zoom-to-layer': 'zoomToExtent'
            },
            initialize: function (opts) {
                this.app = opts.app;
                this.model = opts.model; //a sidepanel LayerItem object
                this.dataManager = this.app.dataManager;
                this.map = this.app.map;
                this.overlayMap = {};
                this.parseLayerItem();
                this.listenTo(this.app.vent, 'selected-projects-updated', this.parseLayerItem);
                this.app.vent.on("filter-applied", this.redraw.bind(this));
            },
            onBeforeDestroy: function () {
                var that = this;
                _.each(this.model.getSymbols(), function (symbol) {
                    that.clear(symbol);
                });
            },
            redraw: function () {
                if (this.model.get("isShowingOnMap")) {
                    this.model.showSymbols();
                } else {
                    this.model.hideSymbols();
                }
                this.render();
            },
            getSymbolOverlays: function (rule) {
                return this.overlayMap[rule];
            },
            getLayerOverlays: function () {
                var overlays = [],
                    rule;
                for (rule in this.overlayMap) {
                    overlays = overlays.concat(this.getSymbolOverlays(rule));
                }
                return overlays;
            },
            renderSymbol: function (rule) {
                _.each(this.getSymbolOverlays(rule), function (overlay) {
                    overlay.redraw();
                });
            },
            render: function () {
                var rule;
                for (rule in this.overlayMap) {
                    this.renderSymbol(rule);
                }
            },
            parseLayerItem: function () {
                var that = this;
                _.each(this.model.getSymbols(), function (symbol) {
                    //clear out old overlays and models
                    that.clear(symbol);
                    _.each(_.values(that.dataManager.collections), function (collection) {
                        that.addMatchingModels(symbol, collection);
                    });
                });
            },
            clear: function (symbol) {
                symbol.models = [];
                this.hideSymbol(symbol.rule);
                //once hidden, remove all symbolized map overlay objects for g.c.
                this.overlayMap[symbol.rule] = [];
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
                    if (this.overlayMap[symbol.rule] == null) {
                        this.overlayMap[symbol.rule] = [];
                    }
                    this.overlayMap[symbol.rule].push(new Symbolized(opts));
                }
            },

            hideSymbol: function (rule) {
                var i;
                if (!this.overlayMap[rule]) {
                    return;
                }
                for (i = 0; i < this.overlayMap[rule].length; i++) {
                    this.overlayMap[rule][i].hide();
                }
            },


            /** Zooms to the extent of the collection */
            zoomToExtent: function () {
                var bounds = new google.maps.LatLngBounds(),
                    i,
                    key;
                for (key in this.overlayMap) {
                    for (i = 0; i < this.overlayMap[key].length; i++) {
                        bounds.union(this.overlayMap[key][i].getBounds());
                    }
                }
                if (!bounds.isEmpty()) {
                    this.map.fitBounds(bounds);
                }
            }

        });
        return Layer;
    });
