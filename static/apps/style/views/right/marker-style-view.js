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
                console.log('MARKER STYLE VIEW INITIALIZE');
                console.log(this.model);
                this.dataType = this.model.get('layer_type');
                this.data_source = this.model.get('data_source'); //e.g. "form_1"
                this.collection = new Symbols(this.model.get("symbols"));
                console.log("data_source: " + this.data_source);
                console.log("dataType: " + this.dataType);
                console.log("collection: ");
                console.log(this.collection);

                this.selectedProp = this.model.get('metadata').currentProp;
                console.log(this.selectedProp);

                // important to render before createCorrectSymbol because createCorrectSymbol
                // depends on info in the DOM (e.g. what property is selected)
                this.render();
                this.createCorrectSymbols();

                $('body').click(this.hideColorRamp);

                this.listenTo(this.app.vent, 'find-datatype', this.selectDataType);
            //    this.listenTo(this.app.vent, 'update-data-source', this.initialize);
                this.listenTo(this.app.vent, 'update-map', this.updateMap);
            },
            modelEvents: {
         //       'change:data_source': 'initialize'
            },
            


            onRender: function () {
                var that = this,
                    color = this.model.get('fillColor');
                $(".marker-style-color-picker").remove();
                this.$el.find('#stroke-color-picker').ColorPicker({

                    onShow: function (colpkr) {
                        //console.log("colorPicker show");
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        //console.log("colorPicker hide");
                        that.updateStrokeColor(color);
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onChange: function (hsb, hex, rgb) {
                        //console.log("colorPicker changed");
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
                propertiesList = this.buildPropertiesList(),
                    helpers;
                helpers = {
                    metadata: metadata,
                    dataType: this.dataType,
                    allColors: this.allColors,
                    selectedColorPalette: this.selectedColorPalette,
                    categoricalList: propertiesList[0],
                    continuousList: propertiesList[1],
                    icons: IconLookup.getIcons(),
                    selectedProp: this.selectedProp,
                    hasContinuousFields: (propertiesList[1].length > 0),
                    hasCategoricalFields: (propertiesList[0].length > 0)
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
                console.log(this.dataType);
                this.model.set("layer_type", this.dataType);
                //this.selectedProp = this.model.get('metadata').currentProp;
                console.log(this.selectedProp);
           //     this.render();
                
                if (this.dataType == 'continuous') {
                    this.selectedProp = this.continuousList[0].value;
                    this.model.get('metadata').currentProp = this.continuousList[0].value;
                    console.log('its continuous; SELECTED PROP: ',  this.selectedProp);
                }

                if (this.dataType == 'categorical') {
                    this.selectedProp = this.categoricalList[0].value;
                    this.model.get('metadata').currentProp = this.categoricalList[0].value;
                    console.log('its categorical; SELECTED PROP: ', this.selectedProp);
                }

                this.createCorrectSymbols();
            },

            displaySymbols: function () {
                this.collection = new Symbols(this.model.get("symbols"));
                this.render();
            },

            // builds list of properties/fields to populate property dropdown list
            buildPropertiesList: function () {
                //clearing out the lists
                this.categoricalList = [];
                this.continuousList = [];

                // generic property lists for photos, audio, and markers
                // property lists for custom forms are generated by 'buildCustomPropertiesList()'
                var photoAudioList = ["id", "name", "caption", "tags", "owner", "attribution"],
                markerList = ["name", "caption", "tags", "owner"];

                var key = this.model.get('data_source'),
                    collection = this.app.dataManager.getCollection(key);

                //still need to account for map-images below...
                if (key == "photos" || key == "audio") {
                    this.buildGenericPropertiesList(photoAudioList, collection);
                } else if (key == "markers") {
                    this.buildGenericPropertiesList(markerList, collection);
                } else if (key.includes("form_")) {
                    this.buildCustomPropertiesList(collection);
                }
                return [this.categoricalList, this.continuousList];
            },

            // builds 'this.categoricalList' for generic data types
            // note: all generic properties/fields are categorical, not continuous
            buildGenericPropertiesList: function(list, collection) {
                for (var i=0;i<list.length;i++) {
                    this.categoricalList.push({
                        text: list[i],
                        value:list[i],
                        hasData: this.fieldHasData(collection, list[i])
                    });
                }
            },

            // builds 'this.categoricalList' or 'this.continuousList' for custom data types
            buildCustomPropertiesList: function (collection) {
                var that = this;
                collection.getFields().models.forEach(function(log) {
                    var field = log.get("col_name");

                    if (log.get("data_type") === "text" || log.get("data_type") === "choice") {
                        that.categoricalList.push({
                            text: log.get("col_alias"),
                            value: log.get("col_name"),
                            hasData: that.fieldHasData(collection, field)
                        });
                    } else if (log.get("data_type") === "integer" || log.get("data_type") === "rating"){
                        that.continuousList.push({
                            text: log.get("col_alias"),
                            value: log.get("col_name"),
                            hasData: that.fieldHasData(collection, field)
                        });
                    }
                });
            },

            // this function determines if a particular property/field
            // actually contains any data. If it does not, then the function returns 'false'
            // and that property will be grayed-out in the properties dropdown list (disabled)
            fieldHasData: function (collection, field) {
                var hasData = [];
                
                collection.models.forEach(function(d) {
                    if (d.get(field)){
                        hasData.push(true);
                    } else {
                        hasData.push(false);
                    }
                });

                //
                if (hasData.includes(true)) {
                    return true;
                } else {
                    return false;
                }
            },

            createCorrectSymbols: function () {
                console.log(this.dataType);
                if (this.dataType == "continuous") {
                    console.log('calling contData()');
                    this.contData();
                } else if (this.dataType == "categorical") {
                    this.catData();

                    /*
                    // below was an attempt to not regenerate categorical symbols every time
                    // but it didn't work if the existing symbols it retrieved were categorical
                    if (!this.model.get("metadata").catBuilt) {
                        console.log("building catData", this.collection);
                        this.catData();
                    } else {
                        console.log("catData already exists", this.model.get("symbols"));
                        this.setSymbols(new Symbols(this.model.get("symbols")));
                        console.log(this.getCatInfo().list, this.getCatInfo().list.length);
                        this.buildPalettes(this.getCatInfo().list.length);
                       // return;
                    }
                    */
                } else if (this.dataType == "basic") {
                    this.simpleData();
                }
            },

            contData: function() {
                this.buildPalettes();
                var cssId = "#cont-prop";
                this.setSelectedProp(cssId);
                console.log(this.buildContinuousSymbols(this.getContInfo()));
                this.setSymbols(this.buildContinuousSymbols(this.getContInfo()));
            },

            catData: function() {
                //console.log("catData triggered");
                var cssId = "#cat-prop";
                console.log('this is the selected property: ' + cssId);
                this.setSelectedProp(cssId);
                var catInfo = this.getCatInfo();
                this.buildPalettes(catInfo.list.length);

                this.setSymbols(this.buildCategoricalSymbols(catInfo));
                this.model.get("metadata").catBuilt = true;
            },

            buildContinuousSymbols: function (cont) {
                var counter = 0,
                selected = this.selectedProp;
                this.layerDraft.continuous = new Symbols();
                while (cont.currentFloor < cont.max) {
                    this.layerDraft.continuous.add({
                        "rule": selected + " >= " + cont.currentFloor.toFixed(0) + " and " + selected + " <= " + (cont.currentFloor + cont.segmentSize).toFixed(0),
                        "title": "between " + cont.currentFloor.toFixed(0) + " and " + (cont.currentFloor + cont.segmentSize).toFixed(0),
                        "fillOpacity": this.defaultIfUndefined(parseFloat(this.$el.find("#palette-opacity").val()), 1),
                        "strokeWeight": this.defaultIfUndefined(parseFloat(this.$el.find("#stroke-weight").val()), 1),
                        "strokeOpacity": this.defaultIfUndefined(parseFloat(this.$el.find("#stroke-opacity").val()), 1),
                        "width": this.defaultIfUndefined(parseFloat(this.$el.find("#marker-width").val()), 20),
                        "shape": this.$el.find(".global-marker-shape").val(),
                        "fillColor": "#" + this.selectedColorPalette[counter],
                        "strokeColor": this.model.get("metadata").strokeColor,
                        "id": (counter + 1)
                    });
                    counter++;
                    cont.currentFloor = Math.round((cont.currentFloor + cont.segmentSize)*100)/100;
                    //console.log(cont.currentFloor);
                }
                return this.layerDraft.continuous;
            },
/*
            manageDefault: function (input) {
                console.log(input);
                var output;
                if (input == undefined || NaN) {
                    output = 1;
                } else {
                    output = parseFloat(input);
                }
                console.log(output);
                return output;
            },
*/
            buildCategoricalSymbols: function (cat) {
                //console.log(cat);
                var that = this,
                idCounter = 1,
                paletteCounter = 0;
                this.layerDraft.categorical = new Symbols();
                console.log(that.$el.find("#stroke-opacity").val());
                cat.list.forEach(function(item){
                    that.layerDraft.categorical.add({
                        "rule": that.selectedProp + " = " + item,
                        "title": item,
                        "fillOpacity": that.defaultIfUndefined(parseFloat(that.$el.find("#palette-opacity").val()), 1),
                        "strokeWeight": that.defaultIfUndefined(parseFloat(that.$el.find("#stroke-weight").val()), 1),
                        "strokeOpacity": that.defaultIfUndefined(parseFloat(that.$el.find("#stroke-opacity").val()), 1),
                        "width": that.defaultIfUndefined(parseFloat(that.$el.find("#marker-width").val()), 20),
                        "shape": that.$el.find(".global-marker-shape").val(),
                        "fillColor": "#" + that.selectedColorPalette[paletteCounter > 7 ? paletteCounter = 0 : paletteCounter],
                        "strokeColor": that.model.get("metadata").strokeColor,
                        "id": idCounter,
                        "instanceCount": cat.instanceCount[item]
                    });

                    idCounter++;
                    paletteCounter++;
                });
                return that.layerDraft.categorical;
            },

            /* returns an object containing information
             * for defining a layer's continuous 'buckets'
            */
            getContInfo: function () {
                var selected = this.selectedProp,
                    buckets = this.model.get("metadata").buckets,
                    key = this.model.get('data_source'),
                    collection = this.app.dataManager.getCollection(key);
                console.log(selected, buckets, key, collection);
                this.continuousData = [];
                collection.models.forEach((d) => {
                    console.log(d.get(selected));
                    this.continuousData.push(d.get(selected));
                });
                var cont = {};
                cont.min = Math.min(...this.continuousData);
                cont.max = Math.max(...this.continuousData);
                cont.range = cont.max - cont.min;
                cont.segmentSize = cont.range / buckets;
                cont.currentFloor = cont.min;
                console.log(cont);
                return cont;
            },

            /* returns a list of the unique categories/entries
             * for a layer's selected property/field. Also returns
             * how many instances there are of each unique
             * category/entry
            */
            getCatInfo: function () {
                var key = this.model.get('data_source'),
                cat = {
                   list: [],
                   instanceCount: {},
                },
                selected = this.selectedProp,
               // selected = this.$el.find('#cat-prop').val(),
                collection = this.app.dataManager.getCollection(key);
                console.log("selected " + selected);
                //console.log("get catInfo: $selected", selected, this.model.get('metadata'), this.selectedProp);
                collection.models.forEach(function(d) {
                    if (!cat.list.includes(d.get(selected)) && d.get(selected)) {
                        cat.list.push(d.get(selected));
                        cat.instanceCount[d.get(selected)] = 1;
                    } else {
                        cat.instanceCount[d.get(selected)]++;
                    }
                });
                console.log(key, cat, selected, collection);
                return cat;
            },



            simpleData: function () {
                //console.log("simpleData triggered", this.model);
                this.setSymbols(this.buildSimpleSymbols(this.model.get('data_source')));
            },

            buildSimpleSymbols: function (key) {
                name = this.app.dataManager.getCollection(key).getTitle();

               // if (this.model.getSymbols().length > 0) {
               //     this.layerDraft.simple = this.model.getSymbols();
               // } else {
                    this.layerDraft.simple = new Symbols([{
                        "rule": "*",
                        "title": name,
                        "shape": this.$el.find(".global-marker-shape").val(),
                        "fillOpacity": this.defaultIfUndefined(parseFloat(this.$el.find("#palette-opacity").val()), 1),
                        "fillColor": "#60c7cc",
                        "strokeWeight": this.defaultIfUndefined(parseFloat(this.$el.find("#stroke-weight").val()), 1),
                        "strokeOpacity": this.defaultIfUndefined(parseFloat(this.$el.find("#stroke-opacity").val()), 1),
                        "strokeColor": this.model.get("metadata").strokeColor,
                        'width': this.defaultIfUndefined(parseFloat(this.$el.find("#marker-width").val()), 20),
                        "id": 1
                    }]);
              //  }
                return this.layerDraft.simple;
            },

            // gets and sets user-selected property from the dom
            //this.selectedProp is global so it can be used in template helper
            setSelectedProp: function (cssId) {
            //    if (this.$el.find(cssId).val()) {
            //        this.model.get('metadata').currentProp = this.$el.find(cssId).val();
            //    }
                console.log(this.selectedProp, this.model.get('metadata').currentProp);
                this.selectedProp = this.model.get('metadata').currentProp;
                console.log('changing selected proprty', this.selectedProp);
            },

            setSymbols: function (symbs) {
                this.collection = symbs;
                this.model.set("symbols", symbs.toJSON());
                this.updateMapAndRender();
            },

            updateMapAndRender: function () {
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
                var that = this;
                this.delayExecution(
                    "bucketTimer",
                    function () {
                        var buckets = parseFloat(that.$el.find("#bucket").val());
                        that.updateMetadata("buckets", buckets);
                        that.buildPalettes();
                        that.contData();
                       // that.render();
                        that.$el.find("#bucket").focus();
                    },
                    500 //experiment with how many milliseconds to delay
                );
            },

            buildPalettes: function (itemCount) {
                //console.log("building palette, count = ", count);
                var count = itemCount;
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
                //console.log('updateMap');
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
                var that = this;
                //console.log("a.", this.collection.length, this.model.getSymbols().length);
                var localMeta = this.model.get("metadata") || {},
                    that = this;
                localMeta[newKey] = newValue;
                this.model.set("metadata", localMeta);

                //console.log("b.", this.collection.length, this.model.getSymbols().length);
                this.collection.each(function(symbol) {
                    //console.log(symbol.id, that.model.getSymbols().length);
                    symbol.set(newKey, newValue);
                    //console.log(symbol.id, that.model.getSymbols().length);
                });
                this.app.layerHasBeenAltered = true;
                this.app.layerHasBeenSaved = false;

                //console.log("c.", this.collection.length, this.model.getSymbols().length);
            },
            
            // returns a default value if the input value from the dom is undefined
            // needed because simply using '||' for defaults is buggy
            defaultIfUndefined: function (domValue, defaultValue) {
                if (domValue === undefined) {
                    return defaultValue;
                } else {
                    return domValue;
                }
            },

        });
        return MarkerStyleView;
    });
