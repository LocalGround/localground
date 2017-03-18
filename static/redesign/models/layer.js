define(["models/base", "models/symbol"], function (Base, Symbol) {
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
		},
		validate: function (attrs) {
            //if symbols is an array or it's null or it's empty, raise an exception:
            if (!_.isArray(attrs.symbols) || _.isNull(attrs.symbols) || attrs.symbols.length == 0) {
                return 'Layer.symbols must be a JSON array with at least one entry';
            }
            //if valid, returns null;
            return null;
		},

        buildSymbolMap: function () {
            //set the basic flag:
            if (this.get("symbols").length == 1) {
                this.basic = true;
            }
            if (!this.symbolMap) {
                this.symbolMap = {};
                var i = 0,
                    symbolList = this.get("symbols");
                for (i = 0; i < symbolList.length; i++) {
                    this.symbolMap[symbolList[i].rule] = new Symbol(symbolList[i]);
                }
            }
        },

        getSymbols: function () {
            return _.values(this.symbolMap);
        },

        getSymbol: function (rule) {
            return this.symbolMap[rule];
        },

        getSymbolMap: function () {
            return this.symbolMap;
        },

        hideSymbols: function () {
            _.each(this.getSymbols(), function (symbol) {
                symbol.isShowingOnMap = false;
            });
        },

        showSymbols: function () {
            _.each(this.getSymbols(), function (symbol) {
                symbol.isShowingOnMap = true;
            });
        },
        toJSON: function () {
            var json = Base.prototype.toJSON.call(this);
            
            if (json.symbols !== null) {
                json.symbols = JSON.stringify(json.symbols);
            }
            if (json.filters !== null) {
                json.filters = JSON.stringify(json.filters);
            }
            return json;
        }
    });
    return Layer;
});