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
            events: {
                'click .check-all': 'toggleShow',
                'click .zoom-to-extent': 'zoomToExtent'
            },
            initialize: function (opts) {
                $.extend(this, opts);
                this.app = opts.app;
                this.render();
            },
            render: function () {
                this.$el.html(_.template(LayerEntry, {
                    name: this.name,
                    //items: this.children,
                    symbols: this.getSymbols()
                }));
            },
            getSymbols: function () {
                var i = 0,
                    symbols = [];
                for (i = 0; i < this.children.length; i++) {
                    symbols.push(new Symbol(this.children[i]));
                }
                return symbols;
            },
            toggleShow: function () {
                if (this.$el.find('.check-all').is(':checked')) {
                    console.log('show layer');
                    this.app.vent.trigger("show-layer", {
                        layerItem: this
                    });
                } else {
                    this.app.vent.trigger("hide-layer", {
                        layerItem: this
                    });
                }
                //this.saveState();
            },
            zoomToExtent: function (e) {
                //this.collection.trigger('zoom-to-extent');
                alert("zoom to extent");
                e.preventDefault();
            }
        });

        return LayerItem;

    });