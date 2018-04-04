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
                this.route = this.parent.mapId + '/layers/' + this.parent.layerId + '/' + this.parent.layer.get('data_source') + '/' + this.model.id;
                if (this.model.get('geometry') != null) {
                    this.overlay = new MarkerOverlay({
                        model: this.model,
                        symbol: this.symbolModel,
                        app: this.app,
                        isShowing: this.symbolModel.get('isShowing'),
                        displayOverlay: this.symbolModel.get('isShowing'),
                        route: this.route
                    });
                    this.overlay.render();
                }
                //this.listenTo(this.app.vent, 'highlight-symbol-item', this.handleRoute);

            },
            modelEvents: {
                'highlight-symbol-item': 'handleRoute',
                //'change': 'render'
                'change:geometry': 'updateGeometry',
            },
            active: false,

            // for some reason this approach is buggy...
            // modelEvents: function () {
            //     let events = {};
            //     this.model.get('fields').forEach(field => {
            //         events[`change:${field.col_name}`] = 'render';
            //     })
            //     return events;
            // },

            template: Handlebars.compile(SymbolItemTemplate),
            tagName: "li",
            className: "symbol-item marker-container",
            templateHelpers: function () {
                return {
                    active: this.active,
                    layer_id: this.parent.layerId,
                    map_id: this.parent.mapId,
                    data_source: this.parent.layer.get('data_source'),
                    rule: this.symbolModel.get('rule'),
                    icon: this.symbolModel.get('icon'),
                    isIndividual: this.parent.layer.get('group_by') === 'individual',
                    width: this.symbolModel.get('width'),
                    height: this.symbolModel.get('height')
                };
            },
            onRender: function() {
                console.log('SymbolItem render', this);
            },
            handleRoute: function(layerId) {
                if (this.parent.layerId === layerId) {
                    this.makeActive();
                }
            },
            makeActive: function () {
                var activeItem = this.app.selectedItemView;
                if (activeItem && !activeItem.isDestroyed) {
                    activeItem.active = false;
                    activeItem.render();

                    // some item's don't have associated overlays, so check first
                    if (activeItem.overlay) {
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

            // this function only does something when adding or deleting entire markers:
            updateGeometry: function() {
                try {
                    console.log(JSON.stringify(this.model.get('geometry')));
                }
                catch (error) {
                    console.log('its null');
                }

                console.trace();
                console.log('updateGeometry', this);
                if (this.model.get('geometry') === null) { // delete marker
                    console.log('delete marker');
                    this.overlay.destroy();
                    this.overlay = null;

                } else if (this.overlay === null) { // create new marker
                    console.log('create marker');
                    this.overlay = new MarkerOverlay({
                        model: this.model,
                        symbol: this.symbolModel,
                        app: this.app,
                        isShowing: this.symbolModel.get('isShowing'),
                        displayOverlay: this.symbolModel.get('isShowing'),
                        route: this.route
                    });
                    this.overlay.render();
                    this.overlay.activate();
                }
            },

            onDestroy: function () {
                console.log('destroying symbol-item-view');
                if (this.overlay != null) {
                    this.overlay.destroy();
                }
            }
        });
        return SymbolItemView;
    });
