define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "models/field",
    "text!../../templates/spreadsheet/add-field.html"
],
    function ($, _, Marionette, Handlebars, Field, AddFieldTemplate) {
        'use strict';
        /**
         * model --> Field
         * layer --> current layer (dataset accessible from layer)
         */
        var AddFieldView = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.model = new Field(
                    { ordering: this.ordering },
                    { id: this.dataset.formID }
                );
                this.template = Handlebars.compile(AddFieldTemplate);
            },
            data_type_error: null,
            col_alias_error: null,
            templateHelpers: function () {
                var helpers = {
                    data_type_error: this.data_type_error,
                    col_alias_error: this.col_alias_error
                };
                return helpers;
            },
            _clearErrorMessages: function () {
                this.data_type_error = null;
                this.col_alias_error = null;
            },
            _validateColAlias: function () {
                const col_alias = this.$el.find('#col_alias').val();
                if (col_alias.length > 0) {
                    this.model.set('col_alias', col_alias);
                } else {
                    this.col_alias_error = "A valid column name is required";
                    this.render();
                    return false;
                }
                return true;
            },
            _validateColType: function () {
                const data_type = this.$el.find('#data_type').val();

                if (['text', 'integer', 'boolean', 'choice', 'date-time'].includes(data_type)) {
                    this.model.set('data_type', data_type);
                } else {
                    this.data_type_error = "A valid data type is required";
                    this.render();
                    return false;
                }
                return true;
            },
            saveField: function () {
                this._clearErrorMessages();
                if (!this._validateColAlias() || !this._validateColType()) {
                    return;
                }
                this.app.dataManager.addFieldToCollection(
                    this.dataset, this.model, this.afterSave.bind(this)
                );
            },
            afterSave: function () {
                this.sourceModal.hide();
            }
        });
        return AddFieldView;

    });
