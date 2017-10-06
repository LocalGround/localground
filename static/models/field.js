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
                this.set('temp_id', parseInt(Math.random(10) * 10000000).toString());
                if (this.get("field")) {
                    this.url = this.urlRoot() + this.get("field") + "/";
                }
                Base.prototype.initialize.apply(this, arguments);
            },
            validate: function (attrs, options) {
                this.errorFieldName = this.errorFieldType = false;
                this.serverErrorMessage = null;
                this.set("errorFieldName", false);
                this.set("errorFieldType", false);
                this.set("errorRatingName", false);
                this.set("errorRatingValue", false);

                if (attrs.col_alias.trim() === "") {
                    this.set("errorFieldName", true);
                    return "Cannot have empty field name."
                }
                if (attrs.data_type === "-1") {
                    this.set("errorFieldType", true);
                    return "Need to select a data type."
                }
                if (!this.validateRating(attrs)) {
                    return "Both rating name and value must be filled."
                }
                if (!this.validateChoice(attrs)) {
                    return "Need to pick name for all choices."
                }
            },

            validateRating: function (attrs) {
                // No need to check if incorrect type
                if (attrs.data_type !== "rating") return true;
                if (attrs.extras.length === 0 || !attrs.extras) return false;
                for (var i = 0; i < attrs.extras.length; ++i) {
                    if (attrs.extras[i].name.trim() === "") {
                        this.set("errorRatingName", true);
                        return false;
                    }
                    if (isNaN(parseInt(attrs.extras[i].value))){
                        this.set("errorRatingValue", true);
                        return false;
                    }
                }
                return true;
            },

            validateChoice: function (attrs) {
                // No need to check if incorrect type
                if (attrs.data_type !== "choice") return true;
                if (attrs.extras.length === 0 || !attrs.extras) return false;
                for (var i = 0; i < attrs.extras.length; ++i) {
                    if (attrs.extras[i].name.trim() === "") {
                        this.set("errorRatingName", true);
                        return false;
                    }
                }
                return true;
            }
        });
        return Field;
    });
