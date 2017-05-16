define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/field-item.html"
], function ($, _, Handlebars, Marionette, FieldItemTemplate) {
    'use strict';
    var FieldChildView = Marionette.ItemView.extend({
        showRatingTextbox: false,
        initialize: function (opts) {
            _.extend(this, opts);
        },
        modelEvents: {
            'draw': 'render'
        },
        events: {
            'click .remove-row': 'removeModel',
            'click .delete-field': 'doDelete',
            'blur input.fieldname': 'setAlias',
            'change select.fieldType': 'setDataType',
            'click .add-new-rating': 'addNewRating'
        },
        templateHelpers: function () {
            var errorMessages = {
                errorFieldType: this.model.errorFieldType,
                errorFieldName: this.model.errorFieldName,
                serverErrorMessage: this.model.serverErrorMessage,
                extraList: this.model.get("extras"),
                showRatingTextbox: this.showRatingTextbox
            };
            return errorMessages;
        },
        id: function () {
            return this.model.get("temp_id");
        },
        template: Handlebars.compile(FieldItemTemplate),
        tagName: "tr",

        setAlias: function () {
            this.model.set("col_alias", this.$el.find(".fieldname").val());
        },
        addNewRating: function (e) {
            //alert("add New Rating");
            // Need to replace invisible area with append
            // at the end of the extras html class
            this.showRatingTextbox = true;
            this.render();
            e.preventDefault();
        },
        setDataType: function () {
            this.model.set("data_type", this.$el.find(".fieldType").val());
            if (this.model.get("data_type") == "rating"){
                console.log("show the drop-down options");
                this.render();
            }
        },
        saveField: function () {
            var that = this,
                fieldName = this.$el.find(".fieldname").val(),
                fieldType = this.$el.find(".fieldType").val(),
                isDisplaying = this.$el.find('.display-field').is(":checked"),
                extras = this.$el.find('.extras'),
                messages;
            console.log(fieldType);
            this.validate(fieldName, fieldType);
            this.model.set("col_alias", fieldName);
            this.model.set("is_display_field", isDisplaying);
            if (extras) {
                /*
                * The '+' symbol is always the first index (0) inside the extras
                * followed by the text boxes that contain names
                * we set the number values based on the order of the ratings
                */

                console.log(extras);
                console.log(extras.children());
                var extras_list = {};
                for (var i = 1; i < extras.children().length; ++i){
                    var ratingName = extras.children().eq(i).val();
                    //console.log(ratingName, i);
                    // As of now, the changes are not yet saved
                    // ans still need to append new ratings
                    extras_list.push({name: ratingName, value: i});
                }


                this.model.set("extras", extras_list);


                /*
                console.log(extras);
                extras = JSON.parse(extras);
                console.log(extras);
                */
            }
            if (fieldType) {
                this.model.set("data_type", fieldType);
            }
            if (!this.model.errorFieldName && !this.model.errorFieldType) {
                this.model.save(null, {
                    success: function () {
                        that.parent.renderWithSaveMessages();
                    },
                    error: function (model, response) {
                        messages = JSON.parse(response.responseText);
                        that.model.serverErrorMessage = messages.detail;
                        that.parent.renderWithSaveMessages();
                    }
                });
            } else {
                this.render();
            }
        },
        validate: function (fieldName, fieldType) {
            this.model.errorFieldName = this.model.errorFieldType = false;
            this.model.serverErrorMessage = null;
            if (fieldName.trim() === "") {
                this.model.errorFieldName = true;
            }
            if (fieldType === "-1") {
                this.model.errorFieldType = true;
            }
        },
        onRender: function () {
            this.$el.removeClass("failure-message");
            if (this.model.errorFieldType || this.model.errorFieldName || this.model.serverErrorMessage) {
                this.$el.addClass("failure-message show");
            }
        },
        removeModel: function () {
            this.model.destroy();
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
