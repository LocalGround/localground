define(["marionette",
        "underscore",
        "handlebars",
        "apps/project_detail/views/dataset-item",
        "text!../templates/dataset-list-manager.html"
    ],
    function (Marionette, _, Handlebars, DatasetItemView, DatasetManagerTemplate) {
        'use strict';

        // in this view, each childview is a layer
        var LayerListManager = Marionette.CompositeView.extend({
            tagName: 'div',
            template: Handlebars.compile(DatasetManagerTemplate),

            initialize: function (opts) {
                _.extend(this, opts);
            },
            events: {
                'click .legend-top': 'toggleLegend',
                'click this': 'toggleLegend'
            },
            // childViewOptions: function (model, index) {
            //     const dm = this.app.dataManager;
            //     return {
            //         app: this.app,
            //         collection: model.getSymbols(),
            //         dataCollection: dm.getCollection(model.get('dataset').overlay_type)
            //     };
            // },
            childView: DatasetItemView,
            childViewContainer: '.dataset-list_wrapper',

           
        });
        return LayerListManager;

    });
