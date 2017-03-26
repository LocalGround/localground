define(["marionette",
        "handlebars",
        "text!../../templates/right/source-code-style.html"
    ],
    function (Marionette, Handlebars, SourceCodeStyleTemplate) {
        'use strict';

        var MarkerStyleView = Marionette.CompositeView.extend({
            template: Handlebars.compile(SourceCodeStyleTemplate),

            initialize: function (opts) {
                _.extend(this, opts);
            },

            templateHelpers: function () {
                return {
                    symbols: JSON.stringify(this.model.get("symbols"), null, 3)
                };
            },

            events: {
                'blur .source-code': 'updateModel'
            },

            updateModel: function () {
                try {
                    var sourceCode = JSON.parse(this.$el.find(".source-code").val());
                    this.model.set("symbols", sourceCode);
                } catch (e) {
                    alert('Invalid JSON. Please revert and try again.');
                }
            },

            selectDataType: function () {
                this.dataType = this.$el.find("#data-type-select").val();
                this.render();
            },

            displaySymbols: function () {
                this.collection = new Marionette.Collection(this.model.get("symbols"));
                this.render();
            }

        });
        return MarkerStyleView;
    });