define(["underscore", "collections/dataTypes", "models/base"],
    function (_, DataTypes, Base) {
        'use strict';
        var Field = Base.extend({
            urlRoot: null, /* /api/0/forms/<form_id>/fields/.json */
            dataTypes: new DataTypes(),
            defaults: _.extend({}, Base.prototype.defaults, {
                col_alias: 'New Column Name',
                data_type: "text",
                is_display_field: true,
                display_width: 100,
                is_printable: true,
                has_snippet_field: true,
                ordering: 1
            }),
            schema: {
                data_type: { type: 'Select', options: [] },
                col_alias: { type: 'Text', title: 'Column Name' },
                is_display_field: 'Hidden',
                display_width: 'Hidden',
                is_printable: 'Hidden',
                has_snippet_field: 'Hidden',
                ordering: 'Hidden'
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
            initialize: function (data, opts) {
                _.extend(this, opts);
                this.ensureRequiredParam("urlRoot");
                this.fetchOptions();
                Field.__super__.initialize.apply(this, arguments);
            },
            ensureRequiredParam: function (param) {
                if (!this[param]) {
                    throw "\"" + param + "\" initialization parameter is required";
                }
            }
        });
        return Field;
    });
