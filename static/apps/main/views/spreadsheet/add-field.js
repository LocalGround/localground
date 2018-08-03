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
            events: {
                'change #data_type': 'showDetailedOptions',
                'click .add-new-choice': 'addChoice',
                'click .remove-choice': 'removeChoice'
            },
            initialize: function (opts) {
                _.extend(this, opts);
                this.model = new Field({
                    ordering: this.ordering,
                    extras: {
                        choices: [{ name: '' }]
                    },
                    integer_mode: true, //not persisted to DB, but for convenience
                    data_type: 'text'
                 }, {
                     id: this.dataset.formID
                 });
                this.template = Handlebars.compile(AddFieldTemplate);
            },
            data_type_error: null,
            col_alias_error: null,
            templateHelpers: function () {
                return {
                    data_type_error: this.data_type_error,
                    col_alias_error: this.col_alias_error,
                    extras: this.model.get('extras'),
                    menuSelection: this.getMenuSelection()
                };
            },
            getMenuSelection: function () {
                const selection = this.model.get('data_type');
                if (selection === 'integer' || selection === 'decimal') {
                    return 'number';
                }
                return selection;
            },
            setDataType: function () {
                let dataType = this.$el.find('#data_type').val();
                if (dataType === 'number') {
                    const integerMode = this.$el.find('#number_type').prop('checked');
                    this.model.set('integer_mode', integerMode);
                    dataType = integerMode ? 'integer' : 'decimal';
                }
                this.model.set('data_type', dataType);
            },
            commitData: function () {
                // Note: doesn't save, but applies the data to the model:

                // 1. save name:
                this.model.set('col_alias', this.$el.find('#col_alias').val());

                // 2. save data_type:
                this.setDataType();

                // 3. save extras:
                const choices = [];
                this.$el.find('.choice').each(function () {
                    choices.push({
                        'name': $(this).val()
                    });
                });
                this.model.get('extras').choices = choices;
            },
            showDetailedOptions: function (e) {
                if (e) { e.preventDefault(); }
                this.commitData();
                this.render();
                // this.setDataType();
                // this.$el.find('.numbers, .choices').hide();
                // switch (this.model.get('data_type')) {
                //     case 'integer':
                //     case 'decimal':
                //         this.$el.find('.row.numbers').show();
                //         break;
                //     case 'choice':
                //         this.$el.find('.row.choices').show();
                //         break;
                // }
            },
            addChoice: function (e) {
                if (e) { e.preventDefault(); }
                this.commitData();
                this.model.get('extras').choices.push({'name': ''});
                this.render();

            },
            removeChoice: function (e) {
                if (e) { e.preventDefault(); }
                $(e.target).parent().parent().remove();
                this.commitData();
                this.render();
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
                this.commitData();
                this._clearErrorMessages();
                if (!this._validateColAlias() || !this._validateColType()) {
                    return;
                }
                return;
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
