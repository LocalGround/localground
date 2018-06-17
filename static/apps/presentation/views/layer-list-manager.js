define(["marionette",
        "underscore",
        "handlebars",
        "apps/presentation/views/legend-layer-entry",
        "text!../templates/legend-container.html"
    ],
    function (Marionette, _, Handlebars, LayerEntryView, LegendTemplate) {
        'use strict';
        var LayerListManager = Marionette.CompositeView.extend({
            tagName: 'div',
            template: Handlebars.compile(LegendTemplate),
            initialize: function (opts) {
                _.extend(this, opts);
            },
            events: {
                'click .legend-top': 'toggleLegend',
                'click this': 'toggleLegend'
            },
            childViewOptions: function (model, index) {
                const dm = this.app.dataManager;
                return {
                    app: this.app,
                    collection: model.get('symbols'),
                    dataCollection: dm.getCollection(model.get('dataset').overlay_type)
                };
            },
            childView: LayerEntryView,
            childViewContainer: '.legend-layers',

            toggleLegend: function () {
                const $legend = $('#legend');
                if ($legend.css('height') == '20px') {
                    $legend.css({'height': 'auto'}); //, 'min-width': 'auto'});
                } else {
                    $legend.css({'height': '20px'}); //, 'width': '90px'});
                }
            },
            onRender: function () {
                this.drawOverlays();
            },
            drawOverlays: function () {
                //draw map overlays in reverse order so they draw on
                //top of each other correctly:

                //NOTE: Alternatively, you can set the z-index of each marker
                for (let i = this.collection.length - 1; i >= 0; i--) {
                    const childView = this.children.findByModel(this.collection.at(i));
                    childView.drawOverlays();
                }
            }
        });
        return LayerListManager;

    });
