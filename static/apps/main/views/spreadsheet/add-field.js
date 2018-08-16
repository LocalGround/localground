define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "models/field",
    "apps/main/views/spreadsheet/choice-mixin",
    "text!../../templates/spreadsheet/add-field.html"
],
    function ($, _, Marionette, Handlebars, Field, ChoiceMixin, AddFieldTemplate) {
        'use strict';
        /**
         * model --> Field
         * layer --> current layer (dataset accessible from layer)
         */
        var AddFieldView = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.model = new Field({
                    ordering: this.ordering,
                    extras: {
                        choices: []
                    },
                    integer_mode: true, //not persisted to DB, but for convenience
                    data_type: 'text'
                 }, {
                     id: this.dataset.formID
                 });
                this.template = Handlebars.compile(AddFieldTemplate);
            },
            events: {
                'change #data_type': 'showDetailedOptions',
                'click .add-new-choice': 'addChoice',
                'click .remove-choice': 'removeChoice'
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
            onRender: function () {
                //make choices re-orderable:
                if (this.getMenuSelection() === 'choice') {
                    this.makeChoicesSortable();
                }
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
                    console.log(integerMode, dataType);
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
                this.setChoices();
            },
            showDetailedOptions: function (e) {
                console.log('showDetailedOptions');
                if (e) { e.preventDefault(); }
                this.commitData();
                this.render();
            },
            // addChoice: function (e) {
            //     if (e) { e.preventDefault(); }
            //     this.commitData();
            //     this.model.get('extras').choices.push({'name': ''});
            //     this.render();
            //
            // },
            // removeChoice: function (e) {
            //     if (e) { e.preventDefault(); }
            //     $(e.target).parent().parent().remove();
            //     this.commitData();
            //     this.render();
            // },
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
                const data_type = this.model.get('data_type');
                if (!['text', 'integer', 'decimal', 'boolean', 'choice', 'date-time'].includes(data_type)) {
                    this.data_type_error = "A valid data type is required";
                    this.render();
                    return false;
                }
                return true;
            },
            // _validateChoices: function () {
            //     const data_type = this.model.get('data_type');
            //     if (data_type === 'choice' && this.model.get('extras').choices.length === 0) {
            //         this.data_type_error = "At least one choice is required";
            //         this.render();
            //         return false;
            //     }
            //     return true;
            // },
            saveField: function () {
                this.commitData();
                this._clearErrorMessages();
                if (!this._validateColAlias() || !this._validateColType() || !this._validateChoices()) {
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
        _.extend(AddFieldView.prototype, ChoiceMixin);
        return AddFieldView;

    });
