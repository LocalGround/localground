define(['marionette',
        'underscore',
        'handlebars',
        'collections/symbols',
        'apps/presentation/views/legend-symbol-entry',
        'text!../templates/legend-layer.html'
    ],
    function (Marionette, _, Handlebars, Symbols, LegendSymbolEntry, LayerTemplate) {
        'use strict';

        // in this view, the model is a layer, and each childview is a symbol
        var LegendLayerEntry = Marionette.CompositeView.extend({
            childView: LegendSymbolEntry,
            className: "layer-entry",
            childViewContainer: ".symbol-container",
            childViewOptions: function () {
                return {
                    app: this.app,
                    isShowing: this.model.get("metadata").isShowing,
                    symbolCount: this.collection.length
                };
            },
            initialize: function (opts) {
                _.extend(this, opts);
                this.collection.assignRecords(this.dataCollection);
                this.template = Handlebars.compile(LayerTemplate);
                console.log(this.model);
            },

            onRender: function() {
                this.collapseSymbols();
            },

            templateHelpers: function () {
                return {
                    isShowing: true,
                    layerIsIndividual: this.model.isIndividual()
                };
            },

            events: {
                'change .cb-symbol': 'showHideLayer',
                'click .collapse': 'expandCollapseSymbols'
            },

            expandSymbols: function() {
                this.$el.find('.presentation-records_wrapper').css('display', 'block');
                    
                this.$el.find('.collapse').removeClass('fa-angle-right');
                this.$el.find('.collapse').addClass('fa-angle-down');

                this.$el.find('.symbol-entry-header').addClass('legend-symbol_expanded');
                this.$el.find('.symbol-entry-header').removeClass('legend-symbol_collapsed');
                //this.$el.find('.legend-symbol_svg').hide();
            },

            collapseSymbols: function() {
                this.$el.find('.presentation-records_wrapper').css('display', 'none');
                this.$el.find('.collapse').removeClass('fa-angle-down');
                this.$el.find('.collapse').addClass('fa-angle-right');

                this.$el.find('.symbol-entry-header').removeClass('legend-symbol_expanded');
                this.$el.find('.symbol-entry-header').addClass('legend-symbol_collapsed');
                //this.$el.find('.legend-symbol_svg').show();
            },

            expandCollapseSymbols: function () {
                if (this.$el.find('.collapse').hasClass('fa-angle-right')) {
                    this.expandSymbols();
                } else {
                    this.collapseSymbols();
                }
            },

            showHideLayer: function(e) {
                var isChecked = $(e.target).prop('checked');
                if (isChecked) {
                    this.children.each((symbolView) => {
                        console.log(symbolView.model.get('isShowing'));
                        if(symbolView.model.get('isShowing')) {
                            symbolView.markerOverlays.showAll();
                        }
                        
                    });
                    this.$el.find('.symbol-container').show();
                    if (!this.model.isIndividual()) {
                        this.$el.find('.collapse').css('visibility', 'visible');
                    }
                    
                } else {
                    this.children.each((symbolView) => {
                        symbolView.markerOverlays.hideAll();
                    });
                    this.$el.find('.symbol-container').hide();
                    this.$el.find('.collapse').css('visibility', 'hidden');
                }
            },



            drawOverlays: function () {
                //draw map overlays in reverse order so they draw on
                //top of each other correctly:
                for (let i = this.collection.length - 1; i >= 0; i--) {
                    const childView = this.children.findByModel(this.collection.at(i));
                    childView.drawOverlays();
                }
            }

        });
        return LegendLayerEntry;
    });
