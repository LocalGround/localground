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
            overlays: null,
            model: null,
            isShowingOnMap: false,
            symbols: null,
            modelEvents: {
                'change:isShowingOnMap': 'redraw',
                'symbol-change': 'renderSymbol'
            },
            initialize: function (opts) {
                //console.log("initialize Layer!");
                this.app = opts.app;
                this.dataManager = opts.dataManager;
                this.model = opts.model; //a sidepanel LayerItem object
                this.map = opts.basemap.map;
                this.overlays = {};
                this.parseLayerItem();
                this.listenTo(this.app.vent, 'selected-projects-updated', this.parseLayerItem);
                this.app.vent.on("filter-applied", this.redraw.bind(this));
                this.render();
            },
            onBeforeDestroy: function () {
                //console.log("destroying ", this.model.get("name"));
                var rule, i;
                for (rule in this.overlays) {
                    //hide all overlays
                    for (i = 0; i < this.overlays[rule].length; i++) {
                        this.overlays[rule][i].hide();
                    }
                    //once hidden, remove all symbolized map overlay objects for g.c.
                    this.overlays[rule] = [];
                }
            },
            redraw: function () {
                if (this.model.get("isShowingOnMap")) {
                    this.model.showSymbols();
                } else {
                    this.model.hideSymbols();
                }
                this.render();
            },
            renderSymbol: function (rule) {
                var i;
                for (i = 0; i < this.overlays[rule].length; i++) {
                    this.overlays[rule][i].redraw();
                }
            },
            render: function () {
                var rule;
                for (rule in this.overlays) {
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
                this.overlays[symbol.rule] = [];
                //alert("none should be showing");
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

            hideSymbol: function (rule) {
                var i;
                if (!this.overlays[rule]) {
                    return;
                }
                for (i = 0; i < this.overlays[rule].length; i++) {
                    this.overlays[rule][i].hide();
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
