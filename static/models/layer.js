define(["models/base", "models/symbol", "collections/symbols"], function (Base, Symbol, Symbols) {
    "use strict";
    /**
     * A Backbone Model class for the Photo datatype.
     * @class Layer
     * @see <a href="//localground.org/api/0/layers/">//localground.org/api/0/layers/</a>
     * Attributes: id, name, caption, overlay_type, tags, owner, slug, access, symbols
     */
    var Layer = Base.extend({
        UNCATEGORIZED_SYMBOL_RULE: '¯\\_(ツ)_/¯',
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
        }),
        basic: false,
        initialize: function (data, opts) {
			Base.prototype.initialize.apply(this, arguments);
            this.applyDefaults();
            if (data.map_id) {
                this.urlRoot = "/api/0/maps/" + data.map_id + "/layers";
            } else {
                console.warn("Layer Model Warning: without the map_id, the layer can't be saved to database");
            }
		},
        isCategorical: function () {
            return !(this.isIndividual() && this.isUniform() && this.isContinuous());
        },
        isContinuous: function () {
            return this.get('metadata').isContinuous;
        },
        isUniform: function () {
            return this.get('group_by') === 'uniform';
        },
        isIndividual: function () {
            return this.get('group_by') === 'individual';
        },
        const gb = this.model.get('group_by');
        if (gb === 'uniform' || gb === 'individual') {
            return;
        }
        url: function () {
            let baseURL =  Base.prototype.url.apply(this, arguments);
            if (baseURL.indexOf('.json') === -1) {
                baseURL += '/.json';
            }
            return baseURL;
        },
        set: function(key, val, options) {
            //save symbols to a temporary variable:
            var symbols;
            if (typeof key === 'object' && key.symbols) {
                symbols = key.symbols;
                delete key.symbols;
            } else if (key === 'symbols') {
                symbols = val;
                key = null;
            }

              //call default save functionality:
              Base.prototype.set.apply(this, arguments);

              //build symbols collection if it doesn't already exist:
              if (!this.get("symbols") && symbols) {
                  const collection = new Symbols(symbols.map((symbolJSON, i) => {
                      symbolJSON.id = symbolJSON.id || (i + 1);
                      return symbolJSON;
                  }))
                  let uncategorizedSymbol = collection.findWhere({ rule: this.UNCATEGORIZED_SYMBOL_RULE });
                  if (!uncategorizedSymbol) {
                      uncategorizedSymbol = new Symbol({
                          rule: this.UNCATEGORIZED_SYMBOL_RULE,
                          title: 'Uncategorized'
                      });
                      collection.add(uncategorizedSymbol);
                  }
                  this.set("symbols", collection);
              }
        },
        applyDefaults: function () {
            var currentMetadata = _.clone(this.get("metadata")),
                defaults = _.clone(this.defaults.metadata);
            _.extend(defaults, currentMetadata);
            this.set("metadata", defaults);
        },
        //kill this hideSymbols method?
        hideSymbols: function () {
            this.get("symbols").each(function (symbol) {
                symbol.isShowingOnMap = false;
            });
        },
        //kill this showSymbols method?
        showSymbols: function () {
            this.get("symbols").each(function (symbol) {
                symbol.isShowingOnMap = true;
            });
        },
        toJSON: function () {
            var json = Base.prototype.toJSON.call(this);
            if (this.get("symbols")) {
                json.symbols = JSON.stringify(this.get("symbols").toJSON());
            }
            if (json.metadata) {
                json.metadata = JSON.stringify(json.metadata);
            }
            if (json.filters) {
                json.filters = JSON.stringify(json.filters);
            }
            return json;
        }
    });
    return Layer;
});
