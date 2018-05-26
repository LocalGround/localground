define(["marionette",
        "handlebars",
        "lib/maps/overlays/marker",
        "apps/main/views/right/symbol-style-menu-view",
        "text!../../templates/left/symbol-item-view.html"
    ],
    function (Marionette, Handlebars, MarkerOverlay, SymbolStyleMenuView, SymbolItemTemplate) {
        'use strict';
        /**
         * model --> Record
         */
        var SymbolItemView =  Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.symbolModel = this.parent.model;
                this.overlay = null;
                this.popover = this.app.popover;
                this.route = this.parent.mapId + '/layers/' + this.parent.layerId + '/' + this.parent.layer.get('dataset').overlay_type + '/' + this.model.id;
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
                this.listenTo(this.app.vent, 'highlight-symbol-item', this.handleRoute);
            },
            active: false,

            modelEvents: {
                'change:geometry': 'updateGeometry',
                'change': 'render'
            },
            events: {
                'click .symbol-edit-individual': 'showSymbolEditMenu'
            },
            template: Handlebars.compile(SymbolItemTemplate),
            tagName: "li",
            className: "symbol-item marker-container",
            templateHelpers: function () {
                let display_name = this.model.get(this.parent.layer.get("display_field"));
                return {
                    active: this.active,
                    layer_id: this.parent.layerId,
                    map_id: this.parent.mapId,
                    dataset: this.parent.layer.get('dataset'),
                    rule: this.symbolModel.get('rule'),
                    icon: this.symbolModel.get('icon'),
                    isIndividual: this.parent.layer.get('group_by') === 'individual',
                    width: this.symbolModel.get('width'),
                    height: this.symbolModel.get('height'),
                    display_name: display_name === undefined ? "" : display_name,
                    geomType: this.model.get('geometry') ? this.model.get('geometry').type : null
                };
            },

            /*onRender: function() {
                console.log('SymbolItem render', this);
            },*/
            handleRoute: function(info) {
                //console.log('handle route');
                if (this.parent.layerId === info.layerId) {
                    if (this.model.id === info.markerId) {
                        //console.log('make active', this);
                        this.makeActive();

                    }
                }
            },

            showSymbolEditMenu: function (event) {
                this.popover.update({
                    $source: this.$el.find('.ind-symbol'),
                    view: new SymbolStyleMenuView({
                        app: this.app,
                        model: this.symbolModel
                    }),
                    placement: 'right',
                    offsetX: '5px',
                    width: '350px',
                    title: 'Symbol Properties'
                });
            },

            makeActive: function (e) {
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

                if (!this.model.get('geometry')) { // delete marker
                    this.overlay.destroy();
                    this.overlay = null;
                    return;
                }
                if (!this.overlay) { // create new overlay
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
