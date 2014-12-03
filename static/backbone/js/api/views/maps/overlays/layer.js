define(['marionette',
        'config',
        'jquery',
        'underscore',
        'lib/sqlParser',
        'lib/maps/overlays/symbolized'
    ],
    function (Backbone, Config, $, _, SqlParser, Symbolized) {
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
            models: null,
            overlays: null,
            dataManager: null,
            legendItem: null,

            initialize: function (opts) {
                $.extend(this, opts);
                this.dataManager = opts.dataManager;
                this.legendItem = opts.legendItem;
                this.map = opts.basemap.map;
                this.models = {};
                this.overlays = {};
                this.findModels();
                this.renderOverlays();
            },

            findModels: function () {
                var key,
                    i = 0,
                    sqlParser = null,
                    rule = null,
                    color = null,
                    that = this,
                    check = null;
                for (i = 0; i < this.legendItem.children.length; i++) {
                    rule = this.legendItem.children[i].rule;
                    color = this.legendItem.children[i].color;
                    if (!that.models[color]) {
                        that.models[color] = [];
                    }
                    check = function (model) {
                        sqlParser = new SqlParser(rule);
                        if (sqlParser.checkModel(model)) {
                            that.models[color].push(model);
                        }
                    };
                    for (key in this.dataManager.collections) {
                        this.dataManager.collections[key].each(check);
                    }
                }
            },

            renderOverlays: function () {
                var key,
                    i = 0,
                    opts,
                    symbol,
                    model,
                    configKey;
                for (key in this.models) {
                    if (!this.overlays[key]) {
                        this.overlays[key] = [];
                    }
                    for (i = 0; i < this.models[key].length; i++) {
                        model = this.models[key][i];
                        configKey = model.getKey().split("_")[0];
                        opts = {
                            app: this.app,
                            model: model,
                            color: key,
                            map: this.map,
                            infoBubbleTemplates: {
                                InfoBubbleTemplate: _.template(Config[configKey].InfoBubbleTemplate),
                                TipTemplate: _.template(Config[configKey].TipTemplate)
                            }
                        };
                        symbol = new Symbolized(opts);
                        this.overlays[key].push(symbol);
                        symbol.show();
                    }
                }
            },

            /** Shows all of the map overlays */
            showAll: function () {
                //this.legendItem = data.legendItem;
                /*this.isVisible = true;
                this.children.each(function (overlay) {
                    console.log(overlay.model.get("isVisible"));
                    if (overlay.model.get("isVisible")) {
                        overlay.show();
                    }
                });*/
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
                //console.log("zoom to extent");
                var bounds = new google.maps.LatLngBounds();
                this.children.each(function (overlay) {
                    bounds.union(overlay.getBounds());
                });
                this.map.fitBounds(bounds);
            }

        });
        return Layer;
    });
