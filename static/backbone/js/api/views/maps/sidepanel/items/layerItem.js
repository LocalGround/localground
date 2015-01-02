/**
 * Created by zmmachar on 10/15/14.
 */
define(["marionette",
        "underscore",
        "jquery",
        'views/maps/overlays/symbol',
        "text!" + templateDir + "/sidepanel/layerEntrySimple.html",
        "text!" + templateDir + "/sidepanel/layerEntry.html"
    ],
    function (Marionette, _, $, Symbol, LayerEntrySimple, LayerEntry) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class LayerItem
         */
        var LayerItem = Marionette.ItemView.extend({
            model: null,
            symbolMap: null,
            showOverlay: false,
            basic: false,
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
                if (this.basic) {
                    this.template = _.template(LayerEntrySimple);
                }
                this.restoreState();
            },

            templateHelpers: function () {
                var extras = {
                    name: this.model.get("name"),
                    symbols: this.getSymbols(),
                    showOverlay: this.showOverlay
                };
                if (this.basic) {
                    extras.item = this.getSymbols()[0];
                }
                return extras;
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
                //set the basic flag:
                if (this.model.get("symbols").length == 1) {
                    this.basic = true;
                }
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

            toggleShowAll: function () {
                var isChecked = this.$el.find('.check-all').is(':checked'),
                    $el = this.$el.find('input');
                if (isChecked) {
                    this.app.vent.trigger("show-layer", { layerItem: this });
                } else {
                    this.app.vent.trigger("hide-layer", { layerItem: this });
                }
                $el.attr('checked', isChecked);
                this.showOverlay = isChecked;
                this.saveState();
            },

            zoomToExtent: function (e) {
                this.app.vent.trigger("zoom-to-layer", { layerItem: this });
                e.preventDefault();
            },

            saveState: function () {
                //remember layer and symbol visibility
                var visMemory = { showOverlay: true },
                    rule = null;
                for (rule in this.symbolMap) {
                    visMemory[rule] = this.symbolMap[rule].showOverlay;
                }
                this.app.saveState(this.id, visMemory, false);
            },

            restoreState: function () {
                //restore layer and symbol visibility
                var rule;
                this.state = this.app.restoreState(this.id) || {};
                this.showOverlay = this.state.showOverlay || false;
                for (rule in this.symbolMap) {
                    this.symbolMap[rule].showOverlay = this.state[rule] || false;
                }
            }
        });

        return LayerItem;

    });