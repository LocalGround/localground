define(["jquery",
        "backbone",
        "marionette",
        "handlebars",
        "lib/maps/icon-lookup",
        "apps/main/views/right/marker-style-view-child",
        "apps/main/views/symbols/symbol-selection-layout-view",
        "text!../../templates/right/marker-style1.html",
        "collections/symbols",
        "lib/lgPalettes",
        'color-picker-eyecon',
        "palette", 
    ],
    function ($, Backbone, Marionette, Handlebars, IconLookup, MarkerStyleChildView, SymbolSelectionLayoutView, MarkerStyleTemplate, Symbols, LGPalettes) {
        'use strict';

        /**
         * In this view, this.model = Layer, and this.collection = Symbols
         * This view's main function is to build the Symbols base on the user's input
         * (e.g. uniform, categorical, or continuous. Plus any Layer-level
         * symbol styles (marker size, stroke, etc.))
         */
        var MarkerStyleView = Marionette.CompositeView.extend({
            allColors: [],
            selectedColorPalette: null,
            layerDraft: {
                continuous: null,
                categorical: null,
                uniform: null,
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

                this.lgPalettes = new LGPalettes();

                // this is the new properties list; all properties in a single list
                this.dataColumnsList = this.buildDataColumnsList();


                // (03/2018: If we add the ability to change a layer's dataset,
                // we need to reset the layer type to 'uniform' in the case where because
                // we won't know what the fields/dataColumns are


                this.dataset = this.model.get('dataset'); //e.g. "form_1"
                //this.collection = new Symbols(this.model.get("symbols"));
                this.collection = this.model.get('symbols');

                if (!this.model.get('metadata').isContinuous) {
                    this.model.get('metadata').isContinuous = false;
                }

                // don't recreate symbols if they already exist
                // this is so existing unique individual attributes aren't overwritten by global ones
                if (this.model.get('newLayer') === true) {
                    this.createCorrectSymbols();
                } else if (this.model.get('group_by') === 'uniform') {
                    this.createCorrectSymbols();
                } else if (this.model.get('group_by') === 'individual') {
                    this.createCorrectSymbols();
                } else {
                    this.updatePalettes(this.model.get('symbols').length);
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
                const symbols  = this.model.get('symbols').models;
                let symbolCounter = symbols.length > 7 ? [0,1,2,3,4,5,6,7] : symbols;
                helpers = {
                    metadata: metadata,
                    groupBy: this.model.get('group_by'),
                    allColors: this.allColors,
                    selectedColorPalette: this.selectedColorPalette,
                    dataColumnsList: this.dataColumnsList, // new
                    isBasic: this.model.get('group_by') === 'uniform',
                    isIndividual: this.model.get('group_by') === 'individual',
                    propCanBeCont: this.propCanBeCont(), 
                    paletteCounter: this.colorPaletteAmount()
                };
                if (this.fields) {
                    helpers.properties = this.fields.toJSON();
                }
                return helpers;
            },

            colorPaletteAmount: function() {
                let numberOfSymbols = this.model.get('symbols').models.map((item, i) => {
                    return i
                });
                if (!this.model.get('metadata').isContinuous) {
                    if (numberOfSymbols.length > 9) {
                        numberOfSymbols.length = 9;
                    } 
                } 

                // remove that last symbol, which will always be the uncategorized symbol
                numberOfSymbols.pop();
                return numberOfSymbols;

            },

            events: {
                'change #data-type-select': 'selectGroupBy',
                'change #bucket': 'updateBuckets',
                'change #palette-opacity': 'updatePaletteOpacity',
                'click .style-menu_shape-wrapper': 'updateGlobalShape',
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
                if (this.model.get('group_by') === 'uniform') {
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
                //to resize the popover menu:
                this.app.popover.redraw();
            },

            // New method (03/2018) - builds list of ALL data columns, not split into categorical or continuous
            buildDataColumnsList: function() {
                const key = this.model.get('dataset').overlay_type,
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
                if (gb === 'uniform') {
                    this.uniformData();
                } else if (gb === 'individual') {
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

            uniformData: function () {
                this.setSymbols(this.buildUniformSymbols(this.model.get('dataset').overlay_type));
            },

            individualData: function() {
                this.setSymbols(this.buildIndividualSymbols(this.model.get('dataset').overlay_type));
            },

            contData: function() {
                this.updatePalettes(this.model.get("metadata").buckets);
                this.setSymbols(this.buildContinuousSymbols(this.getContInfo()));
            },

            catData: function() {
                let categoryList = this.getCatInfo();
                this.updatePalettes(categoryList.length);
                this.setSymbols(this.buildCategoricalSymbols(categoryList));
            },

            setPalettes: function(count) {

            },

            buildUniformSymbols: function (key) {
                name = this.app.dataManager.getCollection(key).getTitle();

                this.layerDraft.uniform = new Symbols([{
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
                return this.layerDraft.uniform;
            },

            buildIndividualSymbols: function(key) {
                this.layerDraft.individual = new Symbols();
                let collection = this.app.dataManager.getCollection(key);
                collection.forEach((item) => {
                    this.layerDraft.individual.add({
                        "rule": `id = '${item.id}'`,
                        "title": item,
                        "fillOpacity": this.defaultIfUndefined(parseFloat(this.model.get('metadata').fillOpacity), 1),
                        "strokeWeight": this.defaultIfUndefined(parseFloat(this.model.get('metadata').strokeWeight), 1),
                        "strokeOpacity": this.defaultIfUndefined(parseFloat(this.model.get('metadata').strokeOpacity), 1),
                        "width": this.defaultIfUndefined(parseFloat(this.model.get('metadata').width), 20),
                        "shape": this.$el.find(".global-marker-shape").val(),
                        "fillColor": '#ed867d',
                        "strokeColor": this.model.get("metadata").strokeColor,
                        "isShowing": this.model.get("metadata").isShowing,
                        "id": item.id,
                    });
                });
                this.layerNoLongerNew();
                return this.layerDraft.individual;

            },

            buildContinuousSymbols: function (cont) {
                var counter = 0,
                selected = this.model.get('metadata').currentProp;
                if (!this.layerDraft.continuous === null) {
                    this.model.set('symbols', this.layerDraft.continuous);
                }
                this.layerDraft.continuous = new Symbols();
                while (Math.round(cont.currentFloor) < cont.max) {

                    const next = cont.currentFloor + cont.segmentSize;

                    // the upper bound of the final bucket should be inclusive '<=' and not '<'
                    // This is because the final upper bound is also the highest value in a given dataset,
                    // so it cannot be exluded. All other upper bounds are exlusive '<'
                    let lastRuleSymbol = !(Math.round(next) < cont.max) ? '=' : '';
                    this.layerDraft.continuous.add({
                        "rule": `${selected} >= ${cont.currentFloor.toFixed(0)} and ${selected} <${lastRuleSymbol} ${(cont.currentFloor + cont.segmentSize).toFixed(0)}`,
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
                    console.log(this.selectedColorPalette[counter]);
                    counter++;
                    cont.currentFloor = next;
                }
                console.log(cont.currentFloor);
                console.log(this.layerDraft.continuous);
                this.layerNoLongerNew();
                return this.layerDraft.continuous;
            },

            buildCategoricalSymbols: function (categoryList) {
                this.layerDraft.categorical = Symbols.buildCategoricalSymbolSet(
                    categoryList, this.model, this.selectedColorPalette);
                /*this.layerDraft.categorical = new Symbols();
                cat.list.forEach((item) => {
                    this.layerDraft.categorical.add({
                        "rule": this.model.get('metadata').currentProp + " = '" + item + "'",
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
                });*/
                this.layerNoLongerNew();
                return this.layerDraft.categorical;
            },

            // returns an object containing information
            // for defining a layer's continuous 'buckets'
            getContInfo: function () {
                var selected = this.model.get('metadata').currentProp,
                    buckets = this.model.get("metadata").buckets,
                    key = this.model.get('dataset').overlay_type,
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
                let categoryList = [];
                var key = this.model.get('dataset').overlay_type,
                selected = this.model.get('metadata').currentProp,
                collection = this.app.dataManager.getCollection(key);
                collection.models.forEach(function(d) {
                    if (!categoryList.includes(d.get(selected)) && d.get(selected)) {
                        categoryList.push(d.get(selected));
                    }
                });
                return categoryList;
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
                // this.delayExecution(
                //     "bucketTimer",
                //     () => {
                //         if (this.$el.find("#bucket").val() > 8) {
                //             this.$el.find("#bucket").val(8);
                //         }
                //         var buckets = parseFloat(this.$el.find("#bucket").val());
                //         this.updateMetadata("buckets", buckets);

                //         this.updatePalettes(this.model.get("metadata").buckets);
                //         this.contData();
                //        // that.render();
                //        this.$el.find("#bucket").focus();
                //     },
                //     300 //experiment with how many milliseconds to delay
                // );
                var buckets = parseInt(e.target.value);
                this.updateMetadata("buckets", buckets);
                this.updatePalettes(this.model.get("metadata").buckets);
                this.contData();
            },

            updatePalettes: function(itemCount) {
                let symbolType = this.model.get("metadata").isContinuous ? 'continuous' : 'categorical';
    
                const paletteId = this.model.get("metadata").paletteId;

                // update palette list and active palette
                this.allColors = this.lgPalettes.getAllPalettes(itemCount, symbolType);
                this.selectedColorPalette = this.lgPalettes.getPalette(paletteId, itemCount, symbolType);
            },

            /*
            buildPalettes: function (itemCount) {
                let count = itemCount;
                if (count > 8) { count = 8; }

                let seq1, seq2, seq3, seq4, seq5, seq6, seq7, seq8;
                const catPalettes = ['cb-Accent', 'cb-Dark2', 'cb-Paired', 'cb-Pastel1', 'cb-Set1', 'cb-Set2', 'cb-Set3', 'tol-rainbow'];
                const contPalettes = ['cb-Blues', 'cb-Oranges', 'cb-Greys', 'cb-YlGn', 'cb-RdYlBu', 'tol-dv', 'cb-Purples', 'cb-RdPu'];
                const paletteId = this.model.get("metadata").paletteId || 0;

                let paletteList, buckets;
                const gb = this.model.get('group_by');
                if (gb === 'uniform') {
                    buckets = count;
                    paletteList = catPalettes;
                } else if (gb === 'individual') {
                    console.log('individual');
                } else {
                    if (this.model.get('metadata').isContinuous) {
                        paletteList = contPalettes;
                        buckets = count + 1;
                        console.log('buckets in color sequence: ', buckets)
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
                seq8 = palette(paletteList[7], buckets);
                this.allColors = [seq1, seq2, seq3, seq4, seq5, seq6, seq7, seq8];

                if (this.model.get('metadata').isContinuous) {
                    console.log(this.allColors);
                    this.allColors.forEach((seq, index) => {
                        console.log('seq ', index, seq);
                        seq.shift();
                    });
                }
                this.selectedColorPalette = this.allColors[paletteId];
                return this.selectedColorPalette;
            },
            */

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
                    this.$el.find('#palette-opacity').val(opacity);
                } else if (opacity < 0 ) {
                    opacity = 0;
                    this.$el.find('#palette-opacity').val(opacity);
                }
                this.updateMetadata("fillOpacity", opacity);
            },

            updateGlobalShape: function(e) {
                
                const shape = e.currentTarget.dataset.shape;
                console.log('update shape,', shape);
                this.updateMetadata("shape", shape);
                this.render();
            },

            updateWidth: function(e) {
                const width = parseFloat($(e.target).val());
                this.updateMetadata("width", width);
            },

            updateStrokeWeight: function(e) {
                let strokeWeight = parseFloat($(e.target).val());
                if (strokeWeight < 0) {
                    strokeWeight = 0;
                    this.$el.find('#stroke-weight').val(strokeWeight);
                }
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
                    this.$el.find('#stroke-opacity').val(opacity);
                } else if (opacity < 0 ) {
                    opacity = 0;
                    this.$el.find('#stroke-opacity').val(opacity);
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
                    symbol.set('fillColor', "#" + that.selectedColorPalette[i % that.selectedColorPalette.length]);
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
                console.log('updateMetadata()', newValue);
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
