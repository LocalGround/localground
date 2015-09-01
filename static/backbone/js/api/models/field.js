define(["underscore",
        "backgrid",
        "lib/tables/cells/header-cell",
        "lib/tables/cells/header-cell-blank",
        "lib/tables/cells/cell-helpers"],
    function (_, Backgrid, HeaderCell, HeaderCellBlank, CellHelpers) {
        'use strict';
        //https://github.com/wyuenho/backgrid/blob/3b9f08c89281f3e0c13a63c559a6b76f4c940783/src/column.js
        var Field = Backgrid.Column.extend({
            urlRoot: null,
            initialize: function (data, opts) {
                try { this.urlRoot = opts.urlRoot; } catch (e) {}
                if (!this.urlRoot && (!this.collection || !this.collection.url)) {
                    throw new Error("Field initialization error: either urlRoot or collection must be defined");
                }
                Field.__super__.initialize.apply(this, arguments);
                this.bind('sync', this.conformRecordToModel, this);
                this.conformRecordToModel();
            },
            conformRecordToModel: function () {
                this.set("label", this.get("col_alias"));
                this.set("name", this.get("col_name"));
                this.set("width", this.get("display_width"));
                this.set("cell", this.getCell(this.get("data_type")));
                if (this.get("isAdmin")) {
                    this.set("headerCell", HeaderCellBlank);
                } else {
                    this.set("headerCell", HeaderCell);
                }
                this.trigger("model-columnized");
            },
            defaults: _.extend(Backgrid.Column.prototype.defaults, {
                col_alias: 'New Column Name',
                data_type: "text",
                is_display_field: true,
                display_width: 200,
                is_printable: true,
                has_snippet_field: false,
                ordering: 1
            }),
            schema: {
                col_alias: { type: 'Text', title: 'Column Name' },
                data_type: { type: 'Select', options: [] },
                is_display_field: 'Hidden',
                display_width: 'Hidden',
                is_printable: 'Hidden',
                has_snippet_field: 'Hidden',
                ordering: { type: 'Number', title: 'Column Position' }
            },
            getFormSchema: function (dataTypes) {
                if (!dataTypes) {
                    throw new Error("Field model error: dataTypes (a DataTypes collection) is a required argument.");
                }
                var key, val, formSchema = {};
                this.schema.data_type.options = _.pluck(dataTypes.toJSON(), "name");
                for (key in this.schema) {
                    val = this.schema[key];
                    formSchema[key] = {
                        type: 'Text',
                        title: val.label || key,
                        help: val.help_text || key
                    };
                }
                return formSchema;
            }/*,
            toJSON: function () {
                var that = this,
                    d = {},
                    fields = ["col_alias", "col_name", "data_type", "display_width", "ordering"];
                _.each(fields, function (key) {
                    d[key] = that.get(key);
                });
                return d;
            }*/
        });
        _.extend(Field.prototype, CellHelpers);
        return Field;
    });
