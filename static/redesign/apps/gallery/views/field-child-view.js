define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/field-item.html"
], function ($, _, Handlebars, Marionette, FieldItemTemplate) {
    'use strict';
    var FieldChildView = Marionette.ItemView.extend({
        initialize: function (opts) {
            _.extend(this, opts);
        },
        modelEvents: {
            'redraw': 'render'
        },
        events: {
            'click .delete-field': 'doDelete'
        },
        templateHelpers: function () {
            return {
                error: this.error
            };
        },
        template: Handlebars.compile(FieldItemTemplate),
        errorFieldType: false,
        errorFieldName: false,
        tagName: "tr",
        id: function () {
            return this.model.get("id");
        },
        saveField: function (ordering) {
            var fieldName = this.$el.find(".fieldname").val(),
                fieldType = this.$el.find(".fieldType").val(),
                that = this;

            this.errorFieldName = this.errorFieldType = false;
            if (fieldName.trim() === "") {
                this.errorFieldName = true;
            }
            if (!fieldType && this.model.get("id") === "undefined") {
                this.errorFieldType = true;
            }
            console.log(fieldName, fieldType);
            this.model.set("ordering", ordering);
            this.model.set("col_alias", fieldName);
            if (fieldType) {
                this.model.set("data_type", fieldType);
            }
            if (!this.errorFieldName && !this.errorFieldType) {
                this.model.save(null, {
                    success: function () {
                        that.render();
                    }
                });
            } else {
                this.render();
            }
        },
        onRender: function () {
            console.log('rendered');
            this.$el.removeClass("failure-message");
            if (this.errorFieldType || this.errorFieldName) {
                this.$el.addClass("failure-message show");
            }
        },
        doDelete: function (e) {
            if (!confirm("Are you sure you want to remove this field from the form?")) {
                return;
            }
            var $elem = $(e.target),
                $row = $elem.parent().parent();
            $row.remove();

            this.model.destroy();
            e.preventDefault();
        }
    });
    return FieldChildView;

});
