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
                'click .symbol-edit-individual': 'showSymbolEditMenu',
                'mouseenter': 'highlightSymbolContent',
                'mouseleave': 'unHighlightSymbolContent',
            },
            template: Handlebars.compile(SymbolItemTemplate),
            tagName: "li",
            className: "symbol-item marker-container",
            templateHelpers: function () {
                const display_name = this.model.get(this.parent.layer.get("display_field"));
                const svg = this.getSVG();
                return {
                    active: this.active,
                    layer_id: this.parent.layerId,
                    map_id: this.parent.mapId,
                    dataset: this.parent.layer.get('dataset'),
                    rule: this.symbolModel.get('rule'),
                    icon: this.symbolModel.get('icon'),
                    svg: svg,
                    isIndividual: this.parent.layer.isIndividual(),
                    width: this.symbolModel.get('width'),
                    height: this.symbolModel.get('height'),
                    display_name: display_name === undefined ? "" : display_name,
                    geomType: this.model.get('geometry') ? this.model.get('geometry').type : null
                };
            },
            highlightSymbolContent: function (e) {
                this.parent.highlightSymbolContent(e);
            },
            unHighlightSymbolContent: function (e) {
                this.parent.unHighlightSymbolContent(e);
            },
            getSVG: function () {
                const icon = this.symbolModel.get('icon');
                if (!this.model.get('geometry')) {
                    return;
                }
                const geomType = this.model.get('geometry').type;
                if (geomType === 'Point') {
                    return this.symbolModel.toSVG();
                } else if (geomType === 'LineString') {
                    return `
                        <svg width="25px" height="25px" viewBox="0 0 25 25">
                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="Polyline" stroke="${icon.fillColor}">
                                    <path d="M3.5,21.5 L7.5,14.5" id="Line" stroke-linecap="square"></path>
                                    <path d="M18.5,11.5 L21.5,4.5" id="Line-Copy-2" stroke-linecap="square"></path>
                                    <path d="M11.0961538,12.75 L15.9038462,12.25" id="Line-Copy" stroke-linecap="square"></path>
                                    <circle id="Oval-Copy-2" fill="#FFFFFF" cx="3" cy="22" r="2"></circle>
                                    <circle id="Oval-Copy-4" fill="#FFFFFF" cx="9" cy="13" r="2"></circle>
                                    <circle id="Oval-Copy-6" fill="#FFFFFF" cx="22" cy="3" r="2"></circle>
                                    <circle id="Oval-Copy-5" fill="#FFFFFF" cx="18" cy="12" r="2"></circle>
                                </g>
                            </g>
                        </svg>
                    `
                } else if (geomType === 'Polygon') {
                    return `
                    <svg width="25px" height="25px" viewBox="0 0 25 25">
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Polygon" stroke="${icon.fillColor}">
                                <path d="M4.5,20.5 L10.5,5.5" id="Line" stroke-linecap="square"></path>
                                <path d="M17.5,17.5 L21.5,7.5" id="Line-Copy-3" stroke-linecap="square"></path>
                                <path d="M18.5,6.5 L13.5,4.5" id="Line-Copy-2" stroke-linecap="square"></path>
                                <path d="M6.09615385,20.75 L16.5,19.5" id="Line-Copy" stroke-linecap="square"></path>
                                <circle id="Oval-Copy-2" fill="#FFFFFF" cx="4" cy="21" r="2"></circle>
                                <circle id="Oval-Copy-4" fill="#FFFFFF" cx="17" cy="19" r="2"></circle>
                                <circle id="Oval-Copy-6" fill="#FFFFFF" cx="12" cy="4" r="2"></circle>
                                <circle id="Oval-Copy-5" fill="#FFFFFF" cx="21" cy="8" r="2"></circle>
                            </g>
                        </g>
                    </svg>
                    `
                }
            },

            handleRoute: function(info) {
                //console.log('handle route');
                if (this.parent.layerId === info.layerId) {
                    if (this.model.id === info.markerId) {
                        //console.log('make active', this);
                        this.makeActive();

                    }
                }
            },

            showSymbolEditMenu: function (e) {
                this.popover.update({
                    $source: this.parent.$el,
                    view: new SymbolStyleMenuView({
                        app: this.app,
                        model: this.symbolModel,
                        layer: this.parent.layer
                    }),
                    placement: 'right',
                    offsetX: '5px',
                    width: '220px',
                    title: '    '
                });
                e.preventDefault();
                e.stopImmediatePropagation();
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
                    this.centerIfOutsideMapBounds(this.overlay);
                }
                this.render();
            },

            // only center the active overlay if it is outside the current boundaries of the map
            centerIfOutsideMapBounds: function(overlay) {
                if (!this.app.map.getBounds().contains(overlay.getCenter())) {
                    overlay.centerOn();
                }
            },

            // this function only does something when adding or deleting entire markers:
            updateGeometry: function() {

                if (!this.model.get('geometry')) { // delete marker
                    if (this.overlay) {
                        this.overlay.destroy();
                        this.overlay = null;
                    }
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
                //console.log('destroying symbol-item-view');
                if (this.overlay != null) {
                    this.overlay.destroy();
                }
            }
        });
        return SymbolItemView;
    });
