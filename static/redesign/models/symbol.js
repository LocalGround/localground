define(['backbone', 'underscore', 'lib/sqlParser', 'lib/maps/icon-lookup', 'lib/maps/overlays/point'],
    function (Backbone, _, SqlParser, Icon, Point) {
        'use strict';
        /**
         * The top-level view class that harnesses all of the map editor
         * functionality. Also coordinates event triggers across all of
         * the constituent views.
         * @class OverlayGroup
         */
        var Symbol = Backbone.Model.extend({
            isShowingOnMap: false,
            //note: these can be heterogeneous models from many different collections
            modelMap: null,
            color: null,
            shape: null,
            width: null,
            rule: null,
            sqlParser: null,
            initialize: function (data, opts) {
                var icon;
                _.extend(this, opts);
                Backbone.Model.prototype.initialize.apply(this, arguments);
                this.set("shape", "photo");//this.get("shape") || "photo");
                this.set("fillColor", this.get("color"));
                icon = new Icon(this.get("shape"));
                _.extend(icon, this.toJSON());
                this.set("icon", icon);
                this.modelMap = {};
                /*_.extend(this, markerShape);
                _.extend(this, { scale: markerShape.scale * this.width / markerShape.markerSize });
                if (_.isUndefined(this.rule)) {
                    throw new Error("rule must be defined");
                }
                if (_.isUndefined(this.title)) {
                    throw new Error("label must be defined");
                }
                this.sqlParser = new SqlParser(this.rule);*/
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
