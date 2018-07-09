define(["models/base", "models/symbol", "collections/symbols", "lib/lgPalettes"],
        function (Base, Symbol, Symbols, LGPalettes) {
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
        }),
        basic: false,
        initialize: function (data, opts) {
			Base.prototype.initialize.apply(this, arguments);
            //this.applyDefaults();
            this.lgPalettes = new LGPalettes();
            if (data.map_id) {
                this.urlRoot = "/api/0/maps/" + data.map_id + "/layers";
            } else {
                console.warn("Layer Model Warning: without the map_id, the layer can't be saved to database");
            }
		},
        isCategorical: function () {
            return !(this.isIndividual() || this.isUniform() || this.isContinuous());
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
            //if (!this.get("symbols") && symbols) {
            if (!this.get("symbols") && symbols) {
                this.setSymbols(symbols);
            }
        },
        getSymbols: function () {
            return this.get('symbols');
        },
        setSymbols: function (symbolJSON) {
            // assign ids (only if missing):
            symbolJSON = symbolJSON.map((item, i) => {
                item.id = item.id || (i + 1);
                return item;
            });
            const symbolCollection = this.get('symbols');
            if (symbolCollection) {
                symbolCollection.reset(symbolJSON)
            } else {
                this.set('symbols', new Symbols(symbolJSON, {layerModel: this}));
            }
        },
        getPalette: function () {
            const paletteId = this.get('metadata').paletteId;
            if (this.isCategorical()) {
                return this.lgPalettes.getPalette(paletteId, 8, 'categorical');
            } else if (this.isContinuous()) {
                return this.lgPalettes.getPalette(paletteId, 8, 'continuous');
            }
            return;
        },

        getNextColor: function () {
            if (this.isUniform() || this.isIndividual() || this.getSymbols().length === 0) {
                return this.get('metadata').fillColor;
            }
            const palette = this.getPalette();
            const symbols = this.getSymbols();
            for (let i = symbols.length - 1; i >= 0; i--) {
                const fillColor = symbols.at(i).get('fillColor').replace('#', '');
                const index = palette.indexOf(fillColor);
                if (index > -1) {
                    return '#' + palette[(index + 1) % 8];
                }
            }
            return '#' + palette[0];
        },
        /*applyDefaults: function () {
            var currentMetadata = _.clone(this.get("metadata")),
                defaults = _.clone(this.defaults.metadata);
            _.extend(defaults, currentMetadata);
            this.set("metadata", defaults);
        },*/

        isEmpty: function (options) {
            if (this.getSymbols().length === 0) {
                return true;
            }
            try {
                return this.getSymbols().map(n => {
                    return n.isEmpty()
                }).reduce((a, b) => {
                    return a && b;
                });
            } catch (e) {
                console.warn(e);
                return true;
            }
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
