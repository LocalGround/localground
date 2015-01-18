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
            this.models = null;
            this.color = null;
            this.shape = null;
            this.width = null;
            this.rule = null;
            this.sqlParser = null;
            this.init = function (opts) {
                var markerShape;
                $.extend(this, opts);
                this.width = this.width || 30;
                this.models = [];
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
                this.models.push(model);
                //console.log(this.models.length);
            };
            this.init(opts);
        };
        return Symbol;
    });
