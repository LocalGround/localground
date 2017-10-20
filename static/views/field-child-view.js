define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/field-item.html"
], function ($, _, Handlebars, Marionette, FieldItemTemplate) {
    'use strict';
    var FieldChildView = Marionette.ItemView.extend({
        ratingsList: [],
        choicesList: [],
        initialize: function (opts) {
            _.extend(this, opts);
            if (!this.app) {
                this.app = this.parent.app;
            }
            this.setRatingsFromModel();
            this.setChoicesFromModel();
        },
        modelEvents: {
            'draw': 'render'
        },
        events: {
            'click .remove-row': 'removeFieldRow',
            'click .delete-field': 'deleteField',
            'blur input.fieldname': 'setAlias',
            'blur input.rating-value': 'saveNewRating',
            'blur input.rating-name': 'saveNewRating',
            'blur input.choice': 'saveNewChoice',
            'change select.fieldType': 'setDataType',
            'click .add-new-rating': 'addNewRating',
            'click .remove-rating': 'removeRating',
            'click .add-new-choice': 'addNewChoice',
            'click .remove-choice': 'removeChoice'
        },
        templateHelpers: function () {
            var errorMessages = {
                serverErrorMessage: this.model.serverErrorMessage,
                extraList: this.model.get("extras"),
                errorMessage: this.model.errorMessage
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

        setRatingsFromModel: function () {
            if (this.model.get("data_type") != "rating") { return; }
            this.ratingsList = this.model.get("extras") || [];
        },

        setChoicesFromModel: function () {
            if (this.model.get("data_type") != "choice") { return; }
            this.choicesList = this.model.get("extras") || [];
        },

        saveNewRating: function () {
            this.updateRatingList();
        },

        saveNewChoice: function () {
            this.updateChoiceList();
        },

        removeRating: function (e) {
            e.preventDefault();
            if (this.$el.find('.rating-row').length == 1){
                this.model.errorMessage = "Must have at least 1 rating to exist"
                this.render();
                return;
            }
            if (window.confirm("Want to remove rating?")){
                var rating_row = $(e.target).closest(".rating-row");
                $(rating_row).remove();
                this.updateRatingList();
            }
        },
        removeChoice: function (e) {

            e.preventDefault();
            if (this.$el.find('.choice-row').length == 1){
                this.model.errorMessage = "Must have at least 1 choice to exist"
                this.render();
                return;
            }
            if (window.confirm("Want to remove choice?")){
                var choice_row = $(e.target).closest(".choice-row");
                $(choice_row).remove();
                this.updateChoiceList();
            }
        },

        updateRatingList: function () {
            if (this.$el.find('.rating-row').length == 0) { return; }
            this.ratingsList = [];
            var that = this,
                $rows = this.$el.find('.rating-row'),
                $row;
            $rows.each(function () {
                $row = $(this);

                var original_value = $row.find('.rating-value').val();
                var _rating_value = parseInt($row.find('.rating-value').val());
                if (isNaN(_rating_value)) _rating_value = original_value;

                that.ratingsList.push({
                    name: $row.find('.rating-name').val(),
                    value: _rating_value
                });
            });
            this.saveRatingsToModel();
        },

        updateChoiceList: function () {
            if (this.$el.find('.choice-row').length == 0) { return; }
            this.choicesList = [];
            var that = this,
                $rows = this.$el.find('.choice-row'),
                $row;
            $rows.each(function () {
                $row = $(this);
                that.choicesList.push({
                    name: $row.find(".choice").val()
                });
            });
            this.saveChoicesToModel();
        },

        addNewRating: function (e) {

            this.ratingsList.push({
                name: "",
                value: ""
            });
            this.saveRatingsToModel();
            this.render();
            e.preventDefault();
        },

        addNewChoice: function (e) {
            this.choicesList.push({
                name: ""
            });
            this.saveChoicesToModel();
            this.render();
            e.preventDefault();
        },

        setDataType: function () {
            this.model.set("data_type", this.$el.find(".fieldType").val());
            this.render();
        },
        saveRatingsToModel: function () {
            this.model.set("extras", this.ratingsList);
        },

        saveChoicesToModel: function () {
            this.model.set("extras", this.choicesList);
        },
        validateField: function () {
            this.model.errorMessage = "";
            if (!this.model.isValid() ) {
                console.log("Field Error Detected");
                if (!this.parent){
                    this.app.vent.trigger('error-message', this.model.validationError);
                }
                return false;
            } else {
                return true;
            }

        },
        setFieldValuesFromHtmlForm: function () {
            var fieldName = this.$el.find(".fieldname").val(),
                fieldType = this.$el.find(".fieldType").val(),
                isDisplaying = this.$el.find('.display-field').is(":checked"),
                messages;
            this.model.set("col_alias", fieldName);
            this.model.set("is_display_field", isDisplaying);

            if (fieldType) {
                this.model.set("data_type", fieldType);
            }

            if (!this.parent){
                this.validateField();
            }

            if (fieldType == "rating"){
                this.saveRatingsToModel();
            } else if (fieldType == "choice") {
                this.saveChoicesToModel();
            }
        },
        saveField: function () {
            var that = this;
            this.setFieldValuesFromHtmlForm();
            this.model.save(null, {
                success: function () {
                    if (that.parent) {
                        //if we're in the "Edit Site Types View"
                        that.parent.renderWithSaveMessages();
                    } else {
                        //if we're in the spreadsheet "Add Field" view
                        that.model.set("ordering", that.fields.length);
                        that.fields.add(that.model);
                        that.app.vent.trigger('success-message', "New Field added");
                        that.app.vent.trigger("render-spreadsheet");
                        that.app.vent.trigger("hide-modal");
                    }

                },
                error: function (model, response) {
                    messages = JSON.parse(response.responseText);
                    that.model.serverErrorMessage = messages.detail;
                    if (that.parent) {
                        that.parent.renderWithSaveMessages();
                    } else {
                        that.app.vent.trigger('error-message', "Child field has not been saved.");
                    }
                }
            });
            if (!this.parent){
                this.render();
            }
        },

        onRender: function () {
            this.$el.removeClass("failure-message");
            if (this.model.errorFieldType || this.model.errorFieldName || this.model.serverErrorMessage) {
                this.$el.addClass("failure-message show");
            }
            var that = this;
            if (this.ratingsList){
                var ratingTextBoxes = this.$el.find('.rating');
                ratingTextBoxes.each(function (index) {
                    $(this).val(that.ratingsList[index]);
                });
            }

            else if (this.choicesList){
                var choiceTextBoxes = this.$el.find('.choice');
                choiceTextBoxes.each(function (index) {
                    $(this).val(that.choicesList[index]);
                });
            }

        },
        removeFieldRow: function () {
            this.model.destroy();
        },

        deleteField: function (e) {
            if (this.parent && this.parent.collection.length == 1){
                this.parent.app.vent.trigger("error-message", "Cannot delete the last field");
                return
            }
            console.log("Confirm Delete")
            if (!confirm("Are you sure you want to remove this field from the form?")) {
                return;
            }

            console.log("Delete Model")

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
