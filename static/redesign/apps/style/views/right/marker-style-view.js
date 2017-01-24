define(["marionette",
        "handlebars",
        "collections/layers",
        "models/layer",
        "text!../../templates/right/marker-style.html",
        "text!../../templates/right/marker-style-child.html",
        "collections/records",
    ],
    function (Marionette, Handlebars, Layers, Layer, MarkerStyleTemplate, MarkerStyleChildTemplate, Records) {
        'use strict';

        var MarkerStyleView = Marionette.CompositeView.extend({

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
                this.listenTo(this.app.vent, 'send-collection', this.displaySymbols);
                this.listenTo(this.app.vent, 'find-datatype', this.selectDataType);
                
                /**
                 * here is some fake data until the
                 * /api/0/layers/ API Endpoint gets built. Note
                 * that each layer can have more than one symbol
                 */
            },
            
            templateHelpers: function () {
                return {
                    dataType: this.dataType
                };
            },
            
            events: {
                'change #data-type-select': 'selectDataType' 
            }, 
            
            selectDataType: function () {
                this.dataType = this.$el.find("#data-type-select").val();
                this.render();
            },
            
            displaySymbols: function (layer) {
                console.log(layer);
                this.model = layer;
                this.collection = new Backbone.Collection(this.model.get("symbols"));                
                var symbolsSource = layer.get("data_source");
                var id = symbolsSource.split("_")[1];
                
                var data = new Records(null, {
                        url: '/api/0/forms/' + id + '/data/'
                    });
                data.fetch();
                console.log(data);
                this.render();
            }

        });
        return MarkerStyleView;
    });