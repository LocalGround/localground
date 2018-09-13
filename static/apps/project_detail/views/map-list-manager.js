define(["marionette",
        "underscore",
        "handlebars",
        "apps/project_detail/views/map-item",
        "text!../templates/map-list-manager.html"
    ],
    function (Marionette, _, Handlebars, MapItemView, MapListManagerTemplate) {
        'use strict';

        // in this view, each childview is a layer
        var LayerListManager = Marionette.CompositeView.extend({
            tagName: 'div',
            template: Handlebars.compile(MapListManagerTemplate),

            initialize: function (opts) {
                _.extend(this, opts);
            },
            events: {
                'click .legend-top': 'toggleLegend',
                'click this': 'toggleLegend'
            },
            childViewOptions: function (model, index) {
                // const dm = this.app.dataManager;
                return {
                    app: this.app//,
                    // collection: model.getSymbols(),
                    // dataCollection: dm.getCollection(model.get('dataset').overlay_type)
                };
            },
            childView: MapItemView,
            childViewContainer: '.map-list_wrapper',

           
        });
        return LayerListManager;

    });
