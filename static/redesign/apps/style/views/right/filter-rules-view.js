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
                this.app = opts.app;
                // here is some fake data until the
                // /api/0/maps/ API Endpoint gets built:
                this.collection = new Maps([
                    { id: 1, name: "Flowers & Birds", project_id: 4 },
                    { id: 2, name: "Berkeley Public Art", project_id: 4 },
                    { id: 3, name: "Soil Science", project_id: 4 }                ]);
            }

        });
        return FilterRulesView;
    });