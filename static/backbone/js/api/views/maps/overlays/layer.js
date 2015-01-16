define(['marionette',
        'config',
        'jquery',
        'underscore',
        'lib/maps/overlays/symbolized'
    ],
    function (Marionette, Config, $, _, Symbolized) {
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
            showOverlay: false,
            symbols: null,
            modelEvents: {
                'show-overlay': 'showTheOverlay',
                'hide-overlay': 'hideTheOverlay'
            },
            initialize: function (opts) {
                $.extend(this, opts);
                this.dataManager = opts.dataManager;
                this.model = opts.model; //a sidepanel LayerItem object
                this.map = opts.basemap.map;
                this.overlays = {};
                this.parseLayerItem();
                this.listenTo(this.app.vent, 'selected-projects-updated', this.parseLayerItem);
                this.app.vent.on("filter-applied", this.redraw.bind(this));
            },
            showTheOverlay: function (rule) {
                if (rule) {
                    this.model.getSymbol(rule).showOverlay = true;
                } else {
                    this.showOverlay = true;
                    this.model.showSymbols();
                }
                this.render();
            },
            hideTheOverlay: function (rule) {
                if (rule) {
                    this.model.getSymbol(rule).showOverlay = false;
                } else {
                    this.showOverlay = false;
                    this.model.hideSymbols();
                }
                this.render();
            },
            render: function () {
                console.log("render layer overlay");
                var rule, i;
                for (rule in this.overlays) {
                    for (i = 0; i < this.overlays[rule].length; i++) {
                        this.overlays[rule][i].redraw();
                    }
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
                console.log("showAll", this.model.get("name"), this.overlays);
                this.showOverlay = true;
                var key;
                for (key in this.overlays) {
                    this.overlays[key].isShowing = true;
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
                console.log("hide all");
                this.showOverlay = false;
                var key;
                for (key in this.overlays) {
                    this.hide(key);
                }
            },

            redraw: function () {
                if (this.showOverlay) {
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
