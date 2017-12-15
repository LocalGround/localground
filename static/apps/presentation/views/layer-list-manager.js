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
                console.log("Layer List Manager Called");
            },
            events: {
                'click .legend-top': 'toggleLegend',
                'click this': 'toggleLegend'
            },
            childViewOptions: function () {
                return {
                    app: this.app
                };
            },
            childView: LayerEntryView,

            toggleLegend: function () {
                console.log("toggle legend", $('#legend').css('height'));
                if ($('#legend').css('height') == '20px') {
                    $('#legend').css({'height': 'auto', 'min-width': 'auto'});
                } else {
                    $('#legend').css({'height': '20px', 'width': '90px'});
                }
                
            }
        });
        return LayerListManager;

    });
