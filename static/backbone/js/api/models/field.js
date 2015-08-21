define(["underscore", "backgrid", "collections/columns", "collections/dataTypes", "models/base"],
    function (_, Backgrid, Columns, DataTypes, Base) {
        'use strict';
        //https://github.com/wyuenho/backgrid/blob/3b9f08c89281f3e0c13a63c559a6b76f4c940783/src/column.js
        var Field = Backgrid.Column.extend({
            urlRoot: null,
            dataTypes: new DataTypes(),
            initialize: function (data, opts) {
                console.log(data);
                //Backgrid.Column.__super__.initialize.apply(this, arguments);
                Field.__super__.initialize.apply(this, arguments);
                this.fetchOptions();
                //_.extend(this, opts);
                //this.ensureUrlRoot();
                //this.on("save", this.conformRecordToModel, this);
                this.bind('sync', this.conformRecordToModel, this);
                this.conformRecordToModel();
            },
            conformRecordToModel: function () {
                console.log("CONFORM");
                this.set("label", this.get("col_alias") || "SUP");
                this.set("name", this.get("col_name") || "SUP");
                this.set("width", 200); //Math.min(model.get("display_width"), 100));
                if (!this.get("cell")) {
                    this.set("cell", Backgrid.StringCell);
                }
            },
            defaults: _.extend(Backgrid.Column.prototype.defaults, {
                col_alias: 'New Column Name',
                data_type: "text",
                is_display_field: true,
                display_width: 100,
                is_printable: true,
                has_snippet_field: true,
                ordering: 1
            }),
            schema: {
                col_alias: { type: 'Text', title: 'Column Name' },
                data_type: { type: 'Select', options: [] },
                is_display_field: 'Hidden',
                display_width: 'Hidden',
                is_printable: 'Hidden',
                has_snippet_field: 'Hidden',
                ordering: { type: 'Text', title: 'Column Position' }
            },
            getFormSchema: function () {
                var key, val, formSchema = {};
                for (key in this.schema) {
                    val = this.schema[key];
                    formSchema[key] = {
                        type: 'Text',
                        title: val.label || key,
                        help: val.help_text || key
                    };
                }
                return formSchema;
            },
            fetchOptions: function () {
                this.dataTypes.fetch({reset: true});
                this.dataTypes.on('reset', this.updateDataTypes, this);
            },
            updateDataTypes: function () {
                this.schema.data_type.options = _.pluck(this.dataTypes.toJSON(), "name");
                this.trigger('schema-ready');
            },
            ensureUrlRoot: function () {
                if (!this.urlRoot) {
                    if (this.collection) {
                        this.urlRoot = this.collection.url;
                    } else {
                        throw "\"urlRoot\" initialization parameter is required";
                    }
                }
            }
        });
        return Field;
    });
