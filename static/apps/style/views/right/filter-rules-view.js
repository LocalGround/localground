define(["marionette",
        "handlebars",
        "collections/maps",
        "text!../../templates/right/filter-rules.html"
    ],
    function (Marionette, Handlebars, Maps, FilterRulesTemplate) {
        'use strict';

        var FilterRulesView = Marionette.ItemView.extend({

            template: Handlebars.compile(FilterRulesTemplate),

            initialize: function (opts) {
                _.extend(this, opts);
                console.log("filters initialized");
            }

        });
        return FilterRulesView;
    });