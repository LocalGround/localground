define(["jquery",
        "backbone",
        "marionette",
        "handlebars",
        "lib/maps/icon-lookup",
        "apps/main/views/right/marker-style-view-child",
        "apps/main/views/symbols/symbol-selection-layout-view",
        "text!../../templates/right/marker-style1.html",
        "collections/symbols",
        'color-picker-eyecon',
        "palette"
    ],
    function ($, Backbone, Marionette, Handlebars, IconLookup, MarkerStyleChildView, SymbolSelectionLayoutView, MarkerStyleTemplate, Symbols) {
        'use strict';

        /**
         * In this view, this.model = Layer, and this.collection = Symbols
         * This view's main function is to build the Symbols base on the user's input
         * (e.g. simple, categorical, or continuous. Plus any Layer-level
         * symbol styles (marker size, stroke, etc.))
         */
        var MarkerStyleView = Marionette.CompositeView.extend({
            allColors: [],
            selectedColorPalette: null,
            layerDraft: {
                continuous: null,
                categorical: null,
                simple: null,
                individual: null
            },
            template: Handlebars.compile(MarkerStyleTemplate),

            //each of these childViews is a symbol. this view renders the value-rules box
            childView: MarkerStyleChildView,
            childViewContainer: "#symbols",

            childViewOptions: function () {
                return {
                    app: this.app,
                    layer: this.model,
                    groupBy: this.model.get('group_by')
                };
            },

            initialize: function (opts) {
                _.extend(this, opts);

                console.log(this.model);

                // this is the new properties list; all properties in a single list
                this.dataColumnsList = this.buildDataColumnsList();


                // (03/2018: If we add the ability to change a layer's dataset,
                // we need to reset the layer type to 'basic' in the case where because 
                // we won't know what the fields/dataColumns are 


                this.data_source = this.model.get('data_source'); //e.g. "form_1"
                //this.collection = new Symbols(this.model.get("symbols"));
                this.collection = this.model.get('symbols');

                if (!this.model.get('metadata').isContinuous) {
                    this.model.get('metadata').isContinuous = false;
                }

                // don't recreate symbols if they already exist
                // this is so existing unique individual attributes aren't overwritten by global ones
                if (this.model.get('newLayer') === true) {
                    this.createCorrectSymbols();
                } else if (this.model.get('group_by') === 'basic') {
                    this.createCorrectSymbols();
                } else if (this.model.get('group_by') === 'individual') {
                    this.createCorrectSymbols();
                } else {
                    this.buildPalettes(this.model.get('symbols').length);
                    this.updateMapAndRender();
                }

                $('body').click($.proxy(this.hideColorRamp, this));

                this.listenTo(this.app.vent, 'update-map', this.updateMap);
            },

            onRender: function () {
                var that = this,
                    color = this.model.get('fillColor');
                $(".marker-style-color-picker").remove();
                this.$el.find('#stroke-color-picker').ColorPicker({

                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        that.updateStrokeColor(color);
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onChange: function (hsb, hex, rgb) {
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
                !$el.hasClass('palette-item') ) {
                    $(".palette-wrapper").hide();
                }

                if (!$el.hasClass('symbol-menu-tabs') &&
                !$el.hasClass('symbols-layout-container')  &&
                !$el.hasClass('native-symbols-region') &&
                !$el.hasClass('custom-symbols-region') &&
                !$el.hasClass('global-symbol-dropdown') &&
                !$el.hasClass('selected-symbol-div') &&
                !$el.hasClass('fa-circle') &&
                !$el.hasClass('fa-angle-down') ) {
                    $(".symbols-layout-container").hide();
                }
            },

            templateHelpers: function () {
                var metadata = this.model.get("metadata"),
                    helpers;
                helpers = {
                    metadata: metadata,
                    groupBy: this.model.get('group_by'),
                    allColors: this.allColors,
                    selectedColorPalette: this.selectedColorPalette,
                    dataColumnsList: this.dataColumnsList, // new
                    isBasic: this.model.get('group_by') === 'basic',
                    isIndividual: this.model.get('group_by') === 'individual',
                    propCanBeCont: this.propCanBeCont()
                };
                if (this.fields) {
                    helpers.properties = this.fields.toJSON();
                }
                return helpers;
            },

            events: {
                'change #data-type-select': 'selectGroupBy',
                'change #bucket': 'updateBuckets',
                'change #palette-opacity': 'updatePaletteOpacity',
                'change .global-marker-shape': 'updateGlobalShape',
                'change #marker-width': 'updateWidth',
                'change #stroke-weight': 'updateStrokeWeight',
                'change #stroke-color': 'updateStrokeColor',
                'change #stroke-opacity': 'updateStrokeOpacity',
                'click .selected-palette-wrapper': 'showPalettes',
                'click .palette-list': 'selectPalette',
                'click .palette-list *': 'selectPalette',
                'click #global-symbol': 'showSymbols',
                'click .style-by-menu_close': 'hideStyleMenu',
                "click #cat-radio": "toggleContCat",
                "click #cont-radio": "toggleContCat"
            },

            modelEvents: {
                'change:symbols': 'saveChanges'
            },

            toggleContCat: function (e) {
                let $buckets = this.$el.find('#bucket');
                if (e.target.id === 'cat-radio') {
                    $buckets.attr("disabled", "disabled");
                    this.model.get('metadata').isContinuous = false;
                } else {
                    $buckets.removeAttr("disabled");
                    this.model.get('metadata').isContinuous = true;
                }
                this.createCorrectSymbols();
            },

            propCanBeCont: function() {
                if (this.model.get('group_by') === 'basic') {
                    return false;
                }
                if (this.model.get('group_by') === 'individual') {
                    return false;
                }
                let currentProp = this.dataColumnsList.find((item) => {
                    return (item.value === this.model.get('metadata').currentProp)
                });
                if (currentProp.type === 'integer' || currentProp.type === 'rating') {
                    return true;
                } else {
                    return false;
                }

            },

            // don't think this is being used anymore
            saveChanges: function() {
                var that = this;
                setTimeout(function() {
                    that.model.save();
                }, 2000);
            },

            showSymbols: function (e) {
                this.symbolsView = new SymbolSelectionLayoutView({
                    app: this,
                    el: $('#global-symbol-dropdown')
                });
              //  this.$el.append(this.symbolsView.$el);
              //  this.symbolsView.$el.show();
            },

            displaySymbols: function () {
                //this.collection = new Symbols(this.model.get("symbols"));
                this.collection = this.model.get('symbols');
                this.render();
            },

            selectGroupBy: function (e) {
  
                this.model.set('group_by', $(e.target).val() || this.$el.find("#data-type-select").val());
                this.model.get('metadata').isContinuous = false;

                this.createCorrectSymbols();
            },

            // New method (03/2018) - builds list of ALL data columns, not split into categorical or continuous
            buildDataColumnsList: function() {
                const key = this.model.get('data_source'),
                    collection = this.app.dataManager.getCollection(key);
                let dataColumns = [];

                collection.getFields().models.forEach((record) => {
                    var field = record.get("col_name");

                    dataColumns.push({
                        text: record.get("col_alias"),
                        value: record.get("col_name"),
                        hasData: this.fieldHasData(collection, field),
                        type: record.get("data_type") 
                    });
                });
                return dataColumns;
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

                return hasData.includes(true) ? true : false;
            },

            createCorrectSymbols: function () {
                const gb = this.model.get('group_by');
                if (gb === 'basic') {
                    this.simpleData();
                } else if (gb === 'individual') {
                    console.log('individual');
                    this.individualData();
                } else {
                    this.model.get('metadata').currentProp = this.model.get('group_by');
                    if (this.model.get('metadata').isContinuous) {
                        this.contData();
                    } else {
                        this.catData();
                    }
                }
                
            },

            simpleData: function () {
                this.setSymbols(this.buildSimpleSymbols(this.model.get('data_source')));
            },

            individualData: function() {
                this.setSymbols(this.buildIndividualSymbols(this.model.get('data_source')));
            },

            contData: function() {
                this.buildPalettes();
                this.setSymbols(this.buildContinuousSymbols(this.getContInfo()));
            },

            catData: function() {
                var catInfo = this.getCatInfo();
                this.buildPalettes(catInfo.list.length);

                this.setSymbols(this.buildCategoricalSymbols(catInfo));
            },

            buildSimpleSymbols: function (key) {
                name = this.app.dataManager.getCollection(key).getTitle();

                this.layerDraft.simple = new Symbols([{
                    "rule": "*",
                    "title": name,
                    "shape": this.$el.find(".global-marker-shape").val(),
                    "fillOpacity": this.defaultIfUndefined(parseFloat(this.model.get('metadata').fillOpacity), 1),
                  //  "fillColor": "#60c7cc",
                    "strokeWeight": this.defaultIfUndefined(parseFloat(this.model.get('metadata').strokeWeight), 1),
                    "strokeOpacity": this.defaultIfUndefined(parseFloat(this.model.get('metadata').strokeOpacity), 1),
                    "strokeColor": this.model.get("metadata").strokeColor,
                    'width': this.defaultIfUndefined(parseFloat(this.model.get('metadata').width), 20),
                    "isShowing": this.model.get("metadata").isShowing,
                    "id": 1
                }]);
                this.layerNoLongerNew();
                return this.layerDraft.simple;
            },

            buildIndividualSymbols: function(key) {
                this.layerDraft.individual = new Symbols();
                let collection = this.app.dataManager.getCollection(key);
                collection.forEach((item) => {
                    const random_color = "#000000".replace(/0/g, function(){
                        return (~~(Math.random()*16)).toString(16);
                    });
                    this.layerDraft.individual.add({
                        "rule": "id = " + item.id,
                        "title": item,
                        "fillOpacity": this.defaultIfUndefined(parseFloat(this.model.get('metadata').fillOpacity), 1),
                        "strokeWeight": this.defaultIfUndefined(parseFloat(this.model.get('metadata').strokeWeight), 1),
                        "strokeOpacity": this.defaultIfUndefined(parseFloat(this.model.get('metadata').strokeOpacity), 1),
                        "width": this.defaultIfUndefined(parseFloat(this.model.get('metadata').width), 20),
                        "shape": this.$el.find(".global-marker-shape").val(),
                        "fillColor": random_color,
                        "strokeColor": this.model.get("metadata").strokeColor,
                        "isShowing": this.model.get("metadata").isShowing,
                        "id": item.id,
                    });
                });
                this.layerNoLongerNew();
                console.log(this.layerDraft.individual);
                return this.layerDraft.individual;

            },

            buildContinuousSymbols: function (cont) {
                var counter = 0,
                selected = this.model.get('metadata').currentProp;
                if (!this.layerDraft.continuous === null) {
                    this.model.set('symbols', this.layerDraft.continuous);
                }
                this.layerDraft.continuous = new Symbols();
                while (cont.currentFloor < cont.max) {
                    this.layerDraft.continuous.add({
                        "rule": selected + " >= " + cont.currentFloor.toFixed(0) + " and " + selected + " < " + (cont.currentFloor + cont.segmentSize).toFixed(0),
                        "title": "between " + cont.currentFloor.toFixed(0) + " and " + (cont.currentFloor + cont.segmentSize).toFixed(0),
                        "fillOpacity": this.defaultIfUndefined(parseFloat(this.model.get('metadata').fillOpacity), 1),
                        "strokeWeight": this.defaultIfUndefined(parseFloat(this.model.get('metadata').strokeWeight), 1),
                        "strokeOpacity": this.defaultIfUndefined(parseFloat(this.model.get('metadata').strokeOpacity), 1),
                        "width": this.defaultIfUndefined(parseFloat(this.model.get('metadata').width), 20),
                        "shape": this.$el.find(".global-marker-shape").val(),
                        "fillColor": "#" + this.selectedColorPalette[counter],
                        "strokeColor": this.model.get("metadata").strokeColor,
                        "isShowing": this.model.get("metadata").isShowing,
                        "id": (counter + 1)
                    });
                    counter++;
                    cont.currentFloor = Math.round((cont.currentFloor + cont.segmentSize)*100)/100;
                }
                console.log(cont.currentFloor);
                console.log(this.layerDraft.continuous);
                this.layerNoLongerNew();
                return this.layerDraft.continuous;
            },

            buildCategoricalSymbols: function (cat) {
                var idCounter = 1,
                paletteCounter = 0;
                this.layerDraft.categorical = new Symbols();
                cat.list.forEach((item) => {
                    this.layerDraft.categorical.add({
                        "rule": this.model.get('metadata').currentProp + " = " + item,
                        "title": item,
                        "fillOpacity": this.defaultIfUndefined(parseFloat(this.model.get('metadata').fillOpacity), 1),
                        "strokeWeight": this.defaultIfUndefined(parseFloat(this.model.get('metadata').strokeWeight), 1),
                        "strokeOpacity": this.defaultIfUndefined(parseFloat(this.model.get('metadata').strokeOpacity), 1),
                        "width": this.defaultIfUndefined(parseFloat(this.model.get('metadata').width), 20),
                        "shape": this.$el.find(".global-marker-shape").val(),
                        "fillColor": "#" + this.selectedColorPalette[paletteCounter % 8],
                        "strokeColor": this.model.get("metadata").strokeColor,
                        "isShowing": this.model.get("metadata").isShowing,
                        "id": idCounter,
                        "instanceCount": cat.instanceCount[item]
                    });

                    idCounter++;
                    paletteCounter++;
                });
                this.layerNoLongerNew();
                return this.layerDraft.categorical;
            },

            // returns an object containing information
            // for defining a layer's continuous 'buckets'
            getContInfo: function () {
                var selected = this.model.get('metadata').currentProp,
                    buckets = this.model.get("metadata").buckets,
                    key = this.model.get('data_source'),
                    collection = this.app.dataManager.getCollection(key);
                    console.log(collection);
                this.continuousData = [];
                collection.models.forEach((d) => {
                    
                    // must use this check to distinguish between 0 and null/undefined
                    // e.g. simply doing "if (d.get(selected)) {...}" will miss 0s
                    if (typeof d.get(selected) === 'number') {

                        console.log(d.get(selected));
                        this.continuousData.push(d.get(selected));
                    }
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
                selected = this.model.get('metadata').currentProp,
                collection = this.app.dataManager.getCollection(key);
                collection.models.forEach(function(d) {
                    if (!cat.list.includes(d.get(selected)) && d.get(selected)) {
                        cat.list.push(d.get(selected));
                        cat.instanceCount[d.get(selected)] = 1;
                    } else {
                        cat.instanceCount[d.get(selected)]++;
                    }
                });
                return cat;
            },

            setSymbols: function (symbs) {
                this.collection.reset(symbs.toJSON())
                this.render();
            },

            updateMapAndRender: function () {
                //this.updateMap();
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
                this.delayExecution(
                    "bucketTimer",
                    () => {
                        var buckets = parseFloat(this.$el.find("#bucket").val());
                        this.updateMetadata("buckets", buckets);
                        this.buildPalettes();
                        this.contData();
                       // that.render();
                       this.$el.find("#bucket").focus();
                    },
                    500 //experiment with how many milliseconds to delay
                );
            },

            buildPalettes: function (itemCount) {
                let count = itemCount;
                if (count > 8) { count = 8; }
                
                let seq1, seq2, seq3, seq4, seq5, seq6, seq7, seq8;
                const catPalettes = ['cb-Accent', 'cb-Dark2', 'cb-Paired', 'cb-Pastel1', 'cb-Set1', 'cb-Set2', 'cb-Set3'];
                const contPalettes = ['cb-Blues', 'cb-Oranges', 'cb-Greys', 'cb-YlGn', 'cb-RdYlBu', 'tol-dv', 'cb-Purples'];
                const paletteId = this.model.get("metadata").paletteId || 0;

                let paletteList, buckets;
                const gb = this.model.get('group_by');
                if (gb === 'basic') {
                    buckets = count;
                    paletteList = catPalettes;
                } else if (gb === 'individual') {
                    console.log('individual');
                } else {
                    if (this.model.get('metadata').isContinuous) {
                        paletteList = contPalettes;
                        buckets = this.model.get("metadata").buckets;
                    } else {
                        paletteList = catPalettes;
                        buckets = count;
                    }
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

            /*updateMap: function () {
                console.log('msv updateMap');
                var that = this;
                this.delayExecution("mapTimer", function () {
                    that.model.trigger('rebuild-markers', that.model)
                }, 250);
            },*/

            updatePaletteOpacity: function() {
                let opacity = parseFloat(this.$el.find("#palette-opacity").val());
                if (opacity > 1) {
                    opacity = 1;
                } else if (opacity < 0 ) {
                    opacity = 0;
                }
                this.updateMetadata("fillOpacity", opacity);
            },

            updateGlobalShape: function(e) {
                const shape = $(e.target).val();
                this.updateMetadata("shape", shape);
            },

            updateWidth: function(e) {
                const width = parseFloat($(e.target).val());
                this.updateMetadata("width", width);
            },

            updateStrokeWeight: function(e) {
                const strokeWeight = parseFloat($(e.target).val());
                this.updateMetadata("strokeWeight", strokeWeight);
            },

            // triggered from colorPicker
            updateStrokeColor: function (hex) {
                this.updateMetadata("strokeColor", hex);
                $('#stroke-color-picker').css('background-color', hex);
            },

            updateStrokeOpacity: function(e) {
                let opacity = parseFloat($(e.target).val());
                    if (opacity > 1) {
                        opacity = 1;
                    } else if (opacity < 0 ) {
                        opacity = 0;
                    }
                this.updateMetadata("strokeOpacity", opacity);
            },

            selectPalette: function (e) {
                this.$el.find(".palette-wrapper").toggle();
                const paletteId = $(e.target).val();
                this.updateMetadata("paletteId", paletteId);
                this.selectedColorPalette = this.allColors[paletteId];
                this.updatePalette();
            },

            updatePalette: function() {
                let i = 0,
                that = this;
                this.collection.each(function(symbol) {
                    symbol.set('fillColor', "#" + that.selectedColorPalette[i]);
                    i++;
                });

                this.updateMapAndRender();
            },


            showPalettes: function () {
                this.$el.find(".palette-wrapper").css({display: 'block'});
            },

            layerNoLongerNew: function() {
                this.model.set('newLayer', false);
            },

            //convenience function
            updateMetadata: function(newKey, newValue) {
                let localMeta = this.model.get("metadata") || {};
                localMeta[newKey] = newValue;
                this.model.set("metadata", localMeta);

                this.collection.each(function(symbol) {
                    symbol.set(newKey, newValue);
                });
                this.app.layerHasBeenAltered = true;
                this.app.layerHasBeenSaved = false;
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

            hideStyleMenu: function(e) {
                this.app.vent.trigger('hide-style-menu', e);
            }

        });
        return MarkerStyleView;
    });
