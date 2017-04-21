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
        events: {
            'click .delete-field': 'doDelete'
        },
        templateHelpers: function () {
            return {
                errorFieldType: this.errorFieldType,
                errorFieldName: this.errorFieldName,
                serverErrorMessage: this.serverErrorMessage
            };
        },
        template: Handlebars.compile(FieldItemTemplate),
        errorFieldType: false,
        errorFieldName: false,
        serverErrorMessage: null,
        tagName: "tr",
        saveField: function (ordering) {
            var fieldName = this.$el.find(".fieldname").val(),
                fieldType = this.$el.find(".fieldType").val(),
                that = this;
            this.validate(fieldName, fieldType);
            this.model.set("ordering", ordering);
            this.model.set("col_alias", fieldName);
            console.log('saving field...', fieldName, fieldType);
            if (fieldType) {
                this.model.set("data_type", fieldType);
            }
            if (!this.errorFieldName && !this.errorFieldType) {
                this.model.save(null, {
                    success: function () {
                        that.render();
                    },
                    error: function (model, response) {
                        var messages = JSON.parse(response.responseText);
                        that.serverErrorMessage = messages.detail;
                        that.render();
                    }
                });
            } else {
                console.log("ERROR!");
                this.render();
            }
        },
        validate: function (fieldName, fieldType) {
            this.errorFieldName = this.errorFieldType = false;
            this.serverErrorMessage = null;
            if (fieldName.trim() === "") {
                this.errorFieldName = true;
            }
            if (fieldType === "-1") {
                this.errorFieldType = true;
            }
        },
        onRender: function () {
            this.$el.removeClass("failure-message");
            if (this.errorFieldType || this.errorFieldName || this.serverErrorMessage) {
                console.log("adding class");
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
            if (e) {
                e.preventDefault();
            }
        }
    });
    return FieldChildView;

});
