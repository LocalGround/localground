define(["jquery",
        "backbone",
        "marionette",
        "handlebars",
        "lib/maps/icon-lookup",
        "text!../../templates/right/marker-style.html",
        "text!../../templates/right/marker-style-child.html",
        "palette"
    ],
    function ($, Backbone, Marionette, Handlebars, IconLookup, MarkerStyleTemplate, MarkerStyleChildTemplate) {
        'use strict';

        var MarkerStyleView = Marionette.CompositeView.extend({
            buckets: 4,
            template: Handlebars.compile(MarkerStyleTemplate),
            modelEvents: {
                'change:symbols': 'reRender'
            },
            getChildView: function () {
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                    },
                    template: Handlebars.compile(MarkerStyleChildTemplate),
                    events: {
                        'change .marker-shape': 'setSymbol'
                    },
                    modelEvents: {
                        'change': 'updateLayerSymbols'
                    },
                    tagName: "tr",
                    className: "table-row",
                    templateHelpers: function () {
                        return {
                            dataType: this.dataType,
                            icons: IconLookup.getIcons()
                        };
                    },
                    setSymbol: function (e) {
                        this.model.set("shape", $(e.target).val());
                    },
                    updateLayerSymbols: function () {
                        this.layer.setSymbol(this.model);
                    }
                });
            },
            childViewContainer: "#symbols",

            childViewOptions: function () {
                return {
                    app: this.app,
                    layer: this.model
                };
            },

            initialize: function (opts) {
                this.app = opts.app;
                this.model = opts.model;
                this.dataType = this.model.get("layer_type");
                this.displaySymbols();
                this.listenTo(this.app.vent, 'find-datatype', this.selectDataType);
                this.buildPalettes();
                $('body').click(this.hideColorRamp);
            },

            hideColorRamp: function (e) {
                var $el = $(e.target);
                if (!$el.hasClass('palette-wrapper') &&
                        !$el.parent().hasClass('selected-palette-list') &&
                        !$el.parent().hasClass('selected-palette-wrapper') &&
                        !$el.parent().hasClass('selected-ul')
                        ) {
                    $(".palette-wrapper").hide();
                }
            },

            reRender: function () {
                //rebuild symbols collection based on updated info:
                this.collection = new Backbone.Collection(this.model.get("symbols"));
                this.render();
            },

            templateHelpers: function () {
                return {
                    dataType: this.dataType,
                    allColors: this.allColors,
                    buckets: this.buckets
                };
            },

            events: {
                'change #data-type-select': 'selectDataType',
                'change #bucket': 'buildPalettes',
                'click .selected-palette-wrapper': 'showPalettes',
                'click .palette-list': 'selectPalette'
            },

            selectDataType: function () {
                this.dataType = this.$el.find("#data-type-select").val();
                this.render();
            },

            displaySymbols: function () {
                this.collection = new Backbone.Collection(this.model.get("symbols"));
                this.render();
            },
            buildDropdown: function () {
                console.log(this.fields);
            },

            buildPalettes: function () {
                var seq1, seq2, seq3, seq4, seq5, seq6;
                this.buckets = this.$el.find("#bucket").val() || 4;
                seq1 = palette('tol-dv', this.buckets);
                seq2 = palette('cb-Blues', this.buckets);
                seq3 = palette('cb-Oranges', this.buckets);
                seq4 = palette('cb-Greys', this.buckets);
                seq5 = palette('cb-YlGn', this.buckets);
                seq6 = palette('cb-RdYlBu', this.buckets);
                this.allColors = [];
                this.allColors.push(seq1, seq2, seq3, seq4, seq5, seq6);
                this.render();
                console.log(this.allColors);
            },

            showPalettes: function () {
                this.$el.find(".palette-wrapper").toggle();
            },

            selectPalette: function () {
                this.$el.find(".palette-wrapper").toggle();
                // Need to write some code to hide this when user clicks outside pop-up div

                // Need more code below to save and display selected palette
            }

        });
        return MarkerStyleView;
    });