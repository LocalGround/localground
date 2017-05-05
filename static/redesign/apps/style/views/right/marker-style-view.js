define(["jquery",
        "backbone",
        "marionette",
        "handlebars",
        "lib/maps/icon-lookup",
        "text!../../templates/right/marker-style.html",
        "text!../../templates/right/marker-style-child.html",
        "collections/symbols",
        "palette"
    ],
    function ($, Backbone, Marionette, Handlebars, IconLookup, MarkerStyleTemplate, MarkerStyleChildTemplate, Symbols) {
        'use strict';

        var MarkerStyleView = Marionette.CompositeView.extend({
            buckets: 4,
            paletteOpacity: .8,
            width: 50,
            categoricalList: [],
            continuousList: [],
            allColors: [],
            rules: [],
            layerDraft: {
                continuous: null,
                categorical: null,
                simple: null, 
                individual: null
            },
            template: Handlebars.compile(MarkerStyleTemplate),
            modelEvents: {
                'change:symbols': 'reRender'
            },
            //each of these childViews is a symbol. this view render the value-rules box
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
                        console.log(this, this.dataType);
                        return {
                            dataType: this.dataType,
                            icons: IconLookup.getIcons()
                        };
                    },
                    setSymbol: function (e) {
                        this.model.set("shape", $(e.target).val());
                        console.log(this.model);
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
                    layer: this.model,
                    dataType: this.dataType
                };
            },

            initialize: function (opts) {
                _.extend(this,opts);
                this.dataType = this.model.get("layer_type");
                this.data_source = this.model.get("data_source"); //e.g. "form_1"
                console.log(this.model);
                console.log(this.dataType);
                console.log(this.data_source);
                this.buildColumnList();
                this.displaySymbols();
                this.listenTo(this.app.vent, 'find-datatype', this.selectDataType);
                this.buildPalettes();
                $('body').click(this.hideColorRamp);
                this.listenTo(this.app.vent, 'update-data-source', this.buildColumnList);
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
                this.addNewSymbol();
            },

            addNewSymbol: function() {
                this.collection.add({
                    "fillOpacity": 0.5,
                    "title": "Less Than 50",
                    "strokeWeight": 5,
                    "strokeOpacity": 0.5,
                    "rule": "b < 50",
                    "width": 50,
                    "shape": "photo",
                    "fillColor": "#FFFFFF",
                    "strokeColor": "#7075FF",
                   // "id": 100,
                    "color": "#000" 
                });
                console.log("new symbol called", this.collection);
                this.render();
            },

            templateHelpers: function () {
                var helpers = {
                    dataType: this.dataType,
                    allColors: this.allColors,
                    buckets: this.buckets,
                    categoricalList: this.categoricalList,
                    continuousList: this.continuousList, 
                    paletteOpacity: this.paletteOpacity,
                    icons: IconLookup.getIcons()
                };
                if (this.fields) {
                    helpers.properties = this.fields.toJSON();
                }
                return helpers;
            },

            events: {
                'change #data-type-select': 'selectDataType',
                'change #cat-prop': 'catData',
                'change #cont-prop': 'contData',
                'change #bucket': 'buildPalettes',
                'change #palette-opacity': 'updatePaletteOpacity',
                'change .global-marker-shape': 'updateGlobalShape',
                'change .marker-width': 'updateWidth',
                'change #stroke-weight': 'updateStrokeWeight',
                'change #stroke-color': 'updateStrokeColor',
                'change #stroke-opacity': 'updateStrokeOpacity',
                'click .selected-palette-wrapper': 'showPalettes',
                'click .palette-list': 'selectPalette'
            },

            selectDataType: function (e) {
                //this.dataType = this.$el.find("#data-type-select").val();
                this.dataType = $(e.target).val();
                this.render();
                this.buildColumnList();
                if (this.dataType == "continuous") {
                    this.contData();
                }
                if (this.dataType == "categorical") {
                    this.catData();
                }
            },


            displaySymbols: function () {
                this.collection = new Backbone.Collection(this.model.get("symbols"));

                this.render();
                this.addNewSymbol();
            },
            buildColumnList: function () {
                this.categoricalList.length = 0;
                this.continuousList.length = 0;
                var key = this.model.get('data_source'),
                    dataEntry = this.app.dataManager.getData(key);
                console.log(dataEntry);
                //still need to account for map-images below...
                if (key == "photos" || key == "audio") {
                    var list = ["id", "name", "caption", "tags", "owner", "attribution"];
                    for (var i=0;i<list.length;i++) {
                        this.categoricalList.push({
                            text: list[i], 
                            value:list[i]
                        });
                    }
                } else if (key == "markers") {
                    //this.categoricalList = ["id", "name", "caption", "tags", "owner"];
                    var list = ["id", "name", "caption", "tags", "owner"];
                    for (var i=0;i<list.length;i++) {
                        this.categoricalList.push({
                            text: list[i], 
                            value:list[i]
                        });
                    }
                } else if (key.includes("form_")) {
                    var that = this;
                    dataEntry.fields.models.forEach(function(log) {
                        if (log.get("data_type") == "text") {
                            that.categoricalList.push({
                                text: log.get("col_alias"),
                                value: log.get("col_name")
                            });
                        } else if (log.get("data_type") == "integer"){
                            that.continuousList.push({
                                text: log.get("col_alias"),
                                value: log.get("col_name")
                            });
                        }
                      
                    });

                }
                this.render();
                this.contData();
                this.catData();
            },
            contData: function() {
                this.buckets = this.$el.find("#bucket").val() || 4;
                var key = this.model.get('data_source'); 
                var valueList = []
                this.continuousData = [];
                var dataEntry = this.app.dataManager.getData(key);
                var $selected = this.$el.find("#cont-prop").val();
                var that = this;
                dataEntry.collection.models.forEach(function(d) {
                    that.continuousData.push(d.get($selected));
                });
                console.log(this.continuousData);
                var min = Math.min(...this.continuousData),
                    max = Math.max(...this.continuousData), 
                    range = max-min,
                    segmentSize = range/this.buckets,
                    currentFloor = min,
                    counter = 0;
                console.log(range, this.buckets, segmentSize);
                this.layerDraft.continuous = new Symbols();
                while (currentFloor < max) {
                    console.log("bucket #" + counter, this.allColors[0][counter]);
                    this.layerDraft.continuous.add({
                        "rule": $selected + " >= " + currentFloor.toFixed(2) + " < " + (currentFloor + segmentSize).toFixed(2),
                        "title": $selected + " greater than " + currentFloor.toFixed(2) + " and less than " + (currentFloor + segmentSize).toFixed(2),
                        "fillOpacity": parseFloat(this.$el.find("#palette-opacity").val()),
                        "strokeWeight": parseFloat(this.$el.find("#stroke-weight").val()),
                        "strokeOpacity": parseFloat(this.$el.find("#stroke-opacity").val()),
                        "width": parseFloat(this.$el.find("#marker-width").val()) || 20,
                        "shape": this.$el.find(".global-marker-shape").val(),
                        "fillColor": this.allColors[1][counter],
                        "strokeColor": "#" + this.$el.find("#stroke-color").val(),
                        "color": this.allColors[1][counter],
                        "id": (counter + 1)
                    });
                    counter++;
                    currentFloor += segmentSize;

                }
                this.collection = this.layerDraft.continuous;
                this.model.set("symbols", this.layerDraft.continuous.toJSON());
                console.log(this.collection);

                this.render();
/*
                dataEntry.collection.models.forEach(function(d) {
                    console.log(d, $selected);
                    console.log(d.get($selected), segmentSize);
                });
                */
                
            },

           

            catData: function() {  
                var key = this.model.get('data_source'); 
                this.categoricalData = this.app.dataManager.getData(key);
                console.log(this.categoricalData);
                var $selected = this.$el.find("#cat-prop").val();
                console.log($selected);
                this.categoricalData.collection.models.forEach(function(d) {
                    console.log(d.get($selected));
                });
            },

            getPropertiesCategorical: function () {
                this.properties = [];
            },

            getPropertiesContinuous: function () {
                this.properties = [];
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
                this.allColors = [seq1, seq2, seq3, seq4, seq5, seq6];
               // this.allColors.push(seq1, seq2, seq3, seq4, seq5, seq6);
                this.contData();
                this.render();
            },

            updatePaletteOpacity: function() {
                var opacity = this.$el.find("#palette-opacity").val();
                if (opacity > 1) {
                    opacity = 1;
                } else if (opacity < 0 ) {
                    opacity = 0;
                } 
                console.log(this.model.get("symbols"));
                this.paletteOpacity = opacity;
               // this.model.symbols.set("fillOpacity", this.paletteOpacity);
                this.render();
            },

            updateGlobalShape: function(e) {
            //    this.model.set("shape", $(e.target).val());
            },

            updateWidth: function(e) {
            //    this.model.set("width", $(e.target).val());    
            },

            updateStrokeWeight: function(e) {
            //    this.model.set("strokeWeight", $(e.target).val());    
            },

            updateStrokeColor: function(e) {
            //    this.model.set("strokeColor", $(e.target).val());    
            },

            updateStrokeOpacity: function(e) {
                var opacity = this.$el.find("#stroke-opacity").val();
                    if (opacity > 1) {
                        opacity = 1;
                    } else if (opacity < 0 ) {
                        opacity = 0;
                    } 
            //    this.model.set("strokeOpacity", $(e.target).val());   
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