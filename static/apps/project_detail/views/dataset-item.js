define(["underscore",
        "marionette",
        "handlebars",
        "text!../templates/dataset-item.html"
    ],
    function (_, Marionette, Handlebars, DatasetItemTemplate) {
        'use strict';
        var DatasetItem = Marionette.ItemView.extend({

            template: Handlebars.compile(DatasetItemTemplate),

            initialize: function (opts) {
                _.extend(this, opts);
                this.render();
                console.log('dataset ', this.model);
                
            },

            templateHelpers: function() {
                const recordCount = this.model.get('models').length
                return {
                    recordCount: recordCount
                }
            },

            className: 'dataset-item'
        });
        return DatasetItem;
    });