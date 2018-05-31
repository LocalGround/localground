define(['backbone', 'underscore', 'collections/records',
        'lib/sqlParser', 'lib/maps/overlays/icon'],
    function (Backbone, _, Records, SqlParser, Icon) {
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
            createCategoricalSymbol: function (category, layerModel, id, counter, palette) {
                //factory that creates new symbols:
                return new Symbol({
                    "rule": `${layerModel.get('metadata').currentProp} = '${category}'`, // + item,
                    "title": category,
                    "fillOpacity": Symbol.defaultIfUndefined(parseFloat(layerModel.get('metadata').fillOpacity), 1),
                    "strokeWeight": Symbol.defaultIfUndefined(parseFloat(layerModel.get('metadata').strokeWeight), 1),
                    "strokeOpacity": Symbol.defaultIfUndefined(parseFloat(layerModel.get('metadata').strokeOpacity), 1),
                    "width": Symbol.defaultIfUndefined(parseFloat(layerModel.get('metadata').width), 20),
                    "shape": 'circle',
                    "fillColor": "#" + palette[counter % palette.length],
                    "strokeColor": layerModel.get("metadata").strokeColor,
                    "isShowing": layerModel.get("metadata").isShowing,
                    "id": id
                });
            },
            getDefaultMetadataProperties: function (layerMetadata) {
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
            createUncategorizedSymbol: function (layerMetadata) {
                const props = _.extend({
                    'rule': Symbol.UNCATEGORIZED_SYMBOL_RULE,
                    'title': 'Other / No value',
                    'fillColor': Symbol.UNCATEGORIZED_SYMBOL_COLOR
                }, Symbol.getDefaultMetadataProperties(layerMetadata));
                return new Symbol(props);
            },
            createUniformSymbol: function (layerMetadata) {
                const props = _.extend({
                    'rule': "*",
                    'title': 'All Items',
                    'id': 1
                }, Symbol.getDefaultMetadataProperties(layerMetadata));
                return new Symbol(props);
            }
        });
        return Symbol;
    });
