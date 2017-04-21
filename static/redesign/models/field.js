define(["underscore", "collections/dataTypes", "models/base"],
    function (_, DataTypes, Base) {
        'use strict';
        var Field = Base.extend({
            baseURL: null,
            form: null,
            defaults: _.extend({}, Base.prototype.defaults, {
                col_alias: '',
                is_display_field: false,
                display_width: 100,
                is_printable: true,
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
            urlRoot: function () {
                if (this.baseURL) {
                    return this.baseURL;
                }
                return '/api/0/forms/' + this.form.get("id") + '/fields/';
            },
            initialize: function (data, opts) {
                // This had to be made dynamic because there are different Fields
                // for each form
                if (this.collection && this.collection.url) {
                    this.baseURL = this.collection.url();
                } else if (opts.id) {
                    this.baseURL = '/api/0/forms/' + opts.id + '/fields/';
                } else if (opts.form) {
                    this.form =  opts.form;
                } else {
                    alert("id initialization parameter required for Field");
                    return;
                }
                if (this.get("field")) {
                    this.url = this.urlRoot() + this.get("field") + "/";
                }
                Base.prototype.initialize.apply(this, arguments);
            }
        });
        return Field;
    });
