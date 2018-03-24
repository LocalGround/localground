define(["marionette",
        "handlebars",
        "lib/maps/overlays/marker",
        "text!../../templates/left/symbol-item-view.html"
    ],
    function (Marionette, Handlebars, MarkerOverlay, SymbolItemTemplate) {
        'use strict';
        /**
         * model --> Record
         */
        var SymbolItemView =  Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.symbolModel = this.parent.model;
                this.overlay = null;
                const route = this.parent.mapId + '/layers/' + this.parent.layerId + '/' + this.parent.layer.get('data_source') + '/' + this.model.id;
                if (this.model.get('geometry') != null) {
                    this.overlay = new MarkerOverlay({
                        model: this.model,
                        symbol: this.symbolModel,
                        app: this.app,
                        isShowing: this.symbolModel.get('isShowing'),
                        displayOverlay: this.symbolModel.get('isShowing'),
                        route: route
                    });
                    this.overlay.render();
                }
                //this.listenTo(this.app.vent, 'highlight-symbol-item', this.handleRoute);

            },
            modelEvents: {
                'highlight-symbol-item': 'handleRoute'
            },
            active: false,
            // events: {
            //     'click': 'makeActive'
            // },

            template: Handlebars.compile(SymbolItemTemplate),
            tagName: "li",
            className: "symbol-item marker-container",
            templateHelpers: function () {
                return {
                    active: this.active,
                    layer_id: this.parent.layerId,
                    map_id: this.parent.mapId,
                    data_source: this.parent.layer.get('data_source')
                };
            },
            handleRoute: function (layerID) {
                if (this.parent.layerId === layerID) {
                    this.makeActive();
                }
            },
            makeActive: function () {
                var activeItem = this.app.selectedItemView;
                if (activeItem && !activeItem.isDestroyed) {
                    activeItem.active = false;
                    activeItem.render();
                    if (activeItem.overlay && !activeItem.overlay.isDestroyed) {
                        activeItem.overlay.deactivate();
                    }
                }
                this.app.selectedItemView = this;
                this.active = true;
                if (this.overlay != null) {
                    this.overlay.activate();
                }
                this.render();
            },
            onDestroy: function () {
                if (this.overlay != null) {
                    this.overlay.destroy();
                }
            }
        });
        return SymbolItemView;
    });
