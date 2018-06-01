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
                    throw new Error("rule must be defined");
                }
                if (_.isUndefined(this.get("title"))) {
                    throw new Error("title must be defined");
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
                        this.get('icon')[key] = val;
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
            UNCATEGORIZED_SYMBOL_COLOR: '#BBB',
            UNCATEGORIZED_SYMBOL_RULE: '¯\\_(ツ)_/¯',

            _getDefaultMetadataProperties: function (layerMetadata) {
                if (!layerMetadata) {
                    return {};
                }
                return {
                    'shape': 'circle',
                    'fillOpacity': Symbol.defaultIfUndefined(parseFloat(layerMetadata.fillOpacity), 1),
                    'strokeWeight': Symbol.defaultIfUndefined(parseFloat(layerMetadata.strokeWeight), 1),
                    'strokeOpacity': Symbol.defaultIfUndefined(parseFloat(layerMetadata.strokeOpacity), 1),
                    'strokeColor': layerMetadata.strokeColor,
                    'width': Symbol.defaultIfUndefined(parseFloat(layerMetadata.width), 20),
                    'isShowing': layerMetadata.isShowing
                };
            },
            createCategoricalSymbol: function (layerModel, value, counter) {
                //factory that creates new symbols:
                const lgPalettes = new LGPalettes();
                counter = counter || layerModel.getSymbols().length;
                const metadata = layerModel.get('metadata');
                const prop = metadata.currentProp;
                const palette = lgPalettes.getPalette(metadata.paletteId, 8, 'categorical');
                const props = _.extend({
                    'rule': `${prop} = '${value}'`,
                    'title': value,
                    'fillColor': "#" + palette[counter % palette.length],
                    'id': counter + 1
                }, Symbol._getDefaultMetadataProperties(metadata));
                return new Symbol(props);
            },
            createIndividualSymbol: function (layerModel, value) {
                //factory that creates new symbols:
                const metadata = layerModel.get('metadata');
                const counter = layerModel.getSymbols().length;
                const props = _.extend({
                    'rule': `id = ${value}`,
                    'title': value,
                    'id': counter + 1
                }, Symbol._getDefaultMetadataProperties(metadata));
                return new Symbol(props);
            },
            createUncategorizedSymbol: function (layerModel) {
                const metadata = layerModel.get('metadata');
                const counter = layerModel.getSymbols().length;
                const props = _.extend(
                    Symbol._getDefaultMetadataProperties(metadata), {
                    'rule': Symbol.UNCATEGORIZED_SYMBOL_RULE,
                    'title': 'Other / No value',
                    'fillColor': Symbol.UNCATEGORIZED_SYMBOL_COLOR,
                    'id': counter + 1
                });
                return new Symbol(props);
            },
            createUniformSymbol: function (layerModel) {
                const metadata = layerModel.get('metadata');
                const props = _.extend(
                    Symbol._getDefaultMetadataProperties(metadata), {
                    'rule': "*",
                    'title': 'All Items',
                    'id': 1
                });
                return new Symbol(props);
            }
        });
        return Symbol;
    });
