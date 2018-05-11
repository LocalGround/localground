define(['backbone', 'underscore', 'collections/records', 'lib/sqlParser', 'lib/maps/overlays/icon'],
    function (Backbone, _, Records, SqlParser, Icon) {
        'use strict';
        /**
         * The top-level view class that harnesses all of the map editor
         * functionality. Also coordinates event triggers across all of
         * the constituent views.
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
                isShowing: false
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
            removeModel: function(model) {
                this.matchedModels.remove(model);
            },
            containsRecord: function(model) {
                return  this.matchedModels.contains(model);
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
            defaultIfUndefined: function (domValue, defaultValue) {
                if (domValue === undefined) {
                    return defaultValue;
                } else {
                    return domValue;
                }
            },
            UNCATEGORIZED_SYMBOL_RULE: '¯\\_(ツ)_/¯',
            createCategoricalSymbol: function (category, layerModel, counter = 0, palette = ['fff']) {
                //factory that creates new symbols:
                return new Symbol({
                    "rule": `${layerModel.get('metadata').currentProp} = '${category}'`, // + item,
                    "title": category,
                    "fillOpacity": Symbol.defaultIfUndefined(parseFloat(layerModel.get('metadata').fillOpacity), 1),
                    "strokeWeight": Symbol.defaultIfUndefined(parseFloat(layerModel.get('metadata').strokeWeight), 1),
                    "strokeOpacity": Symbol.defaultIfUndefined(parseFloat(layerModel.get('metadata').strokeOpacity), 1),
                    "width": Symbol.defaultIfUndefined(parseFloat(layerModel.get('metadata').width), 20),
                    "shape": 'circle',
                    "fillColor": "#" + palette[counter % 8],
                    "strokeColor": layerModel.get("metadata").strokeColor,
                    "isShowing": layerModel.get("metadata").isShowing,
                    //"id": counter
                });
            }
        });
        return Symbol;
    });
