define(["jquery",
        "backbone",
        "marionette",
        "handlebars",
        "lib/maps/icon-lookup",
        "text!../../templates/right/marker-style.html",
        "text!../../templates/right/marker-style-child.html",
        "collections/symbols",
        'color-picker-eyecon',
        "palette"
    ],
    function ($, Backbone, Marionette, Handlebars, IconLookup, MarkerStyleTemplate, MarkerStyleChildTemplate, Symbols, ColorPicker) {
        'use strict';

        var MarkerStyleView = Marionette.CompositeView.extend({
            categoricalList: [],
            continuousList: [],
            allColors: [],
            selectedColorPalette: null,
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

            //each of these childViews is a symbol. this view renders the value-rules box
            getChildView: function () {
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                        this.listenTo(this.app.vent, "update-opacity", this.updateSymbolOpacity);
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
                    //    console.log(this.model);
                        return {
                            dataType: this.dataType,
                            icons: IconLookup.getIcons(),
                            fillOpacity: this.fillOpacity
                        };
                    },
                    setSymbol: function (e) {
                        this.model.set("shape", $(e.target).val());
                    },
                    updateLayerSymbols: function () {
                        this.layer.setSymbol(this.model);
                    }, 
                    updateSymbolOpacity: function (opacity) {
                        this.model.set("fillOpacity", opacity);
                        this.render();
                       this.templateHelpers();
                    },

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
                this.buildPalettes();
                this.buildColumnList();
                this.displaySymbols();
                this.listenTo(this.app.vent, 'find-datatype', this.selectDataType);
                $('body').click(this.hideColorRamp);
                this.listenTo(this.app.vent, 'update-data-source', this.buildColumnList);
            },

            onRender: function () {
                var that = this;
                this.$el.find('#stroke-color-picker').ColorPicker({
            
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onChange: function (hsb, hex, rgb) {
                        that.updateStrokeColor(hex);
                    }
                });
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
                var metadata = this.model.get("metadata");
                var helpers = {
                    metadata: metadata,
                    dataType: this.dataType,
                    allColors: this.allColors,
                    selectedColorPalette: this.selectedColorPalette,
                    categoricalList: this.categoricalList,
                    continuousList: this.continuousList, 
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
                'change #bucket': 'updateBuckets',
                'change #palette-opacity': 'updatePaletteOpacity',
                'change .global-marker-shape': 'updateGlobalShape',
                'change #marker-width': 'updateWidth',
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
                var buckets = this.model.get("metadata").buckets;
                var key = this.model.get('data_source'); 
                var valueList = []
                this.continuousData = [];
                var dataEntry = this.app.dataManager.getData(key);
                var $selected = this.$el.find("#cont-prop").val();
                var that = this;
                dataEntry.collection.models.forEach(function(d) {
                    that.continuousData.push(d.get($selected));
                });
                var min = Math.min(...this.continuousData),
                    max = Math.max(...this.continuousData), 
                    range = max-min,
                    segmentSize = range/buckets,
                    currentFloor = min,
                    counter = 0;
                this.layerDraft.continuous = new Symbols();
                
                while (currentFloor < max) {
                    this.layerDraft.continuous.add({
                        "rule": $selected + " >= " + currentFloor.toFixed(2) + " < " + (currentFloor + segmentSize).toFixed(2),
                        "title": $selected + " greater than " + currentFloor.toFixed(2) + " and less than " + (currentFloor + segmentSize).toFixed(2),
                        "fillOpacity": parseFloat(this.$el.find("#palette-opacity").val()),
                        "strokeWeight": parseFloat(this.$el.find("#stroke-weight").val()),
                        "strokeOpacity": parseFloat(this.$el.find("#stroke-opacity").val()),
                        "width": parseFloat(this.$el.find("#marker-width").val()) || 20,
                        "shape": this.$el.find(".global-marker-shape").val(),
                        "fillColor": this.selectedColorPalette[counter],
                        "strokeColor": "#" + this.$el.find("#stroke-color").val(),
                        "color": this.selectedColorPalette[counter],
                        "id": (counter + 1)
                    });
                    counter++;
                    currentFloor += segmentSize;
                }
                this.collection = this.layerDraft.continuous;
                this.model.set("symbols", this.layerDraft.continuous.toJSON());
                this.render();
            },

            catData: function() {  
                var key = this.model.get('data_source'); 
                this.categoricalData = this.app.dataManager.getData(key);
                var $selected = this.$el.find("#cat-prop").val();
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

            updateBuckets: function(e) {
                var buckets = parseFloat($(e.target).val());
                this.updateMetedata("buckets", buckets);
                this.buildPalettes();
            },

            buildPalettes: function () {
                var seq1, seq2, seq3, seq4, seq5, seq6;
                var buckets = this.model.get("metadata").buckets; 
                var paletteId = this.model.get("metadata").paletteId || 0;
                
                seq1 = palette('cb-Blues', buckets);
                seq2 = palette('cb-Oranges', buckets);
                seq3 = palette('cb-Greys', buckets);
                seq4 = palette('cb-YlGn', buckets);
                seq5 = palette('cb-RdYlBu', buckets);
                seq6 = palette('tol-dv', buckets);
                this.allColors = [seq1, seq2, seq3, seq4, seq5, seq6];
                this.selectedColorPalette = this.allColors[paletteId];

                this.contData();
            },

            updatePaletteOpacity: function() {
                var opacity = parseFloat(this.$el.find("#palette-opacity").val());
                if (opacity > 1) {
                    opacity = 1;
                } else if (opacity < 0 ) {
                    opacity = 0;
                } 
                this.updateMetedata("fillOpacity", opacity);
                this.render();
            },

            updateGlobalShape: function(e) {
                var shape = $(e.target).val();
                this.updateMetedata("shape", shape);
            },

            updateWidth: function(e) {
                var width = $(e.target).val();
                this.updateMetedata("width", width);
            },

            updateStrokeWeight: function(e) {
                var strokeWeight = parseFloat($(e.target).val());
                this.updateMetedata("strokeWeight", strokeWeight);
            },

            updateStrokeOpacity: function(e) {
                var opacity = this.$el.find("#stroke-opacity").val();
                    if (opacity > 1) {
                        opacity = 1;
                    } else if (opacity < 0 ) {
                        opacity = 0;
                    } 
                this.updateMetedata("strokeOpacity", opacity);
            },

            showPalettes: function () {
                this.$el.find(".palette-wrapper").toggle();
            },

            // triggered from colorPicker
            updateStrokeColor: function (hex) {
                
                this.updateMetedata("strokeColor", hex);
                $('#stroke-color-picker').css('color', '#' + hex);
                this.render();
            },

            selectPalette: function (e) {
                this.$el.find(".palette-wrapper").toggle();
                var paletteId = $(e.target).val();
                this.updateMetedata("paletteId", paletteId);
                this.selectedColorPalette = this.allColors[paletteId];
                this.contData();
            }, 

            //convenience function
            updateMetedata: function(newKey, newValue) {
                var localMeta = this.model.get("metadata") || {};
                localMeta[newKey] = newValue;
                this.model.set("metadata", localMeta);                
            }

        });
        return MarkerStyleView;
    });