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
        initialize: function (opts) {
            _.extend(this, opts);
            this.setRatingsFromModel();
        },
        modelEvents: {
            'draw': 'render'
        },
        events: {
            'click .remove-row': 'removeModel',
            'click .delete-field': 'doDelete',
            'blur input.fieldname': 'setAlias',
            'blur input.rating-value': 'saveNewRating',
            'blur input.rating-name': 'saveNewRating',
            'change select.fieldType': 'setDataType',
            'click .add-new-rating': 'addNewRating',
            'click .remove-rating': 'removeRating'
        },
        templateHelpers: function () {
            var errorMessages = {
                errorFieldType: this.model.errorFieldType,
                errorFieldName: this.model.errorFieldName,
                serverErrorMessage: this.model.serverErrorMessage,
                extraList: this.model.get("extras")

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
            var i,
                ratings = this.model.get("extras") || [];
            for (i = 0; i < ratings.length; i++) {
                this.ratingsList.push({
                    name: ratings[i].name,
                    value: ratings[i].value
                });
            }
        },

        saveNewRating: function (e) {
            //$(e.target).attr("value", $(e.target).val());
            this.updateRatingList();
        },
        removeRating: function (e) {
            e.preventDefault();
            if (window.confirm("Want to remove rating?")){
                var rating_row = $(e.target).closest(".rating-row");
                $(rating_row).remove();
                this.updateRatingList();
            }
        },

        updateRatingList: function () {
            //if (!this.ratingsList) return;
            //AN attempt to solve the problem, but this.ratingsList is undefined
            // despite that it is an empty array, therefore nothing can be pushed
            //console.log("update ratings list called");
            if (this.$el.find('.rating-row').length == 0) { return; }
            this.ratingsList = [];
            var that = this,
                $rows = this.$el.find('.rating-row'),
                $row;
            $rows.each(function () {
                $row = $(this);
                that.ratingsList.push({
                    name: $row.find('.rating-name').val(),
                    value: $row.find('.rating-value').val()
                });
            });
            console.log(this.ratingsList);
            this.saveRatingsToModel();
        },

        addNewRating: function (e) {
            //alert("add New Rating");
            // Need to replace invisible area with append
            // at the end of the extras html class
            this.ratingsList.push({
                name: "",
                value: ""
            });
            this.saveRatingsToModel();
            this.render();
            e.preventDefault();
        },
        setDataType: function () {
            this.model.set("data_type", this.$el.find(".fieldType").val());
            if (this.model.get("data_type") == "rating") {
                this.render();
            }
        },
        saveRatingsToModel: function () {

            this.model.set("extras", this.ratingsList);
        },
        saveField: function () {
            var that = this,
                fieldName = this.$el.find(".fieldname").val(),
                fieldType = this.$el.find(".fieldType").val(),
                isDisplaying = this.$el.find('.display-field').is(":checked"),
                messages;
            console.log(fieldType);
            this.validate(fieldName, fieldType);
            this.model.set("col_alias", fieldName);
            this.model.set("is_display_field", isDisplaying);

            this.saveRatingsToModel();

            if (fieldType) {
                this.model.set("data_type", fieldType);
            }

            if (!this.model.errorFieldName && !this.model.errorFieldType &&
                this.validateRating()) {
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
            // Go through an array of rating rows to check for empty names and values
        },

        validateRating: function(){
            var errors = false;
            for (var i = 0; i < this.ratingsList.length; ++i){
                console.log(this.ratingsList[i]);
                if (this.ratingsList[i].name.trim() === ""){
                    this.ratingsList[i].erroRatingName = true;
                    errors = true;
                } else {
                    this.ratingsList[i].erroRatingName = false;
                }
                if (this.ratingsList[i].value.toString().trim() === ""){
                    this.ratingsList[i].erroRatingValue = true;
                    errors = true;
                } else {
                    this.ratingsList[i].erroRatingValue = false;
                }
            }
            return !errors;
        },

        onRender: function () {
            this.$el.removeClass("failure-message");
            if (this.model.errorFieldType || this.model.errorFieldName || this.model.serverErrorMessage) {
                this.$el.addClass("failure-message show");
            }
            // On ratings refresh, save the value for each stored rating
            //this.updateRatingList();
            // However, it is plagued from undefined errors at this.ratingsList

            //*
            var that = this;
            if (this.ratingsList){
                var ratingTextBoxes = this.$el.find('.rating');
                ratingTextBoxes.each(function (index) {
                    $(this).val(that.ratingsList[index]);
                });
            }
            //*/

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
