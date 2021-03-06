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
                    symbolCount: this.collection.length,
                    layerModel: this.model
                };
            },
            initialize: function (opts) {
                _.extend(this, opts);
                this.model.get('metadata').collapsed = true;
                this.collection.assignRecords(this.dataCollection);
                this.template = Handlebars.compile(LayerTemplate);
                this.listenTo(this.app.vent, 'show-layer', this.showLayerIfActive);
            },

            onRender: function() {
                this.collapseSymbols();
                this.showHideLayer(null, this.model.get('metadata').isShowing);
            },

            templateHelpers: function () {
                return {
                    isShowing: this.model.get("metadata").isShowing,
                    layerIsIndividual: this.model.isIndividual()
                };
            },

            events: {
                'change .cb-symbol': 'showHideLayer',
                'click .collapse': 'expandCollapseSymbols'
            },

            expandSymbols: function() {

                // individual symbols are always collapsed
                if (this.model.isIndividual()) {
                    return;
                }
                this.$el.find('.presentation-records_wrapper').css('display', 'block');

                this.$el.find('.collapse').removeClass('fa-angle-right');
                this.$el.find('.collapse').addClass('fa-angle-down');

                this.$el.find('.symbol-entry-header').addClass('legend-symbol_expanded');
                this.$el.find('.symbol-entry-header').removeClass('legend-symbol_collapsed');
                this.model.get('metadata').collapsed = false;
            },

            collapseSymbols: function() {

                this.$el.find('.presentation-records_wrapper').css('display', 'none');
                this.$el.find('.collapse').removeClass('fa-angle-down');
                this.$el.find('.collapse').addClass('fa-angle-right');

                this.$el.find('.symbol-entry-header').removeClass('legend-symbol_expanded');
                this.$el.find('.symbol-entry-header').addClass('legend-symbol_collapsed');
                this.model.get('metadata').collapsed = true;
            },

            expandCollapseSymbols: function () {
                if (this.$el.find('.collapse').hasClass('fa-angle-right')) {
                    this.expandSymbols();
                } else {
                    this.collapseSymbols();
                }
            },

            // This function gets triggered both by user events and by onRender, so we manage
            // the arguments to handle both situations.
            // If it is triggered by an event, there is only 1 argument.
            // If it is triggered from onRender, there are 2 args, and arg1 is null.
            showHideLayer: function(event, state) {
                let isShowing;
                if (arguments.length === 1) {
                    isShowing = $(event.target).prop('checked');
                    this.model.get("metadata").isShowing = isShowing
                } else {
                    isShowing = state;
                }
                if (isShowing) {
                    this.children.each((symbolView) => {
                        //console.log(symbolView.model.get('isShowing'));
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

            // in the case where a user loads a page using a url where the route point to a record on a layer that is not showing, we automatically show the layer.
            showLayerIfActive: function(layerId) {
                if (parseInt(layerId) === this.model.id) {

                    this.model.get('metadata').isShowing = true;

                    // updating '.cb-symbol' triggers this.showHideLayer()
                    this.$el.find('.cb-symbol').prop('checked', true).change();
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
