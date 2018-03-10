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
                this.matchedModels = new Records(null, {
                    url: '-1',
                    projectID: -1
                });
                this.set("shape", this.get("shape") || "circle");
                this.set("icon", new Icon(this.toJSON()));
                this.set("shape", this.get("icon").key);

                if (_.isUndefined(this.get("rule"))) {
                    throw new Error("rule must be defined");
                }
                if (_.isUndefined(this.get("title"))) {
                    throw new Error("title must be defined");
                }
                this.sqlParser = new SqlParser(this.get("rule"));
                this.on("change:width", this.setHeight);
            },
            setHeight: function () {
                this.set("height", this.get("width"));
            },
            set: function(key, val, options) {
                if (this.get('icon')) {
                    if (['fillColor', 'shape', 'markerSize', 'fillOpacity', 'strokeWeight'].indexOf(key) !== -1) {
                        this.get('icon')[key] = val;
                    }
                }
                Backbone.Model.prototype.set.apply(this, arguments);
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
            hasModels: function () {
                return this.matchedModels.length > 0;
            },
            getModels: function () {
                return this.matchedModels;
            },
            getModelsJSON: function () {
                return this.matchedModels.toJSON();
            }
        });
        return Symbol;
    });
