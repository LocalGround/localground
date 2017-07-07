define(["jquery",
        "backbone",
        "marionette",
        "handlebars",
        "lib/maps/icon-lookup",
        "apps/style/views/right/marker-style-view-child",
        "text!../../templates/right/marker-style.html",
        "collections/symbols",
        'color-picker-eyecon',
        "palette"
    ],
    function ($, Backbone, Marionette, Handlebars, IconLookup, MarkerStyleChildView, MarkerStyleTemplate, Symbols) {
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
            catDataHasBeenBuilt: false,
            template: Handlebars.compile(MarkerStyleTemplate),
            modelEvents: {
                //'change:symbols': 'render'//,
                //'change:metadata': 'contData'
            },

            //each of these childViews is a symbol. this view renders the value-rules box
            childView: MarkerStyleChildView,
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
                console.log('initialize', this.model.get('symbols'), this.collection);
                this.dataType = this.model.get('layer_type');
                this.data_source = this.model.get('data_source'); //e.g. "form_1"
                this.collection = new Symbols(this.model.get("symbols"));

                // builds correct palette on-load
                this.buildPalettes(this.getCategoricalInfo().list.length);
             
                $('body').click(this.hideColorRamp);

                this.listenTo(this.app.vent, 'find-datatype', this.selectDataType);
                this.listenTo(this.app.vent, 'update-data-source', this.render);
                this.listenTo(this.app.vent, 'update-map', this.updateMap);
            },

            onRender: function () {
                var that = this,
                    color = this.model.get('fillColor');
                $(".marker-style-color-picker").remove();
                this.$el.find('#stroke-color-picker').ColorPicker({

                    onShow: function (colpkr) {
                        console.log("colorPicker show");
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        console.log("colorPicker hide");
                        that.updateStrokeColor(color);
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onChange: function (hsb, hex, rgb) {
                        console.log("colorPicker changed");
                        color = "#" + hex;
                    }
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
                var metadata = this.model.get("metadata"),
                    helpers;
                console.log(metadata);
                helpers = {
                    metadata: metadata,
                    dataType: this.dataType,
                    allColors: this.allColors,
                    selectedColorPalette: this.selectedColorPalette,
                    categoricalList: this.buildColumnList()[0],
                    continuousList: this.buildColumnList()[1],
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
                this.dataType = $(e.target).val() || this.$el.find("#data-type-select").val(); //$(e.target).val();
                this.model.set("layer_type", this.dataType);
                this.render();
                this.createCorrectSymbols();
            },

            displaySymbols: function () {
                this.collection = new Symbols(this.model.get("symbols"));
                this.render();
            },
            buildColumnList: function () {
                //clearing out the lists
                this.categoricalList = [];
                this.continuousList = [];
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
                    var list = ["name", "caption", "tags", "owner"];
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
                return [this.categoricalList, this.continuousList];
            },

            createCorrectSymbols: function () {
                if (this.dataType == "continuous") {
                    this.contData();
                } else if (this.dataType == "categorical") {
                    if (!this.model.get("metadata").catBuilt) {
                        console.log("building catData", this.collection);
                        this.catData();
                    } else {
                        console.log("catData already exists");
                        this.collection = new Symbols(this.model.get("symbols"));
                        this.buildPalettes();
                        return;
                    }
                } else if (this.dataType == "basic") {
                    this.simpleData();
                }
            },

            contData: function() {
                console.log("cont change registered");
                this.buildPalettes();
                var cssId = "#cont-prop";
                this.setSelectedProp(cssId);
                var $selected = this.$el.find("#cont-prop").val();
                this.setSymbols(this.buildContinuousSymbols(this.getContInfo($selected), $selected));
            },

            catData: function() { 
                console.log("catData triggered"); 
                var cssId = "#cat-prop";
                this.setSelectedProp(cssId);

                this.buildPalettes(this.getCategoricalInfo().list.length);
             
                this.setSymbols(this.buildCategoricalSymbols(this.getCategoricalInfo()));
                this.model.get("metadata").catBuilt = true;
            },

            buildContinuousSymbols: function (cont, $selected) {
                var counter = 0;
                this.layerDraft.continuous = new Symbols();
                while (cont.currentFloor < cont.max) {
                    this.layerDraft.continuous.add({
                        "rule": $selected + " >= " + cont.currentFloor.toFixed(0) + " and " + $selected + " <= " + (cont.currentFloor + cont.segmentSize).toFixed(0),
                        "title": "between " + cont.currentFloor.toFixed(0) + " and " + (cont.currentFloor + cont.segmentSize).toFixed(0),
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
                    console.log(this.layerDraft.continuous);
                    counter++;
                    cont.currentFloor += cont.segmentSize;
                }
                return this.layerDraft.continuous;
            },

            buildCategoricalSymbols: function (cat) {
                var that = this,
                counter = 0;
                this.layerDraft.categorical = new Symbols();
                cat.list.forEach(function(item){
                    that.layerDraft.categorical.add({
                        "rule": that.selectedProp + " = " + item,
                        "title": item,
                        "fillOpacity": 1,
                        "strokeWeight": parseFloat(that.$el.find("#stroke-weight").val()),
                        "strokeOpacity": parseFloat(that.$el.find("#stroke-opacity").val()),
                        "width": parseFloat(that.$el.find("#marker-width").val()) || 20,
                        "shape": that.$el.find(".global-marker-shape").val(),
                        "fillColor": "#" + that.selectedColorPalette[counter],
                        "strokeColor": that.model.get("metadata").strokeColor,
                        "id": (counter + 1), 
                        "instanceCount": cat.instanceCount[item]
                    });
                    counter++;
                });
                return that.layerDraft.categorical;
            },

            /* returns an object containing information
             * for defining a layer's continuous 'buckets'
            */
            getContInfo: function ($selected) {
                var that = this;
                var buckets = this.model.get("metadata").buckets;
                this.continuousData = [];
                var key = this.model.get('data_source'); 
                var dataEntry = this.app.dataManager.getData(key);

                dataEntry.collection.models.forEach(function(d) {
                    that.continuousData.push(d.get($selected));
                });
                var cont = {};
                cont.min = Math.min(...this.continuousData);
                cont.max = Math.max(...this.continuousData);
                cont.range = cont.max - cont.min;
                cont.segmentSize = cont.range / buckets;
                cont.currentFloor = cont.min;
                return cont;
            },

            /* returns a list of the unique categories/entries
             * for a layer's selected property/field. Also returns
             * how many instances there are of each unique
             * category/entry
            */
            getCategoricalInfo: function () {
                var key = this.model.get('data_source'),
                cat = {
                   list: [], 
                   instanceCount: {},
                },
                $selected = this.$el.find("#cat-prop").val(),
                categoricalData = this.app.dataManager.getData(key);
                categoricalData.collection.models.forEach(function(d) {
                    if (!cat.list.includes(d.get($selected)) && d.get($selected)) {
                        cat.list.push(d.get($selected));
                        cat.instanceCount[d.get($selected)] = 1;
                    } else {
                        cat.instanceCount[d.get($selected)]++;
                    }                  
                });
                return cat; 
            },



            simpleData: function () {
                console.log("simpleData triggered", this.model); 
                var that = this,
                key = this.model.get('data_source'),
                name = this.app.dataManager.getData(key).name;
                this.categoricalData = this.app.dataManager.getData(key);
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
                this.collection = this.layerDraft.simple;
                this.model.set("symbols", this.layerDraft.simple.toJSON());
                this.updateMapAndRender();
            },

            // gets and sets user-selected property from the dom
            //this.selectedProp is global so it can be used in template helper
            setSelectedProp: function (cssId) {
               this.selectedProp = this.$el.find(cssId).val(); 
            },

            setSymbols: function (symbs) {
                this.collection = symbs;
                this.model.set("symbols", symbs.toJSON());
                this.updateMapAndRender();
            },

            updateMapAndRender: function () {
                console.log(this.model.get("layer_type"));
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
                        that.contData();
                       // that.render();
                        that.$el.find("#bucket").focus();
                    },
                    500 //experiment with how many milliseconds to delay
                );
            },

            buildPalettes: function (count) {
                var count = count;
                if (count > 8) { count = 8; }
                var seq1, seq2, seq3, seq4, seq5, seq6, seq7, seq8;
                var catPalettes = ['cb-Accent', 'cb-Dark2', 'cb-Paired', 'cb-Pastel1', 'cb-Set1', 'cb-Set2', 'cb-Set3'];
                var contPalettes = ['cb-Blues', 'cb-Oranges', 'cb-Greys', 'cb-YlGn', 'cb-RdYlBu', 'tol-dv', 'cb-Purples'];
                var paletteId = this.model.get("metadata").paletteId || 0;

                if (this.dataType == "categorical") {
                    var buckets = count;
                    var paletteList = catPalettes;
                } else if (this.dataType == "continuous") {
                    var buckets = this.model.get("metadata").buckets;
                    var paletteList = contPalettes;
                } else if (this.dataType == "basic") {
                    var buckets = count;
                    var paletteList = catPalettes;
                }

                seq1 = palette(paletteList[0], buckets);
                seq2 = palette(paletteList[1], buckets);
                seq3 = palette(paletteList[2], buckets);
                seq4 = palette(paletteList[3], buckets);
                seq5 = palette(paletteList[4], buckets);
                seq6 = palette(paletteList[5], buckets);
                seq7 = palette(paletteList[6], buckets);
                this.allColors = [seq1, seq2, seq3, seq4, seq5, seq6, seq7, seq8];
                this.selectedColorPalette = this.allColors[paletteId];
                return this.selectedColorPalette;
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
                this.updateMetadata("strokeColor", hex);
                $('#stroke-color-picker').css('color', hex);
                this.updateMap();
            },

            selectPalette: function (e) {
                this.$el.find(".palette-wrapper").toggle();
                var paletteId = $(e.target).val();
                this.updateMetadata("paletteId", paletteId);
                this.selectedColorPalette = this.allColors[paletteId];
                if (this.dataType == "categorical") {
                    this.catData();
                } else if (this.dataType == "continuous") {
                    this.contData();
                }
            }, 

            showPalettes: function () {
                this.$el.find(".palette-wrapper").css({display: 'block'});
                this.$el.find(".palette-wrapper").addClass("okok");
            },

            //convenience function
            updateMetadata: function(newKey, newValue) {
                console.log(this.collection);
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
            }

        });
        return MarkerStyleView;
    });
