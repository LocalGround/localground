define(["jquery", "lib/sqlParser", "underscore", "backbone"], function ($, SqlParser, _, Backbone) {
    "use strict";
    return {
        dataTypes: {
            'string': 'Text',
            'float': 'Number',
            'integer': 'Number',
            'boolean': 'Checkbox',
            'geojson': 'TextArea',
            'memo': 'TextArea',
            'json': 'TextArea'
        },
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
                    that.query += " and ";
                }
                if (parameter.operation == "=") {
                    that.query += parameter.name + " = " + parameter.value;
                } else {
                    that.query += parameter.name + " LIKE '%" + parameter.value + "%'";
                }
            });

        },
        clearServerQuery: function () {
            this.query = null;
        },
        fetch: function (options) {
            //console.log(this.query);
            //override fetch and append query parameters:
            if (this.query) {
                // apply some additional options to the fetch:
                options = options || {};
                options.data = options.data || {};
                options.data = { query: this.query };
            }
            return Backbone.Collection.prototype.fetch.call(this, options);
        },
        fetchFilterMetadata: function () {
            //issues an options query:
            var that = this;
            $.ajax({
                url: this.url + '.json',
                type: 'OPTIONS',
                data: { _method: 'OPTIONS' },
                success: function (data) {
                    console.log("success");
                    that.generateFilterSchema(data.filters);
                }
            });
        },
        generateFilterSchema: function (metadata) {
            var key, val;
            this.filterSchema = {};
            //https://github.com/powmedia/backbone-forms#schema-definition
            for (key in metadata) {
                val = metadata[key];
                //console.log(key);
                this.filterSchema[key] = {
                    type: this.dataTypes[val.type] || 'Text',
                    title: val.label || key,
                };
                if (val.type.indexOf("json") != -1) {
                    this.filterSchema[key].validators = [ this.validatorFunction ];
                }
            }
            this.trigger("filter-form-updated", this.filterSchema);
        }
    };
});
