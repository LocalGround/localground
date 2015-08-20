define(["underscore", "collections/dataTypes", "models/base"],
    function (_, DataTypes, Base) {
        'use strict';
        var Field = Base.extend({
            urlRoot: null, /* /api/0/forms/<form_id>/fields/.json */
            defaults: _.extend({}, Base.prototype.defaults, {
                col_alias: 'New Column Name',
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
            fetchOptions: function () {
                var dataTypes = new DataTypes(),
                    that = this;
                dataTypes.fetch({reset: true});
                dataTypes.on('reset', function () {
                    that.schema.data_type.options = _.pluck(dataTypes.toJSON(), "name");
                    that.trigger('schema-ready');
                });
            },
            initialize: function (data, opts) {
                _.extend(this, opts);
                this.fetchOptions();
                Field.__super__.initialize.apply(this, arguments);
            }
        });
        return Field;
    });
