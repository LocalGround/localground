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
            childViewOptions: function (model, index) {
                return {
                    app: this.app
                };
            },
            childView: DatasetItemView,
            childViewContainer: '.dataset-list_wrapper',

           
        });
        return LayerListManager;

    });
