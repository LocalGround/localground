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
                    svg: this.model.toSVG()
                };
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
