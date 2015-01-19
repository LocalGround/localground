define(['jquery', 'lib/sqlParser', 'lib/maps/overlays/point'],
    function ($, SqlParser, Point) {
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
                $.extend(this, opts);
                this.width = this.width || 30;
                this.modelMap = {};
                if (this.shape == "circle") {
                    markerShape = Point.Shapes.CIRCLE;
                } else if (this.shape == "square") {
                    markerShape = Point.Shapes.SQUARE;
                } else {
                    markerShape = Point.Shapes.MAP_PIN_HOLLOW;
                }
                $.extend(this, markerShape);
                $.extend(this, { scale: markerShape.scale * this.width / markerShape.markerSize });
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
                //console.log(hash);
            };
            this.getModels = function () {
                return _.values(this.modelMap);
            };
            this.init(opts);
        };
        return Symbol;
    });
