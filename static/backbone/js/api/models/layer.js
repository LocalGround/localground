define(["models/base", "views/maps/overlays/symbol"], function (Base, Symbol) {
    "use strict";
    /**
     * A Backbone Model class for the Photo datatype.
     * @class Layer
     * @see <a href="http://localground.org/api/0/layers/">http://localground.org/api/0/layers/</a>
     * Attributes: id, name, description, overlay_type, tags, owner, slug, access, symbols
     */
    var Layer = Base.extend({
		defaults: _.extend({}, Base.prototype.defaults, {
            isVisible: false
        }),
        symbolMap: null,
        urlRoot: "/api/0/layers/",
        getNamePlural: function () {
            return "layers";
        },
        initialize: function (data, opts) {
			Base.prototype.initialize.apply(this, arguments);
            this.buildSymbolMap();
		},
		validate: function (attrs) {
            //makes sure that symbols is either null or an array:
            if (attrs.hasOwnProperty('symbols') && (!_.isArray(attrs.symbols) && !_.isNull(attrs.symbols))) {
                return 'Layer.symbols must be a JSON array';
            }
            //if valid, returns null;
            return null;
		},
        getKey: function () {
            if (this.collection) {
                return this.collection.key;
            }
            return "layers";
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
        }
    });
    return Layer;
});
