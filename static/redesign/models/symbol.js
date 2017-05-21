define(['backbone', 'underscore', 'lib/sqlParser', 'lib/maps/overlays/icon'],
    function (Backbone, _, SqlParser, Icon) {
        'use strict';
        /**
         * The top-level view class that harnesses all of the map editor
         * functionality. Also coordinates event triggers across all of
         * the constituent views.
         * @class OverlayGroup
         */
        var Symbol = Backbone.Model.extend({
            isShowingOnMap: false,
            sqlParser: null,
            defaults: {
                fillOpacity: 1,
                width: 20,
                fillColor: "#4e70d4",
                strokeColor: "#4e70d4",
                strokeWeight: 3,
                strokeOpacity: 1,
                shape: "circle"
            },
            initialize: function (data, opts) {
                _.extend(this, opts);
                Backbone.Model.prototype.initialize.apply(this, arguments);
                this.set("shape", this.get("shape") || "photo");
                this.set("icon", new Icon(this.toJSON()));
                this.modelMap = {};
                if (_.isUndefined(this.get("rule"))) {
                    throw new Error("rule must be defined");
                }
                if (_.isUndefined(this.get("title"))) {
                    throw new Error("title must be defined");
                }
                this.sqlParser = new SqlParser(this.get("rule"));
            },
            checkModel: function (model) {
                return this.sqlParser.checkModel(model);
            },
            addModel: function (model) {
                var hash = model.get("overlay_type") + "_" + model.get("id");
                if (_.isUndefined(this.modelMap[hash])) {
                    this.modelMap[hash] = model;
                }
            },
            getModels: function () {
                return _.values(this.modelMap);
            }
        });
        return Symbol;
    });
