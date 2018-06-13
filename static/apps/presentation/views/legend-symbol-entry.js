define(['marionette',
        'underscore',
        'jquery',
        'handlebars',
        'lib/maps/marker-overlays',
        'text!../templates/legend-symbol-item.html'
    ],
    function (Marionette, _, $, Handlebars, MarkerOverlays, SymbolTemplate) {
        'use strict';

        var LegendSymbolEntry = Marionette.ItemView.extend({
            tagName: "li",

            events: {
                'change .cb-symbol': 'showHide'
            },

            showHide: function (e) {
                var isChecked = $(e.target).prop('checked');
                if (isChecked) {
                    this.markerOverlays.showAll();
                } else {
                    this.markerOverlays.hideAll();
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
                    svg: this.model.toSVG()
                };
            },
            getIsShowing: function () {
                return this.model.get('isShowing');
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
            },

            onRender: function(){
                if (this.getIsShowing()) {
                    this.show();
                }
            }
        });
        return LegendSymbolEntry;
    });
