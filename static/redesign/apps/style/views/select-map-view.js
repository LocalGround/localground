define(["marionette",
        "handlebars",
        "collections/maps",
        "text!../templates/select-map.html"
    ],
    function (Marionette, Handlebars, Maps, MapTemplate) {
        'use strict';

        var SelectMapView = Marionette.ItemView.extend({

            template: Handlebars.compile(MapTemplate),

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
        return SelectMapView;
    });