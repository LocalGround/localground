define(["handsontable"], function (Handsontable)  {
    'use strict';
    const CustomCellRenderers = {
        registerBooleanSelectMenuEditor: function () {
            // following this tutorial: https://docs.handsontable.com/0.15.0-beta1/tutorial-cell-editor.html
            const BooleanSelectMenuEditor = Handsontable.editors.SelectEditor.prototype.extend();
            const that = this;

            BooleanSelectMenuEditor.prototype.prepare = function () {
                const me = this;
                Handsontable.editors.SelectEditor.prototype.prepare.apply(this, arguments);
                $(this.select).empty();
                this.cellProperties.selectOptions.forEach(option => {
                    const optionElement = document.createElement('OPTION');
                    optionElement.value = option.val;
                    optionElement.innerHTML = option.label;
                    if (option.value == this.originalValue) {
                        optionElement.selected = true;
                    }
                    this.select.appendChild(optionElement);
                });
            };
            BooleanSelectMenuEditor.prototype.getValue = function () {
                if (this.select.value === "true") {
                    return true;
                } else if (this.select.value === "false") {
                    return false;
                }
                return "";
            };
            Handsontable.editors.registerEditor('boolean-select-menu-editor', BooleanSelectMenuEditor);
        },

        ratingRenderer: function (instance, td, row, col, prop, value, cellProperties) {
            var that = this,
                model = this.getModelFromCell(instance, row),
                idx = col - 3,
                field = this.fields.getModelByAttribute('col_name', prop),
                extras = field.get("extras") || [],
                intVal = model.get(prop),
                textVal = null,
                i;
            for (i = 0; i < extras.length; i++){
                if (extras[i].value == intVal){
                    textVal = extras[i].value + ": " + extras[i].name;
                    break;
                }
            }
            td.innerHTML = textVal;
            return td;
        },

        booleanRenderer: function (instance, td, row, col, prop, value, cellProperties) {
            const model = this.getModelFromCell(instance, row);
            const val = model.get(prop);
            if (val === true) {
                td.innerHTML = 'Yes'
            } else if (val === false) {
                td.innerHTML =  'No'
            } else {
                td.innerHTML = 'No value';
            }
            return td;
        }
    };
    return CustomCellRenderers;
});
