/**
 * Created by zmmachar on 10/15/14.
 */
define(["marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/sidepanel/layerEntrySimple.html",
        "text!" + templateDir + "/sidepanel/layerEntry.html"
    ],
    function (Marionette, _, $, LayerEntrySimple, LayerEntry) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class LayerItem
         */
        var LayerItem = Marionette.ItemView.extend({
            model: null,
            showOverlay: false,
            template: _.template(LayerEntry),
            events: {
                'click .check-all': 'toggleShowAll',
                'click .cb-layer-item': 'toggleShow',
                'click .zoom-to-extent': 'zoomToExtent'
            },
            initialize: function (opts) {
                this.model = opts.model;
                this.app = opts.app;
                this.id = 'sidebar-' + this.model.getKey() + "-" + this.model.get('id');
                if (this.model.basic) {
                    this.template = _.template(LayerEntrySimple);
                }
                this.restoreState();
            },

            templateHelpers: function () {
                var extras = {
                    name: this.model.get("name"),
                    symbols: this.model.getSymbols(),
                    showOverlay: this.showOverlay
                };
                if (this.model.basic) {
                    extras.item = this.model.getSymbols()[0];
                }
                return extras;
            },

            onRender: function () {
                //trigger the map overlays to render if they're turned on:
                var that = this,
                    counter = 0;
                _.each(this.model.getSymbols(), function (symbol) {
                    if (symbol.showOverlay) {
                        that.app.vent.trigger("show-symbol", { model: that.model, rule: symbol.rule });
                        ++counter;
                    }
                });
                if (counter < this.model.getSymbols().length) {
                    console.log("trigger show whole layer");
                }
            },

            toggleShow: function (e) {
                var rule = $(e.target).val(),
                    isChecked = $(e.target).is(':checked');
                if (isChecked) {
                    this.app.vent.trigger("show-symbol", {
                        model: this.model,
                        rule: rule
                    });
                } else {
                    this.app.vent.trigger("hide-symbol", {
                        model: this.model,
                        rule: rule
                    });
                }
                this.model.getSymbol(rule).showOverlay = isChecked;
                this.saveState();
            },

            toggleShowAll: function () {
                var isChecked = this.$el.find('.check-all').is(':checked'),
                    $el = this.$el.find('input');
                if (isChecked) {
                    this.app.vent.trigger("show-layer", { model: this.model });
                } else {
                    this.app.vent.trigger("hide-layer", { model: this.model });
                }
                $el.attr('checked', isChecked);
                this.showOverlay = isChecked;
                this.saveState();
            },

            zoomToExtent: function (e) {
                this.app.vent.trigger("zoom-to-layer", { model: this.model });
                e.preventDefault();
            },

            saveState: function () {
                //remember layer and symbol visibility
                var visMemory = { showOverlay: true },
                    rule = null,
                    symbolMap = this.model.getSymbolMap();
                for (rule in symbolMap) {
                    visMemory[rule] = symbolMap[rule].showOverlay;
                }
                this.app.saveState(this.id, visMemory, false);
            },

            restoreState: function () {
                //restore layer and symbol visibility
                var rule,
                    symbolMap = this.model.getSymbolMap();
                this.state = this.app.restoreState(this.id) || {};
                this.showOverlay = this.state.showOverlay || false;
                for (rule in symbolMap) {
                    symbolMap[rule].showOverlay = this.state[rule] || false;
                }
            }
        });

        return LayerItem;

    });