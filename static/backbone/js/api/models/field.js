define(["underscore", "collections/dataTypes", "models/base"],
    function (_, DataTypes, Base) {
        'use strict';
        var Field = Base.extend({
            urlRoot: null, /* /api/0/forms/<form_id>/fields/.json */
            defaults: _.extend({}, Base.prototype.defaults, {
                data_type: 1,
                col_alias: 'New Column Name',
                is_display_field: true,
                display_width: 100,
                is_printable: true,
                has_snippet_field: true,
                ordering: 1
            }),
            schema: {
                data_type: { type: 'Select', options: new DataTypes() },
                col_alias: { type: 'Text', title: 'Column Name' },
                is_display_field: 'Hidden',
                display_width: 'Hidden',
                is_printable: 'Hidden',
                has_snippet_field: 'Hidden',
                ordering: 'Hidden'
            },
            initialize: function (opts) {
                Field.__super__.initialize.apply(this, arguments);
                //this.fetchSchemaOpts();
            }
        });
        return Base;
    });
