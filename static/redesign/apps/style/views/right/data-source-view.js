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
                this.app = opts.app;
                // here is some fake data until the
                // /api/0/maps/ API Endpoint gets built:
                this.collection = new Maps([
                    { id: 1, name: "Flowers & Birds", project_id: 4 },
                    { id: 2, name: "Berkeley Public Art", project_id: 4 },
                    { id: 3, name: "Soil Science", project_id: 4 }                ]);
            }

        });
        return DataSourceView;
    });