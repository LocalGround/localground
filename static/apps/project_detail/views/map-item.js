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
            className: 'project_map-item',
            templateHelpers: function () {
                let datasetList = this.model.get('layers').models.map((layer) => {
                    return layer.get('dataset').name
                });

                return {
                    datasetList: datasetList,
                    accessLevel: this.getAccessLevel(this.model.get('metadata').accessLevel)
                };
            },
            events: {
                'click .fa-ellipsis-v': 'showMenu'
            },

            modelEvents: {
                'change:name': 'render'
            },

            getAccessLevel: function(accessVal) {
                switch(accessVal) {
                    case 1:
                        return 'Public'
                        break;
                    case 2:
                    return 'Anyone with link'
                        break;
                    case 3:
                    return 'Password protected'
                        break;
                }
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