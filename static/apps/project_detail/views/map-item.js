define(["underscore",
        "marionette",
        "handlebars",
        "text!../templates/map-item.html"
    ],
    function (_, Marionette, Handlebars, MapItemTemplate) {
        'use strict';
        var MapItem = Marionette.ItemView.extend({

            template: Handlebars.compile(MapItemTemplate),

            initialize: function (opts) {
                _.extend(this, opts);
                this.render();
            },
            className: 'map-card',
            templateHelpers: function () {
                let datasetList = this.model.get('layers').models.map((layer) => {
                    return layer.get('dataset').name
                });
                return {
                    datasetList: datasetList
                };
            },

        });
        return MapItem;
    });