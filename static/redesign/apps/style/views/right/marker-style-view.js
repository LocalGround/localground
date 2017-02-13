define(["marionette",
        "handlebars",
        "collections/layers",
        "models/layer",
        "text!../../templates/right/marker-style.html",
        "text!../../templates/right/marker-style-child.html",
        "collections/records",
        "collections/fields",
        "palette"
    ],
    function (Marionette, Handlebars, Layers, Layer, MarkerStyleTemplate, MarkerStyleChildTemplate, Records, Fields, Palette) {
        'use strict';

        var MarkerStyleView = Marionette.CompositeView.extend({
            buckets: 4,
            template: Handlebars.compile(MarkerStyleTemplate),
            
            getChildView: function () {
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                    },
                    template: Handlebars.compile(MarkerStyleChildTemplate),
                    modelEvents: {},
                    events: {},
                    tagName: "tr",
                    className: "table-row",
                    templateHelpers: function () {
                        return {
                            dataType: this.dataType
                        };
                    }
                });
            },
            childViewContainer: "#symbols",
            
            childViewOptions: function () {
              return { app: this.app };  
            },

            initialize: function (opts) {
                this.app = opts.app;
                this.model = opts.model;
                this.dataType = this.model.get("layer_type");
                this.displaySymbols();
                this.listenTo(this.app.vent, 'find-datatype', this.selectDataType);
                this.buildPalettes();
            },
            
            reRender: function () {
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
                //console.log(layer);
                //this.model = layer;
                this.collection = new Backbone.Collection(this.model.get("symbols"));                
                //var symbolsSource = "form_4";
                //layer.get("data_source");
        
                /*var id = this.model.get("data_source").split("_")[1];
                
                var data = new Records(null, {
                        url: '/api/0/forms/' + id + '/data/'
                    });
                this.fields = new Fields(null, {
                        url: '/api/0/forms/' + id + '/fields/'
                    });
                data.fetch();
                this.fields.fetch( { reset: true });
                this.listenTo(this.fields, 'reset', this.buildDropdown);
                console.log(data);*/
                this.render();
            },
            buildDropdown: function () {
                console.log(this.fields);
            },
            
            buildPalettes: function () {
                this.buckets = this.$el.find("#bucket").val();
                var seq1 = palette('tol-dv', this.buckets);
                var seq2 = palette('cb-Blues', this.buckets);
                var seq3 = palette('cb-Oranges', this.buckets);
                var seq4 = palette('cb-Greys', this.buckets);
                var seq5 = palette('cb-YlGn', this.buckets);
                var seq6 = palette('cb-RdYlBu', this.buckets);
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