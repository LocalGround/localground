define(["underscore",
        "marionette",
        "handlebars",
        "text!../templates/map-item.html"
    ],
    function (_, Marionette, Handlebars, MapItem) {
        'use strict';
        var MapItem = Marionette.ItemView.extend({

            template: Handlebars.compile(MapItem),

            initialize: function (opts) {
                _.extend(this, opts);
                this.render();
            }
        });
        return MapItem;
    });