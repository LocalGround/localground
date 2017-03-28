define(["backbone", "models/base", "models/symbol"], function (Backbone, Base, Symbol) {
    "use strict";
    /**
     * A Backbone Model class for the Photo datatype.
     * @class Layer
     * @see <a href="//localground.org/api/0/layers/">//localground.org/api/0/layers/</a>
     * Attributes: id, name, caption, overlay_type, tags, owner, slug, access, symbols
     */
    var Layer = Base.extend({
		defaults: _.extend({}, Base.prototype.defaults, {
            isVisible: false
        }),
        symbolMap: null,
        //urlRoot: "/api/0/layers/",
        getNamePlural: function () {
            return "layers";
        },
        basic: false,
        initialize: function (data, opts) {
			Base.prototype.initialize.apply(this, arguments);
            this.buildSymbolMap();
            if (data.map_id) {
                this.urlRoot = "/api/0/maps/" + data.map_id + "/layers/";
            }
            this.on("change:symbols", this.rebuildSymbolMap);
		},
		validate: function (attrs) {
            //if symbols is an array or it's null or it's empty, raise an exception:
            if (!_.isArray(attrs.symbols) || _.isNull(attrs.symbols) || attrs.symbols.length == 0) {
                return 'Layer.symbols must be a JSON array with at least one entry';
            }
            //if valid, returns null;
            return null;
		},

        rebuildSymbolMap: function () {
            this.symbolMap = null;
            this.buildSymbolMap();
        },
        buildSymbolMap: function () {
            //set the basic flag:
            if (this.get("symbols").length == 1) {
                this.basic = true;
            }
            if (!this.symbolMap) {
                this.symbolMap = {};
                var i = 0,
                    symbolList = this.get("symbols"),
                    symbol;
                for (i = 0; i < symbolList.length; i++) {
                    symbol = symbolList[i];
                    symbol.id = (i + 1);
                    this.symbolMap['symbol_' + symbol.id] = new Symbol(symbolList[i]);
                }
            }
        },

        getSymbols: function () {
            return new Backbone.Collection(_.values(this.symbolMap));
        },
        getSymbolsJSON: function () {
            var symbols = this.getSymbols().clone();
            symbols.each(function (symbol) {
                symbol.set("icon", null);
            });
            return symbols.toJSON();
        },

        getSymbol: function (id) {
            return this.symbolMap['symbol_' + id];
        },
        setSymbol: function (model) {
            this.symbolMap['symbol_' + model.id] = model;
            this.set("symbols", this.getSymbols().toJSON());
        },

        getSymbolMap: function () {
            return this.symbolMap;
        },

        hideSymbols: function () {
            this.getSymbols().each(function (symbol) {
                symbol.isShowingOnMap = false;
            });
        },

        showSymbols: function () {
            this.getSymbols().each(function (symbol) {
                symbol.isShowingOnMap = true;
            });
        },
        toJSON: function () {
            var json = Base.prototype.toJSON.call(this),
                symbols;

            // extra code to remove icon references
            // to avoid JSON serialization errors:
            if (json.symbols !== null) {
                symbols = new Backbone.Collection(json.symbols).clone();
                symbols.each(function (symbol) {
                    symbol.set("icon", null);
                });
                json.symbols = JSON.stringify(symbols);
            }

            // serialize filters also:
            if (json.filters !== null) {
                json.filters = JSON.stringify(json.filters);
            }
            return json;
        }
    });
    return Layer;
});