define(['backbone', 'underscore', 'collections/records',
        'lib/sqlParser', 'lib/maps/overlays/icon', 'lib/lgPalettes'],
    function (Backbone, _, Records, SqlParser, Icon, LGPalettes) {
        'use strict';
        /**
         * Handles the rendering and sorting of records into
         * their corresponding associations
         * @class Symbol
         */
        var Symbol = Backbone.Model.extend({
            isShowingOnMap: false,
            sqlParser: null,
            defaults: {
                fillOpacity: 1,
                width: 20,
                height: 20,
                fillColor: "#4e70d4",
                strokeColor: "#FFFFFF",
                strokeWeight: 1,
                strokeOpacity: 1,
                shape: "circle",
                isShowing: true
            },
            initialize: function (data, opts) {
                _.extend(this, opts);
                Backbone.Model.prototype.initialize.apply(this, arguments);
                if (_.isUndefined(this.get("rule"))) {
                    throw "rule must be defined";
                }
                if (_.isUndefined(this.get("title"))) {
                    throw "title must be defined";
                }
                this.matchedModels = new Records(null, {
                    url: '-1',
                    projectID: -1
                });
                this.set("shape", this.get("shape") || "circle");
                this.set("icon", new Icon(this.toJSON()));
                this.set("shape", this.get("icon").key);

                this.sqlParser = new SqlParser(this.get("rule"));
                this.on("change:width", this.setHeight);
            },
            set: function(key, val, options) {
                if (this.get('icon')) {
                    if ([
                        'fillColor', 'strokeColor', 'shape',
                        'fillOpacity', 'width', 'strokeWeight'].indexOf(key) !== -1) {
                        //dynamically update the icon:
                        const properties = this.toJSON();
                        properties[key] = val;
                        this.attributes['icon'] = new Icon(properties);
                    }
                }
                Backbone.Model.prototype.set.apply(this, arguments);
            },
            setHeight: function () {
                this.set("height", this.get("width"));
            },
            toJSON: function () {
                var json = Backbone.Model.prototype.toJSON.call(this);
                delete json.icon;
                return json;
            },
            getSymbolJSON: function () {
                var symbol = this.clone();
                delete symbol.attributes.icon;
                return symbol.toJSON();
            },
            checkModel: function (model) {
                return this.sqlParser.checkModel(model);
            },
            addModel: function (model) {
                model.set('display_name', model.get('display_name') || model.get('name'))
                this.matchedModels.add(model)
            },
            isEmpty: function () {
                this.matchedModels.length === 0;
            },
            removeModel: function(model) {
                this.matchedModels.remove(model);
            },
            containsRecord: function(model) {
                return  this.matchedModels.contains(model);
            },
            isUncategorized: function () {
                return this.get('rule') === Symbol.UNCATEGORIZED_SYMBOL_RULE;
            },
            isUpdateCandidate: function (record, value) {
                if (this.isUncategorized()) {
                    return false;
                }
                if (!(value || value === 0 || value === false)) {
                    return false;
                }
                return (
                    this.containsRecord(record) &&
                    !this.checkModel(record) &&
                    this.matchedModels.length === 1
                );
            },
            isRemovalCandidate: function (record) {
                // returns true if the symbol contains the record and either:
                //  a) the record doesn't match or
                //  b) it's an uncategorized symbol with only one record:

                const result = (
                    this.containsRecord(record) && (
                        !this.checkModel(record) || (
                            this.isUncategorized() &&
                            this.matchedModels.length <= 1
                        )
                    )
                );
                return result;
            },
            hasModels: function () {
                return this.matchedModels.length > 0;
            },
            getModels: function () {
                return this.matchedModels;
            },
            getModelsJSON: function () {
                return this.matchedModels.toJSON();
            }
        }, {
            // returns a default value if the input value from the dom is undefined
            // needed because simply using '||' for defaults is buggy
            defaultIfUndefined: function (value, defaultValue) {
                if (value === undefined || value === null || value === '') {
                    return defaultValue;
                } else {
                    return value;
                }
            },
            UNIFORM_SYMBOL_COLOR: '#4e70d4',
            INDIVIDUAL_SYMBOL_COLOR: '#ed867d',
            UNCATEGORIZED_SYMBOL_COLOR: '#BBB',
            UNCATEGORIZED_SYMBOL_RULE: '¯\\_(ツ)_/¯',

            _getDefaultMetadataProperties: function (layerMetadata) {
                if (!layerMetadata) {
                    return {};
                }
                const defaults = {
                    'shape': 'circle',
                    'fillColor': layerMetadata.fillColor,
                    'fillOpacity': Symbol.defaultIfUndefined(parseFloat(layerMetadata.fillOpacity), 1),
                    'strokeWeight': Symbol.defaultIfUndefined(parseFloat(layerMetadata.strokeWeight), 1),
                    'strokeOpacity': Symbol.defaultIfUndefined(parseFloat(layerMetadata.strokeOpacity), 1),
                    'strokeColor': layerMetadata.strokeColor,
                    'width': Symbol.defaultIfUndefined(parseFloat(layerMetadata.width), 20),
                    'isShowing': layerMetadata.isShowing
                };
                console.log(defaults);
                return defaults;
            },
            createCategoricalSymbol: function (opts) {
                //factory that creates new symbols:
                const layerModel = opts.layerModel;
                const value = opts.category;
                const id = opts.id;
                const fillColor = opts.fillColor;
                const metadata = layerModel.get('metadata');
                const prop = metadata.currentProp;
                const props = _.extend(
                    Symbol._getDefaultMetadataProperties(metadata), {
                        'rule': `${prop} = '${value}'`,
                        'title': value,
                        'id': id,
                        'fillColor': fillColor
                    });
                return new Symbol(props);
            },
            createIndividualSymbol: function (opts) {
                const layerModel = opts.layerModel;
                const value = opts.category;
                const id = opts.id;
                const fillColor = opts.fillColor;
                //factory that creates new symbols:
                const metadata = layerModel.get('metadata');
                //const counter = layerModel.getSymbols().length;
                const props = _.extend(
                    Symbol._getDefaultMetadataProperties(metadata), {
                        'rule': `id = ${value}`,
                        'title': value,
                        'id': id,
                        'fillColor': fillColor
                    });
                return new Symbol(props);
            },
            createUncategorizedSymbol: function (opts) {
                const layerModel = opts.layerModel;
                const id = opts.id
                const metadata = layerModel.get('metadata');
                //const counter = layerModel.getSymbols().length;
                const props = _.extend(
                    Symbol._getDefaultMetadataProperties(metadata), {
                    'rule': Symbol.UNCATEGORIZED_SYMBOL_RULE,
                    'title': 'Other / No value',
                    'fillColor': Symbol.UNCATEGORIZED_SYMBOL_COLOR,
                    'id': id
                });
                return new Symbol(props);
            },
            createUniformSymbol: function (layerModel, id) {
                const metadata = layerModel.get('metadata');
                const props = _.extend(
                    Symbol._getDefaultMetadataProperties(metadata), {
                    'rule': "*",
                    'title': 'All Items',
                    'id': id
                });
                return new Symbol(props);
            }
        });
        return Symbol;
    });
