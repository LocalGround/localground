/**
 * Created by zmmachar on 10/15/14.
 */
define(["marionette",
        "underscore",
        "jquery",
        'views/maps/overlays/symbol',
        "text!" + templateDir + "/sidepanel/layerEntry.html"
    ],
    function (Marionette, _, $, Symbol, LayerEntry) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class DataPanel
         */
        var LayerItem = Marionette.ItemView.extend({
            model: null,
            symbolMap: null,
            showOverlay: false,
            template: _.template(LayerEntry),
            events: {
                'click .check-all': 'toggleShowAll',
                'click .cb-layer-item': 'toggleShow',
                'click .zoom-to-extent': 'zoomToExtent'
            },
            initialize: function (opts) {
                this.model = opts.model;
                this.id = 'sidebar-' + this.model.getKey() + "-" + this.model.get('id');
                this.id = this.model.id;
                this.app = opts.app;
                this.buildSymbolMap();
                this.restoreState();
                //this.render();
            },
            templateHelpers: function () {
                return {
                    name: this.model.get("name"),
                    symbols: this.getSymbols(),
                    showOverlay: this.showOverlay
                };
            },
            onRender: function () {
                //trigger the map overlays to render if they're turned on:
                var that = this;
                _.each(this.getSymbols(), function (item) {
                    if (item.showOverlay) {
                        that.app.vent.trigger("show-symbol", { layerItem: that, rule: item.rule });
                    }
                });
            },
            buildSymbolMap: function () {
                if (!this.symbolMap) {
                    this.symbolMap = {};
                    var i = 0,
                        symbolList = this.model.get("symbols");
                    for (i = 0; i < symbolList.length; i++) {
                        this.symbolMap[symbolList[i].rule] = new Symbol(symbolList[i]);
                    }
                }
            },
            getSymbols: function () {
                return _.values(this.symbolMap);
            },
            toggleShow: function (e) {
                var rule = $(e.target).val(),
                    isChecked = $(e.target).is(':checked');
                if (isChecked) {
                    this.app.vent.trigger("show-symbol", {
                        layerItem: this,
                        rule: rule
                    });
                } else {
                    this.app.vent.trigger("hide-symbol", {
                        layerItem: this,
                        rule: rule
                    });
                }
                this.symbolMap[rule].showOverlay = isChecked;
                this.saveState();
            },
            getSymbolConfig: function () {
                return this.model.get("symbols");
            },
            toggleShowAll: function () {
                var isChecked = this.$el.find('.check-all').is(':checked');
                if (isChecked) {
                    this.$el.find('input').attr('checked', true);
                    this.app.vent.trigger("show-layer", { layerItem: this });
                } else {
                    this.$el.find('input').attr('checked', false);
                    this.app.vent.trigger("hide-layer", { layerItem: this });
                }
                this.showOverlay = isChecked;
                this.saveState();
            },
            zoomToExtent: function (e) {
                this.app.vent.trigger("zoom-to-layer", {
                    layerItem: this
                });
                e.preventDefault();
            },
            saveState: function () {
                //remember layer and symbol visibility
                var visMemory = { showOverlay: true },
                    key = null;
                for (key in this.symbolMap) {
                    visMemory[key] = this.symbolMap[key].showOverlay;
                }
                this.app.saveState(this.id, visMemory, false);
            },

            restoreState: function () {
                this.state = this.app.restoreState(this.id) || {};
                var key;
                this.showOverlay = this.state.showOverlay || false;
                for (key in this.symbolMap) {
                    this.symbolMap[key].showOverlay = this.state[key] || false;
                }
            }
        });

        return LayerItem;

    });