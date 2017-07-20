define(["marionette",
        "underscore",
        "handlebars",
        "apps/presentation/views/legend-layer-entry"
    ],
    function (Marionette, _, Handlebars, LayerEntryView) {
        'use strict';
        var LayerListManager = Marionette.CompositeView.extend({
            tagName: 'div',
            template: Handlebars.compile(
                '<div style="margin-bottom: 22px"><p style="display: inline;">Legend</p><i class="fa fa-angle-down legend-toggle" aria-hidden="true" style="margin-top: 4px; float: right"></i></div>'
                
                ),
            initialize: function (opts) {
                _.extend(this, opts);
                console.log("Layer List Manager Called");
            },
            events: {
                'click .legend-toggle': 'toggleLegend',
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
                    $('#legend').css({'height': 'auto', 'width': 'auto'});
                } else {
                    $('#legend').css({'height': '20px', 'width': '90px'});
                }
                
            }
        });
        return LayerListManager;

    });
