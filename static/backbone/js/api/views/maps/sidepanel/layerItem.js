/**
 * Created by zmmachar on 10/15/14.
 */
define(["backbone",
        "underscore",
        "jquery",
        'views/maps/overlays/symbol',
        "text!" + templateDir + "/sidepanel/layerEntry.html"
    ],
    function (Backbone, _, $, Symbol, LayerEntry) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class DataPanel
         */
        var LayerItem = Backbone.View.extend({
            model: null,
            events: {
                'click .check-all': 'toggleShowAll',
                'click .cb-layer-item': 'toggleShow',
                'click .zoom-to-extent': 'zoomToExtent'
            },
            initialize: function (opts) {
                this.model = opts.model;
                //$.extend(this, opts);
                this.app = opts.app;
                this.render();
            },
            render: function () {
                this.$el.html(_.template(LayerEntry, {
                    name: this.model.get("name"),
                    //items: this.children,
                    symbols: this.getSymbols()
                }));
            },
            getSymbols: function () {
                var i = 0,
                    symbolList = this.model.get("legend_object"),
                    symbols = [];
                for (i = 0; i < symbolList.length; i++) {
                    symbols.push(new Symbol(symbolList[i]));
                }
                return symbols;
            },
            toggleShow: function (e) {
                if ($(e.target).is(':checked')) {
                    //console.log('show symbol');
                    this.app.vent.trigger("show-symbol", {
                        layerItem: this,
                        rule: $(e.target).val()
                    });
                } else {
                    this.app.vent.trigger("hide-symbol", {
                        layerItem: this,
                        rule: $(e.target).val()
                    });
                }
                //this.saveState();
            },
            toggleShowAll: function () {
                if (this.$el.find('.check-all').is(':checked')) {
                    //console.log('show layer');
                    this.$el.find('input').attr('checked', true);
                    this.app.vent.trigger("show-layer", {
                        layerItem: this.model.get("legend_object")
                    });
                } else {
                    this.$el.find('input').attr('checked', false);
                    this.app.vent.trigger("hide-layer", {
                        layerItem: this.model.get("legend_object")
                    });
                }
                //this.saveState();
            },
            zoomToExtent: function (e) {
                this.app.vent.trigger("zoom-to-layer", {
                    layerItem: this.model.get("legend_object")
                });
                e.preventDefault();
            }
        });

        return LayerItem;

    });