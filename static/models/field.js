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
                ordering: 1,
                extras: {}
            }),
            url: function () {
                let baseURL =  Base.prototype.url.apply(this, arguments);
                if (baseURL.indexOf('.json') === -1) {
                    baseURL += '/.json';
                }
                return baseURL;
            },
            schema: {
                data_type: { type: 'Select', options: new DataTypes() },
                col_alias: { type: 'Text', title: 'Column Name' },
                is_display_field: 'Hidden',
                display_width: 'Hidden',
                is_printable: 'Hidden',
                has_snippet_field: 'Hidden',
                ordering: 'Hidden'
            },
            errorMessage: null,
            urlRoot: function () {
                if (this.baseURL) {
                    return this.baseURL;
                }
                return '/api/0/datasets/' + this.form.get("id") + '/fields/';
            },

            initialize: function (data, opts) {
                // This had to be made dynamic because there are different Fields
                // for each form
                //console.log(data, opts)
                if (this.collection && this.collection.url) {
                    this.baseURL = this.collection.url();
                } else if (opts.id) {
                    this.baseURL = '/api/0/datasets/' + opts.id + '/fields';
                } else if (opts.form) {
                    this.form = opts.form;
                } else {
                    alert("id initialization parameter required for Field");
                    return;
                }
                this.set('temp_id', parseInt(Math.random(10) * 10000000).toString());
                if (this.get("field")) {
                    this.url = this.urlRoot() + this.get("field") + "/";
                }
                Base.prototype.initialize.apply(this, arguments);
            },
            // validate: function (attrs, options) {
            //     // These attributes will be transferred
            //     // to the error message function so it will be displayed on eachField
            //     this.set("errorFieldName", false);
            //     this.set("errorFieldType", false);
            //     this.set("errorRatingName", false);
            //     this.set("errorRatingValue", false);
            //     this.set("errorMissingRatings", false);
            //     this.set("errorMissingChoices", false);
            //     // reset error message each time in case
            //     // for no error or new one
            //     this.errorMessage = "";
            //
            //     // variables to keep track of the errorMessage
            //
            //     var errorName, errorType,
            //         errorRatingName, errorRatingValue, errorChoice,
            //         errorMissingRatings, errorMissingChoices;
            //
            //     var emptyName = attrs.col_alias.trim() === "";
            //     var unselectedType = attrs.data_type === "-1" || !attrs.data_type;
            //
            //     this.set("errorFieldName", emptyName);
            //     this.set("errorFieldType", unselectedType);
            //     this.validateRating(attrs);
            //     this.validateChoice(attrs);
            //     errorName = this.get("errorFieldName");
            //     errorType = this.get("errorFieldType");
            //     errorRatingName = this.get("errorRatingName");
            //     errorRatingValue = this.get("errorRatingValue");
            //     errorChoice = this.get("errorChoice");
            //     errorMissingRatings = this.get("errorMissingRatings");
            //     errorMissingChoices = this.get("errorMissingChoices");
            //
            //     if (errorName && errorType) return this.getErrorMessage("errorField");
            //     if (errorName) return this.getErrorMessage("errorFieldName");
            //     if (errorType) return this.getErrorMessage("errorFieldType");
            //     if (errorRatingName && errorRatingValue) return this.getErrorMessage("errorRating");
            //     if (errorRatingName) return this.getErrorMessage("errorRatingName");
            //     if (errorRatingValue) return this.getErrorMessage("errorRatingValue");
            //     if (errorChoice) return this.getErrorMessage("errorChoice");
            //     if (errorMissingRatings) return this.getErrorMessage("errorMissingRatings");
            //     if (errorMissingChoices) return this.getErrorMessage("errorMissingChoices");
            //
            //
            // },
            // getErrorMessage: function (key) {
            //     // Use this as the basis for its own template
            //     // will eventually cut down uneccessary logic
            //     // so that errors will simply be outputted
            //     var messages = {
            //         "errorField": "Both field name and type are required",
            //         "errorFieldName": "A field name is required",
            //         "errorFieldType": "A field type is required",
            //         "errorRating": "Both rating name and value are required",
            //         "errorRatingName": "A rating name is required",
            //         "errorRatingValue": "A rating value (integer) is required",
            //         "errorChoice": "A choice name is required",
            //         "errorMissingRatings": "One or more ratings are needed for this field",
            //         "errorMissingChoices": "One or more choices are needed for this field"
            //     }
            //     this.errorMessage = messages[key];
            //     return this.errorMessage;
            // },
            //
            // validateRating: function (attrs) {
            //     // No need to check if incorrect type
            //     if (attrs.data_type !== "rating") return true;
            //     if (!attrs.extras || attrs.extras.length === 0) {
            //         this.set("errorMissingRatings", true);
            //         return false;
            //     }
            //     var rating_item_blank = false;
            //     for (var i = 0; i < attrs.extras.length; ++i) {
            //         if (attrs.extras[i].name.trim() === "") {
            //             this.set("errorRatingName", true);
            //             rating_item_blank = true;
            //         }
            //         if (isNaN(parseInt(attrs.extras[i].value))){
            //             this.set("errorRatingValue", true);
            //             rating_item_blank = true;
            //         }
            //         if (rating_item_blank) return false;
            //     }
            //     return true;
            // },

            validateChoice: function (attrs) {
                // No need to check if incorrect type
                if (attrs.data_type !== "choice") return true;
                if (!attrs.extras || attrs.extras.length === 0) {
                    this.set("errorMissingChoices", true);
                    return false;
                }
                for (var i = 0; i < attrs.extras.length; ++i) {
                    if (attrs.extras[i].name.trim() === "") {
                        this.set("errorChoice", true);
                        return false;
                    }
                }
                return true;
            }
        });
        return Field;
    });
