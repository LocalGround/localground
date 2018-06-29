define(['marionette',
        'underscore',
        'jquery',
        'handlebars',
        'lib/maps/marker-overlays',
        'text!../templates/legend-symbol-item.html'
    ],
    function (Marionette, _, $, Handlebars, MarkerOverlays, SymbolTemplate) {
        'use strict';

        // in this view, each childview is a symbol
        var LegendSymbolEntry = Marionette.ItemView.extend({
            tagName: "li",
            className: "symbol-entry",

            events: {
                'click .legend-show_symbol': 'showHideOverlays'
            },

            initialize: function (opts) {
                _.extend(this, opts);

                this.template = Handlebars.compile(SymbolTemplate);
                this.markerOverlays = new MarkerOverlays({
                    model: this.model,
                    collection: this.model.getModels(),
                    map: this.app.model,
                    app: this.app,
                    iconOpts: this.model.toJSON(),
                    isShowing: this.getIsShowing()
                });
                
                this.activeRecordId = null;
                this.activeLayerId = null;

                this.listenTo(this.app.vent, "show-all-markers", this.markerOverlays.showAll.bind(this.markerOverlays));
                this.listenTo(this.app.vent, 'show-detail', this.handleRoute);
                console.log(this.model);
            },

            onRender: function() {
                console.log('symbol onRender', this.model);
                if (!this.model.get('isShowing')) {
                    this.addHiddenCSS();
                }
            },

            show: function (e) {
                this.markerOverlays.showAll();
                if (e) {
                    e.preventDefault();
                }
            },

            hide: function (e) {
                this.markerOverlays.hideAll();
                if (e) {
                    e.preventDefault();
                }
            },

            templateHelpers: function () {
                return {
                    count: this.symbolCount,
                    isShowing: this.getIsShowing(),
                    symbolSvg: this.model.toSVG(),
                    records: this.getRecordDisplayInfo(this.model.matchedModels),
                    layerIsIndividual: this.model.layerModel.isIndividual(),
                    //activeRecordId: (this.model.layerModel.id === this.activeLayerId) ? this.activeRecordId : null,
                    activeItemId: `${this.activeLayerId}/${this.activeRecordId}`
                };
            },

            // this function takes in a collection of records as an argument
            // and returns an array of objects, each containing relevant display
            // information for a given record.
            getRecordDisplayInfo: function(collection) {
                let recordInfoList = [];
                
                collection.each((record) => {
                    const dataset = this.model.layerModel.get('dataset').overlay_type;
                    const recordId = record.id;
                    const layerId = this.model.layerModel.id

                    recordInfoList.push({
                        displayText: record.get(this.model.layerModel.get('display_field')) || 'Untitled',
                        url: `#/layers/${layerId}/${dataset}/${recordId}`,
                        recordSvg: this.getSVG(record, this.model), 
                        //id: recordId,
                        itemId: `${layerId}/${recordId}` 
                    });
                });

                return recordInfoList;
            },

            getSVG: function (record, symbol) {
                const symbolIcon = symbol.get('icon');
                if (record.get('geometry') === null) {
                    return;
                }
                const geomType = record.get('geometry').type;
                if (geomType === 'Point') {
                    return symbol.toSVG();
                } else if (geomType === 'LineString') {
                    return `
                        <svg width="25px" height="25px" viewBox="0 0 25 25">
                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="Polyline" stroke="${symbolIcon.fillColor}">
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
                            <g id="Polygon" stroke="${symbolIcon.fillColor}">
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

            showHideOverlays: function () {
                this.model.set("isShowing", !this.$el.find('.legend-show_symbol').hasClass('fa-eye'));
                if(this.$el.find('.legend-show_symbol').hasClass('fa-eye-slash')) {
                    this.removeHiddenCSS();
                    this.show();
                } else {
                    this.addHiddenCSS();
                    this.hide();
                }
            },

            addHiddenCSS: function() {
                this.$el.addClass('half-opac');
                this.$el.find('.legend-show_symbol').removeClass('fa-eye');
                this.$el.find('.legend-show_symbol').addClass('fa-eye-slash');
            },

            removeHiddenCSS: function() {
                this.$el.removeClass('half-opac');
                this.$el.find('.legend-show_symbol').removeClass('fa-eye-slash');
                this.$el.find('.legend-show_symbol').addClass('fa-eye');
            },

            getIsShowing: function () {
                return this.model.get('isShowing');
            },

            drawOverlays: function () {
                if (this.getIsShowing()) {
                    this.show();
                }
            },

            handleRoute: function(info) {
                this.activeRecordId = parseInt(info.id);
                this.activeLayerId = parseInt(info.layerId);

                // check to see if the selected record is among a particular symbol's records
                const activeRecord = this.markerOverlays.collection.findWhere(
                    {'id': this.activeRecordId}
                );

                if (activeRecord && this.model.layerModel.id === parseInt(info.layerId)) {
                    this.activateMapMarker(info);
                }

                // due to 'this.activeRecordId' and 'this.activeLayerId' being used 
                // by template helpers, all that's needed to highlight the correct record  
                // in the legend panel is a simple rerender
                this.render();
            },

            activateMapMarker: function(info) {
                this.markerOverlays.children.each((mapMarkerView) => {
                    if (mapMarkerView.model.id === parseInt(info.id)) {

                        if (this.app.activateMapMarker && this.app.activateMapMarker.model.id !== parseInt(info.id)) {
                            this.app.activateMapMarker.deactivate();
                        }
                        this.app.activateMapMarker = mapMarkerView;
                        mapMarkerView.activate();
                    }
                });
            }
        });
        return LegendSymbolEntry;
    });