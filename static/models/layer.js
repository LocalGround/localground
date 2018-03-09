define(["models/base", "models/symbol", "collections/symbols"], function (Base, Symbol, Symbols) {
    "use strict";
    /**
     * A Backbone Model class for the Photo datatype.
     * @class Layer
     * @see <a href="//localground.org/api/0/layers/">//localground.org/api/0/layers/</a>
     * Attributes: id, name, caption, overlay_type, tags, owner, slug, access, symbols
     */
    var Layer = Base.extend({
		defaults: _.extend({}, Base.prototype.defaults, {
            isVisible: false,
            metadata: {
                buckets: 4,
                paletteId: 0,
                fillOpacity: 1,
                width: 20,
                fillColor: "#4e70d4",
                strokeColor: "#ffffff",
                strokeWeight: 1,
                strokeOpacity: 1,
                shape: "circle",
                isShowing: false
            },
            symbols: []
        }),
        symbolMap: null,
        basic: false,
        initialize: function (data, opts) {
			Base.prototype.initialize.apply(this, arguments);
            this.applyDefaults();
            if (data.map_id) {
                this.urlRoot = "/api/0/maps/" + data.map_id + "/layers/";
            } else {
                console.warn("Layer Model Warning: without the map_id, the layer can't be saved to database");
            }
            this.buildSymbolMap();
            //this.on("change:symbols", this.rebuildSymbolMap);
		},
        applyDefaults: function () {
            var currentMetadata = _.clone(this.get("metadata")),
                defaults = _.clone(this.defaults.metadata);
            _.extend(defaults, currentMetadata);
            this.set("metadata", defaults);
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
                    symbols = this.get("symbols"),
                    symbol;
                for (i = 0; i < symbols.length; i++) {
                    symbol = symbols[i];
                    symbol.id = symbol.id || (i + 1);
                    this.symbolMap['symbol_' + symbol.id] = new Symbol(symbols[i]);
                }
            }
        },

        getSymbols: function () {
            return new Symbols(_.values(this.symbolMap));
        },
        getSymbolsJSON: function () {
            var symbolsJSON = [];
            this.getSymbols().each(function (symbol) {
                symbolsJSON.push(symbol.getSymbolJSON());
            });
            return symbolsJSON;
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
            var json = Base.prototype.toJSON.call(this);

            // extra code to remove icon references
            // to avoid JSON serialization errors:
            json.symbols = JSON.stringify(this.getSymbolsJSON());
            json.metadata = JSON.stringify(json.metadata);

            // serialize filters also:
            if (json.filters !== null) {
                json.filters = JSON.stringify(json.filters);
            }
            return json;
        },
        save: function (attrs, opts) {
            console.log(this.attributes);
            Base.prototype.save.apply(this, arguments);
            //console.log("done");
        }
    });
    return Layer;
});
