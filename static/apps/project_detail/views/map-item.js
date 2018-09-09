define(["underscore",
        "marionette",
        "handlebars",
        "text!../templates/map-item.html"
    ],
    function (_, Marionette, Handlebars, MapItemTemplate) {
        'use strict';
        var MapDetailItem = Marionette.ItemView.extend({

            template: Handlebars.compile(MapItemTemplate),

            initialize: function (opts) {
                _.extend(this, opts);
                this.render();
            }
        });
        return MapDetailItem;
    });