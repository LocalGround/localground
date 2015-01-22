define(['underscore', 'lib/sqlParser', 'lib/maps/overlays/point'],
    function (_, SqlParser, Point) {
        'use strict';
        /**
         * The top-level view class that harnesses all of the map editor
         * functionality. Also coordinates event triggers across all of
         * the constituent views.
         * @class OverlayGroup
         */
        var Symbol = function (opts) {
            this.isShowingOnMap = false;
            //note: these can be heterogeneous models from many different collections
            this.modelMap = null;
            this.color = null;
            this.shape = null;
            this.width = null;
            this.rule = null;
            this.sqlParser = null;
            this.init = function (opts) {
                var markerShape;
                _.extend(this, opts);
                this.width = this.width || 30;
                this.modelMap = {};
                if (this.shape == "circle") {
                    markerShape = Point.Shapes.CIRCLE;
                } else if (this.shape == "square") {
                    markerShape = Point.Shapes.SQUARE;
                } else {
                    markerShape = Point.Shapes.MAP_PIN_HOLLOW;
                }
                _.extend(this, markerShape);
                _.extend(this, { scale: markerShape.scale * this.width / markerShape.markerSize });
                if (_.isUndefined(this.rule)) {
                    throw new Error("rule must be defined");
                }
                if (_.isUndefined(this.title)) {
                    throw new Error("title must be defined");
                }
                this.sqlParser = new SqlParser(this.rule);
            };
            this.checkModel = function (model) {
                return this.sqlParser.checkModel(model);
            };
            this.addModel = function (model) {
                var hash = model.get("overlay_type") + "_" + model.get("id");
                if (_.isUndefined(this.modelMap[hash])) {
                    this.modelMap[hash] = model;
                }
            };
            this.getModels = function () {
                return _.values(this.modelMap);
            };
            this.init(opts);
        };
        return Symbol;
    });
