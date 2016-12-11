define(["underscore", "models/base", "models/field", "collections/fields"],
    function (_, Base, Field, Fields) {
        "use strict";
        var Form = Base.extend({
            defaults: _.extend({}, Base.prototype.defaults, {
                isActive: false,
                isVisible: false,
                checked: false
            }),
            urlRoot: '/api/0/forms/',
            initialize: function (data, opts) {
                if (this.get("id")) {
                    this.fields = new Fields(null, { id: this.get("id") });
                }
                Base.prototype.initialize.apply(this, arguments);
            },

            getFields: function () {
                this.fields.fetch({ reset: true });
            },

            createField: function (name, fieldType) {
                var field = new Field(null, { id: this.get("id") }),
                    that = this;
                field.set("col_alias", name);
                field.set("data_type", fieldType);
                field.save(null, {
                    success: function () {
                        that.getFields();
                        //that.fields.add(field);
                    },
                    error: function () {
                        console.error("Field is not saved");
                    }
                });
            },
            getFieldByID: function (id) {
                return this.fields.get(id);
            }
        });
        return Form;
    });
