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
                this.sortProperty = 'name';
            },
            templateHelpers: function() {
                return {
                    sortProperty: this.sortProperty
                }
            },
            events: {
                'change .sort_by': 'sortDatasets'
            },
            childViewOptions: function (model, index) {
                return {
                    app: this.app
                };
            },
            childView: DatasetItemView,
            childViewContainer: '.dataset-list_wrapper',

            sortDatasets: function(e) {
                this.sortProperty = e.target.value;
                this.collection.setComparator(e.target.value);
                this.collection.sort();
            }

           
        });
        return LayerListManager;

    });
