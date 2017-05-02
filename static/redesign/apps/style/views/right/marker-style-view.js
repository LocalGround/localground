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
            categoricalList: [],
            continuousList: [],
            allColors: [],
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
            },

            templateHelpers: function () {
                var helpers = {
                    dataType: this.dataType,
                    allColors: this.allColors,
                    buckets: this.buckets,
                    categoricalList: this.categoricalList,
                    continuousList: this.continuousList
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
                'click .selected-palette-wrapper': 'showPalettes',
                'click .palette-list': 'selectPalette'
            },

            selectDataType: function () {
                this.dataType = this.$el.find("#data-type-select").val();
                this.render();
                this.buildColumnList();
                this.contData();
                this.catData();
            },


            displaySymbols: function () {
                this.collection = new Backbone.Collection(this.model.get("symbols"));
                this.render();
            },
            buildColumnList: function () {
                this.categoricalList.length = 0;
                this.continuousList.length = 0;
                var key = this.model.get('data_source'),
                    dataEntry = this.app.dataManager.getData(key);
               
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
                console.log(key);
                var valueList = []
                this.continuousData = [];
                var dataEntry = this.app.dataManager.getData(key);
                var $selected = this.$el.find("#cont-prop").val();
                var that = this;
                console.log(dataEntry);
                dataEntry.collection.models.forEach(function(d) {
                    console.log(d);
                    that.continuousData.push(d.get($selected));
                });
                console.log(this.continuousData);
                var min = Math.min(...this.continuousData),
                    max = Math.max(...this.continuousData), 
                    range = max-min,
                    segmentSize = range/this.buckets;
                console.log(range, this.buckets, segmentSize);
                dataEntry.collection.models.forEach(function(d) {
                    console.log(d.get($selected), segmentSize);
                    if (d.get($selected) <= segmentSize) {
                        //need to determine proper place to store color information for each data unit/row
                        d.contColor = that.allColors[0][0];
                        console.log("1st bucket ", d);
                    } else if (d.get($selected) <= 2*segmentSize) {
                        d.contColor = that.allColors[0][1];
                        console.log("2nd bucket ",d);
                    }

                });
                
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