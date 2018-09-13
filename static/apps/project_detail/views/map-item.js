define(["underscore",
        "marionette",
        "handlebars",
        "apps/project_detail/views/map-options-menu",
        "text!../templates/map-item.html"
    ],
    function (_, Marionette, Handlebars, MapOptionsMenu, MapItemTemplate) {
        'use strict';
        var MapItem = Marionette.ItemView.extend({

            template: Handlebars.compile(MapItemTemplate),

            initialize: function (opts) {
                _.extend(this, opts);

                this.popover = this.app.popover;

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
            events: {
                'click .fa-ellipsis-v': 'showMenu'
            },

            modelEvents: {
                'change:name': 'render'
            },

            showMenu: function(e) {
                this.popover.update({
                    $source: e.target,
                    view: new MapOptionsMenu({
                        app: this.app,
                        model: this.model
                    }),
                    placement: 'bottom',
                    width: '150px'
                });
            }

        });
        return MapItem;
    });