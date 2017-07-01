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
                //'change:symbols': 'render'//,
                //'change:metadata': 'contData'
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
                _.extend(this, opts);
                console.log('initialize', this.collection);
                this.dataType = this.model.get("layer_type");
                this.data_source = this.model.get("data_source"); //e.g. "form_1"
                this.listenTo(this.app.vent, 'find-datatype', this.selectDataType);
                this.buildPalettes();
                this.buildColumnList();
             //   this.displaySymbols();
                $('body').click(this.hideColorRamp);
                this.listenTo(this.app.vent, 'update-data-source', this.buildColumnList);
            },

            onRender: function () {
                var that = this;
                var newHex;
                $(".marker-style-color-picker").remove();
                this.$el.find('#stroke-color-picker').ColorPicker({
            
                    onShow: function (colpkr) {
                        console.log("colorPicker show");
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        console.log("colorPicker hide");
                        that.updateStrokeColor(newHex);
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onChange: function (hsb, hex, rgb) {
                        console.log("colorPicker changed");
                        newHex = hex;
                    },
                });
                $(".colorpicker:last-child").addClass('marker-style-color-picker');
            },

            hideColorRamp: function (e) {
                var $el = $(e.target);

                if (!$el.hasClass('palette-wrapper') &&
                        !$el.hasClass('selected-palette-list') &&
                        !$el.hasClass('selected-palette-wrapper') &&
                        !$el.hasClass('selected-ul') &&
                        !$el.hasClass('palette-item')
                        ) {
                    $(".palette-wrapper").hide();
                }
            },
/*
            reRender: function () {
                console.log("symbol change registered");
                //rebuild symbols collection based on updated info:
                this.collection = new Backbone.Collection(this.model.get("symbols"));
                this.render();
            },
*/
            templateHelpers: function () {
                var metadata = this.model.get("metadata");
                console.log(metadata);
                var helpers = {
                    metadata: metadata,
                    dataType: this.dataType,
                    allColors: this.allColors,
                    selectedColorPalette: this.selectedColorPalette,
                    categoricalList: this.categoricalList,
                    continuousList: this.continuousList, 
                    icons: IconLookup.getIcons(),
                    selectedProp: this.selectedProp
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
                'click .palette-list': 'selectPalette',
                'click .palette-list *': 'selectPalette'
            },

            selectDataType: function (e) {
                console.log(this.dataType);
                console.log($(e.target).val());
                //this.dataType = this.$el.find("#data-type-select").val();
                this.dataType = $(e.target).val() || this.$el.find("#data-type-select").val(); //$(e.target).val();
                console.log(this.dataType);
                this.render();
                this.buildColumnList();

            },

            displaySymbols: function () {
                this.collection = new Backbone.Collection(this.model.get("symbols"));
                this.render();
            },
            buildColumnList: function () {
                this.categoricalList = [];
                this.continuousList = [];
                var key = this.model.get('data_source'),
                    dataEntry = this.app.dataManager.getData(key);
                console.log("TESTING THIS",dataEntry, key);
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
                    console.log(dataEntry.fields.models);
                    dataEntry.fields.models.forEach(function(log) {
                        if (log.get("data_type") === "text" || log.get("data_type") === "choice") {
                            that.categoricalList.push({
                                text: log.get("col_alias"),
                                value: log.get("col_name")
                            });
                        } else if (log.get("data_type") === "integer" || log.get("data_type") === "rating"){
                            that.continuousList.push({
                                text: log.get("col_alias"),
                                value: log.get("col_name")
                            });
                        }
                    });
                }
                this.render();
                if (this.dataType == "continuous") {
                    this.contData();
                }
                if (this.dataType == "categorical") {
                    this.catData();
                }
                if (this.dataType == "basic") {
                    this.simpleData();
                }
            },
            contData: function() {
                console.log("cont change registered");
                var buckets = this.model.get("metadata").buckets;
                var key = this.model.get('data_source'); 
                this.continuousData = [];
                var dataEntry = this.app.dataManager.getData(key);
                var $selected = this.$el.find("#cont-prop").val();
                this.selectedProp = $selected;
                var that = this;
                dataEntry.collection.models.forEach(function(d) {
                    that.continuousData.push(d.get($selected));
                });
                var min = Math.min(...this.continuousData),
                    max = Math.max(...this.continuousData), 
                    range = max - min,
                    segmentSize = range / buckets,
                    currentFloor = min,
                    counter = 0;
                this.layerDraft.continuous = new Symbols();
                
                while (currentFloor < max) {
                    this.layerDraft.continuous.add({
                        "rule": $selected + " >= " + currentFloor.toFixed(0) + " and " + $selected + " <= " + (currentFloor + segmentSize).toFixed(0),
                        "title": "between " + currentFloor.toFixed(0) + " and " + (currentFloor + segmentSize).toFixed(0),
                        "fillOpacity": parseFloat(this.$el.find("#palette-opacity").val()),
                        "strokeWeight": parseFloat(this.$el.find("#stroke-weight").val()),
                        "strokeOpacity": parseFloat(this.$el.find("#stroke-opacity").val()),
                        "width": parseFloat(this.$el.find("#marker-width").val()) || 20,
                        "shape": this.$el.find(".global-marker-shape").val(),
                        "fillColor": "#" + this.selectedColorPalette[counter],
                      //  "strokeColor": "#" + this.$el.find("#stroke-color").val(),
                        "strokeColor": this.model.get("metadata").strokeColor,
                        //"color": "#" + this.selectedColorPalette[counter],
                        "id": (counter + 1)
                    });
                    console.log(that.layerDraft.continuous);
                    counter++;
                    currentFloor += segmentSize;
                }
                this.collection = this.layerDraft.continuous;
                console.log('continuous:', this.layerDraft.continuous.toJSON());
                this.model.set("symbols", this.layerDraft.continuous.toJSON());
                this.updateMap();
                this.render();
            },

            catData: function() { 
                console.log("catData triggered"); 
                var that = this,
                list = [],
                instanceCount = {},
                key = this.model.get('data_source'),
                $selected = this.$el.find("#cat-prop").val(),
                counter = 0,
                fillColorList = ["446e91", "449169", "e81502", "e88401", "6c00e8"];
                this.categoricalData = this.app.dataManager.getData(key);
                this.selectedProp = $selected
                console.log("updated selected property", this.selectedProp);
                that.layerDraft.categorical = new Symbols();
                that.categoricalData.collection.models.forEach(function(d) {
                    if (!list.includes(d.get($selected)) && d.get($selected)) {
                        list.push(d.get($selected));
                        instanceCount[d.get($selected)] = 1;
                    } else {
                        instanceCount[d.get($selected)]++;
                    }                    
                });
                console.log(list);
                list.forEach(function(item){
                    that.layerDraft.categorical.add({
                        "rule": that.selectedProp + " = " + item,
                        "title": item,
                        "fillOpacity": 1,
                        "strokeWeight": parseFloat(that.$el.find("#stroke-weight").val()),
                        "strokeOpacity": parseFloat(that.$el.find("#stroke-opacity").val()),
                        "width": parseFloat(that.$el.find("#marker-width").val()) || 20,
                        "shape": that.$el.find(".global-marker-shape").val(),
                        "fillColor": "#" + fillColorList[counter],
                        "strokeColor": that.model.get("metadata").strokeColor,
                        "id": (counter + 1), 
                        "instanceCount": instanceCount[item]
                    });
                    counter++;
                });
                this.collection = this.layerDraft.categorical;
                console.log('categorical:', this.layerDraft.categorical.toJSON());
                this.model.set("symbols", this.layerDraft.categorical.toJSON());
                this.updateMap();
                this.render();
            },

            simpleData: function () {
                console.log("simpleData triggered", this.model); 
                console.log(this.app.dataManager.getDataSources());
                var that = this,
                key = this.model.get('data_source'),
                name = this.app.dataManager.getData(key).name;
                this.categoricalData = this.app.dataManager.getData(key);
                console.log(this.categoricalData);
                var owner = this.categoricalData.collection.models[0].get("owner");

                if (this.model.getSymbols().length > 0) {
                    this.layerDraft.simple = this.model.getSymbols();
                } else {
                    this.layerDraft.simple = new Symbols([{
                        "rule": "*",
                        "title": name,
                        "shape": "circle",
                        "fillColor": "#60c7cc",
                        "id": 1
                    }]);
                }
                console.log("before adding new symbols", this.collection);
                this.collection = this.layerDraft.simple;
                console.log("after adding new symbols",this.collection);
                console.log('simple:', this.layerDraft.simple.toJSON());
                this.model.set("symbols", this.layerDraft.simple.toJSON());
                this.updateMap();
                this.render();
            },

            delayExecution: function (timeoutVar, func, millisecs) {
                /*
                 * This method applies a time buffer to whatever
                 * "func" function is passed in as an argument. So,
                 * for example, if a user changes the width value,
                 * and then changes it again before "millisecs"
                 * milliseconds pass, the new value will "reset the clock,"
                 * and the "func" function won't fire until the
                 * user stops changing the value.
                 */
                if (this[timeoutVar]) {
                    clearTimeout(this[timeoutVar]);
                    this[timeoutVar] = null;
                }
                this[timeoutVar] = setTimeout(func, millisecs);
            },

            updateBuckets: function (e) {
                console.log("update buckets triggered");
                var that = this;
                this.delayExecution(
                    "bucketTimer",
                    function () {
                        var buckets = parseFloat(that.$el.find("#bucket").val());
                        console.log("the bucket #: ",buckets);
                        that.updateMetadata("buckets", buckets);
                        that.buildPalettes();
                        that.$el.find("#bucket").focus();
                    },
                    500 //experiment with how many milliseconds to delay
                );
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

            updateMap: function () {
                console.log('updateMap');
                var that = this;
                this.delayExecution("mapTimer", function () {
                    that.model.trigger('rebuild-markers')
                }, 250);
            },

            updatePaletteOpacity: function() {
                var opacity = parseFloat(this.$el.find("#palette-opacity").val());
                if (opacity > 1) {
                    opacity = 1;
                } else if (opacity < 0 ) {
                    opacity = 0;
                } 
                this.updateMetadata("fillOpacity", opacity);
                this.updateMap();
                //this.render();
            },

            updateGlobalShape: function(e) {
                var shape = $(e.target).val();
                this.updateMetadata("shape", shape);
                this.updateMap();
            },

            updateWidth: function(e) {
                var width = parseFloat($(e.target).val());
                this.updateMetadata("width", width);
                this.updateMap();
            },

            updateStrokeWeight: function(e) {
                var strokeWeight = parseFloat($(e.target).val());
                this.updateMetadata("strokeWeight", strokeWeight);
                this.updateMap();
            },

            updateStrokeOpacity: function(e) {
                var opacity = parseFloat($(e.target).val());
                    if (opacity > 1) {
                        opacity = 1;
                    } else if (opacity < 0 ) {
                        opacity = 0;
                    } 
                this.updateMetadata("strokeOpacity", opacity);
                this.updateMap();
            },

            // triggered from colorPicker
            updateStrokeColor: function (hex) {
                console.log("update stroke color triggered");
                this.updateMetadata("strokeColor", '#' + hex);
                $('#stroke-color-picker').css('color', '#' + hex);
                this.updateMap();
            },

            selectPalette: function (e) {
                this.$el.find(".palette-wrapper").toggle();
                var paletteId = $(e.target).val();
                this.updateMetadata("paletteId", paletteId);
                this.selectedColorPalette = this.allColors[paletteId];
                this.contData();
            }, 

            showPalettes: function () {
                this.$el.find(".palette-wrapper").css({display: 'block'});
                this.$el.find(".palette-wrapper").addClass("okok");
            },

            //convenience function
            updateMetadata: function(newKey, newValue) {
                var that = this;
                console.log("a.", this.collection.length, this.model.getSymbols().length);
                var localMeta = this.model.get("metadata") || {},
                    that = this;
                localMeta[newKey] = newValue;
                this.model.set("metadata", localMeta); 
                
                console.log("b.", this.collection.length, this.model.getSymbols().length);
                this.collection.each(function(symbol) {
                    console.log(symbol.id, that.model.getSymbols().length);
                    symbol.set(newKey, newValue);
                    console.log(symbol.id, that.model.getSymbols().length);
                });
                this.app.layerHasBeenAltered = true;
                this.app.layerHasBeenSaved = false;
                
                console.log("c.", this.collection.length, this.model.getSymbols().length);
               // this.model.trigger('rebuild-markers');
            }

        });
        return MarkerStyleView;
    });
