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
                this.listenTo(this.app.vent, "show-all-markers", this.markerOverlays.showAll.bind(this.markerOverlays));
                console.log(this.model);
            },

            show: function (e) {
                console.log('show all');
                this.markerOverlays.showAll();
                if (e) {
                    e.preventDefault();
                }
            },

            hide: function (e) {
                console.log('hide all');
                this.markerOverlays.hideAll();
                if (e) {
                    e.preventDefault();
                }
            },

            templateHelpers: function () {
                return {
                    count: this.symbolCount,
                    isShowing: this.getIsShowing(),
                    svg: this.model.toSVG(),
                    records: this.getRecordDisplayInfo(this.model.matchedModels)
                };
            },

            // this function takes in a collection of records as an argument
            // and returns an array of objects, each containing relevant display
            // information for a given record.
            getRecordDisplayInfo: function(collection) {
                let recordInfoList = [];
                
                collection.each((record) => {
                    console.log('INFO: ', record);
                    console.log('DISPLAY FIELD', this.model.layerModel.get('display_field'));
                    recordInfoList.push({
                        displayText: record.get(this.model.layerModel.get('display_field')) || 'Untitled',
                        id: record.id,
                        svg: this.getSVG(record, this.model)
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
                //this.model.set("isShowing", !this.$el.find('.symbol-display').hasClass('fa-eye'));
                console.log('showHideOverlays');
                if(this.$el.find('.legend-show_symbol').hasClass('fa-eye-slash')) {
                    this.$el.removeClass('half-opac');
                    this.$el.find('.legend-show_symbol').removeClass('fa-eye-slash');
                    this.$el.find('.legend-show_symbol').addClass('fa-eye');
                    this.show();
                } else {
                    this.$el.addClass('half-opac');
                    this.$el.find('.legend-show_symbol').removeClass('fa-eye');
                    this.$el.find('.legend-show_symbol').addClass('fa-eye-slash');
                    this.hide();
                }
            },

            getIsShowing: function () {
                return this.model.get('isShowing');
            },

            drawOverlays: function () {
                if (this.getIsShowing()) {
                    this.show();
                }
            }
        });
        return LegendSymbolEntry;
    });
