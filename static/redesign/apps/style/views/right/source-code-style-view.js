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
            modelEvents: {
                'change:symbols': 'render'
            },

            templateHelpers: function () {
                return {
                    symbols: JSON.stringify(this.model.getSymbolsJSON(), null, 3)
                };
            },

            events: {
                'blur .source-code': 'updateModel'
            },

            onShow: function () {
                console.log('showing');
                this.render();
            },

            updateModel: function () {
                console.log("update model");
                var sourceCode;
                try {
                    sourceCode = JSON.parse(this.$el.find(".source-code").val());
                } catch (e1) {
                    alert('Invalid JSON. Please revert and try again.');
                    return;
                }
                try {
                    this.model.set("symbols", sourceCode);
                    console.log("source code", sourceCode);
                    console.log(this.model.get("symbols"));
                } catch (e2) {
                    alert('Invalid icon shape specified. Please revert and try again.');
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