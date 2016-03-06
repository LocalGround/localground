define(["lib/sqlParser", "underscore", "backbone"], function (SqlParser, _, Backbone) {
    "use strict";
    return {
        applyFilter: function (sql) {
            var sqlParser = new SqlParser(sql),
                count = 0,
                hidden = false;
            this.each(function (item) {
                if (sqlParser.checkModel(item)) {
                    item.set("isVisible", true);
                } else {
                    item.set("isVisible", false);
                    ++count;
                }
            });
            if (count == this.models.length) {
                hidden = true;
            }
            this.trigger("filtered", { doNotRender: hidden });
        },
        clearFilter: function () {
            this.each(function (item) {
                item.set("isVisible", true);
            });
            this.trigger("filtered", { doNotRender: false });
        },
        getVisibleModels: function () {
            var models = [];
            this.each(function (item) {
                if (item.get("isVisible")) {
                    models.push(item);
                }
            });
            return models;
        },
        setServerQuery: function (parameters) {
            this.query = "WHERE ";
            var that = this;
            _.each(parameters, function (parameter, index) {
                if (index > 0) {
                    that.query += " AND ";
                }
                that.query += parameter.name + " LIKE '%" + parameter.value + "%'";
            });
        },
        clearServerQuery: function () {
            this.query = null;
        },
        fetch: function (options) {
            //override fetch and append query parameters:
            if (this.query) {
                // apply some additional options to the fetch:
                options = options || {};
                options.data = options.data || {};
                options.data = { query: this.query };
            }
            return Backbone.Collection.prototype.fetch.call(this, options);
        }
    };
});
