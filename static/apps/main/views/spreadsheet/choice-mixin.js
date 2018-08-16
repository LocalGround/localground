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
        return {
            makeChoicesSortable: function () {
                //make choices re-orderable:
                this.$el.find('.row.choices').sortable({
                    items : 'tr'
                }).disableSelection();
            },
            setChoices: function () {
                const choices = [];
                // if (!this.$el.find('.choice')[0]) {
                //     return;
                // }
                this.$el.find('.choice').each(function () {
                    choices.push({
                        'name': $(this).val()
                    });
                });
                this.model.get('extras').choices = choices;
            },
            addChoice: function (e) {
                if (e) { e.preventDefault(); }
                this.commitData();
                this.model.get('extras').choices.push({'name': ''});
                this.render();

            },
            removeChoice: function (e) {
                console.log('removeChoice');
                if (e) { e.preventDefault(); }
                const $parent = $(e.target).parent().parent();
                console.log($parent);
                $parent.remove();
                this.commitData(); //from parent
                this.render();
            },
            _validateChoices: function () {
                const extras = this.model.get('extras') || {};
                const choices = extras.choices || [];
                const data_type = this.model.get('data_type');
                if (data_type === 'choice' && choices.length === 0) {
                    this.data_type_error = "At least one choice is required";
                    this.render();
                    return false;
                }
                return true;
            }
        };

    });
