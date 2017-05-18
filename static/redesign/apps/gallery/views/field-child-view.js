define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/field-item.html"
], function ($, _, Handlebars, Marionette, FieldItemTemplate) {
    'use strict';
    var FieldChildView = Marionette.ItemView.extend({
        numNewRatings: 0,
        ratingsList: null,
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
            'click .add-new-rating': 'addNewRating',
            'blur .rating': 'saveRatingText'
        },
        templateHelpers: function () {
            var errorMessages = {
                errorFieldType: this.model.errorFieldType,
                errorFieldName: this.model.errorFieldName,
                serverErrorMessage: this.model.serverErrorMessage,
                extraList: this.model.get("extras"),
                numNewRatings: this.numNewRatings
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

        saveRatingText: function(e){
            $(e.target).attr("value", $(e.target).val());
            this.updateRatingList();
        },

        updateRatingList: function(){
            //if (!this.ratingsList) return;
            //AN attempt to solve the problem, but this.ratingsList is undefined
            // despite that it is an empty array, therefore nothing can be pushed
            var that  = this;
            this.ratingsList = [];
            if (this.$el.find('.rating').length == 0) return;
            var ratingsArray = this.$el.find('.rating');
            ratingsArray.each(function (index) {
                console.log(index, $(that));
                that.ratingsList.push($(this).val());
            });
        },

        addNewRating: function (e) {
            //alert("add New Rating");
            // Need to replace invisible area with append
            // at the end of the extras html class
            this.numNewRatings += 1;
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
                extras = [],
                messages;
            console.log(fieldType);
            this.validate(fieldName, fieldType);
            this.model.set("col_alias", fieldName);
            this.model.set("is_display_field", isDisplaying);

            this.$el.find('.rating').each(function (index) {
                console.log(index, $(this));
                extras.push({
                    name: $(this).val(),
                    value: (index + 1)
                });
            });
            this.model.set("extras", extras);

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
            // On ratings refresh, save the value for each stored rating
            this.updateRatingList();
            // However, it is plagued from undefined errors at this.ratingsList

            //*
            var that = this;
            if (this.ratingsList){
                var ratingTextBoxes = this.$el.find('.rating');
                ratingTextBoxes.each(function (index) {
                    console.log(index, $(that));
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
