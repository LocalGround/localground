define(["marionette",
        "handlebars",
        "collections/maps",
        "text!../../templates/right/data-source.html"
    ],
    function (Marionette, Handlebars, Maps, DataSourceTemplate) {
        'use strict';

        var DataSourceView = Marionette.ItemView.extend({

            template: Handlebars.compile(DataSourceTemplate),

            initialize: function (opts) {
                _.extend(this, opts);
            },
            
            templateHelpers: function () {
                return {
                   // json: "yeeag",
                };
            }
        });
        return DataSourceView;
    });