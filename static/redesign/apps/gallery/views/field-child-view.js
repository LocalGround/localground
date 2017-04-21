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
            this.getDisplayField();
        },
        modelEvents: {
            'draw': 'render'
        },
        events: {
            'click .delete-field': 'doDelete',
            'blur input.fieldname': 'setAlias',
            'change select.fieldType': 'setDataType'
        },
        templateHelpers: function () {
            return {
                errorFieldType: this.errorFieldType,
                errorFieldName: this.errorFieldName,
                serverErrorMessage: this.serverErrorMessage
            };
        },
        id: function () {
            return this.model.get("temp_id");
        },
        template: Handlebars.compile(FieldItemTemplate),
        errorFieldType: false,
        errorFieldName: false,
        serverErrorMessage: null,
        tagName: "tr",

        setAlias: function () {
            this.model.set("col_alias", this.$el.find(".fieldname").val());
        },
        setDataType: function () {
            this.model.set("data_type", this.$el.find(".fieldType").val());
        },
        saveField: function (ordering) {
            var fieldName = this.$el.find(".fieldname").val(),
                fieldType = this.$el.find(".fieldType").val(),
                isDisplaying = this.$el.find('.display-field').is(":checked"),
                that = this,
                messages;
                console.log(isDisplaying);
            //ordering = this.model.get("ordering") || ordering;
            this.validate(fieldName, fieldType);
            this.model.set("ordering", ordering);
            this.model.set("col_alias", fieldName);
            this.model.set("is_display_field", isDisplaying);
            if (fieldType) {
                this.model.set("data_type", fieldType);
            }
            if (!this.errorFieldName && !this.errorFieldType) {
                console.log({
                    id: this.model.get("id"),
                    col_alias: this.model.get("col_alias"),
                    ordering: this.model.get("ordering")
                });
                this.model.save(null, {
                    success: function () {
                        that.render();
                    },
                    error: function (model, response) {
                        messages = JSON.parse(response.responseText);
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
        //*
        getDisplayField: function(){
            console.log(this.model.get("is_display_field"));
            console.log(this.$el);
            // I get context undefined each time I attempt to find class that holds the radio input
            var $displayFieldRadio = this.$el.find(".display_field_button");
            console.log($displayFieldRadio);
            //$displayFieldRadio.
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
