define(['jquery', 'lib/sqlParser'],
    function ($, SqlParser) {
        'use strict';
        /**
         * The top-level view class that harnesses all of the map editor
         * functionality. Also coordinates event triggers across all of
         * the constituent views.
         * @class OverlayGroup
         */
        var Symbol = function (opts) {
            this.models = [];
            this.color = null;
            this.symbol = null;
            this.width = null;
            this.rule = null;
            this.sqlParser = null;
            this.init = function (opts) {
                $.extend(this, opts);
                this.width = this.width || 30;
                this.sqlParser = new SqlParser(this.rule);
            };
            this.checkModel = function (model) {
                return this.sqlParser.checkModel(model);
            };
            this.addModel = function (model) {
                this.models.push(model);
            };
            this.init(opts);
        };
        return Symbol;
    });
