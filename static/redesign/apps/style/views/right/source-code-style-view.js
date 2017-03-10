define(["marionette",
        "handlebars",
        "collections/layers",
        "models/layer",
        "text!../../templates/right/source-code-style.html",
        "text!../../templates/right/marker-style-child.html",
        "collections/records",
        "collections/fields",
        "palette"
    ],
    function (Marionette, Handlebars, Layers, Layer, SourceCodeStyleTemplate, MarkerStyleChildTemplate, Records, Fields, Palette) {
        'use strict';

        var MarkerStyleView = Marionette.CompositeView.extend({
            buckets: 4,
            template: Handlebars.compile(SourceCodeStyleTemplate),
            
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
                'keyup .source-code': 'updateModel'
            }, 
            
            updateModel: function () {
                console.log(this.model);
                var sourceCode = JSON.parse(this.$el.find(".source-code").val());
                
                this.model.set("symbols", sourceCode);
                console.log(sourceCode);
                console.log(this.model);
            },

            selectDataType: function () {
                this.dataType = this.$el.find("#data-type-select").val();
                this.render();
            },
            
            displaySymbols: function () {
                this.collection = new Backbone.Collection(this.model.get("symbols"));                
                this.render();
            },
           
            
        
            
            
            

        });
        return MarkerStyleView;
    });