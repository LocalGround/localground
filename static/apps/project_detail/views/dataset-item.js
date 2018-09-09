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
            }
        });
        return DatasetItem;
    });