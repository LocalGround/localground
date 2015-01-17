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
                    showOverlay: this.model.get("showOverlay")
                };
                if (this.model.basic) {
                    extras.item = this.model.getSymbols()[0];
                }
                return extras;
            },

            toggleShow: function (e) {
                var rule = $(e.target).val(),
                    isChecked = $(e.target).is(':checked');
                this.model.getSymbol(rule).showOverlay = isChecked;
                this.model.trigger('symbol-change', rule);
                this.saveState();
            },

            toggleShowAll: function () {
                var isChecked = this.$el.find('.check-all').is(':checked'),
                    $cbs = this.$el.find('input');
                $cbs.attr('checked', isChecked);
                this.model.set("showOverlay", isChecked);
                this.saveState();
            },

            zoomToExtent: function (e) {
                this.model.trigger("zoom-to-layer");
                e.preventDefault();
            },

            saveState: function () {
                //remember layer and symbol visibility
                var visMemory = { showOverlay: this.model.get("showOverlay") },
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
                this.model.set("showOverlay", this.state.showOverlay || false);
                for (rule in symbolMap) {
                    symbolMap[rule].showOverlay = this.state[rule] || this.model.get("showOverlay") || false;
                }
            }
        });

        return LayerItem;

    });