define(["marionette",
        "handlebars",
        "text!../../templates/right/source-code-style.html"
    ],
    function (Marionette, Handlebars, SourceCodeStyleTemplate) {
        'use strict';

        var MarkerStyleView = Marionette.CompositeView.extend({
            template: Handlebars.compile(SourceCodeStyleTemplate),
            hasChanged: false,
            initialize: function (opts) {
                _.extend(this, opts);
            },

            events: {
                'blur .source-code': 'updateModel',
                'input .source-code': 'trackChanges',
                'propertychange .source-code': 'trackChanges',
                'paste .source-code': 'trackChanges'
            },

            modelEvents: {
                'rebuild-markers': 'render'
            },

            templateHelpers: function () {
                return {
                    symbols: JSON.stringify(this.model.getSymbolsJSON(), null, 3)
                };
            },

            trackChanges: function () {
                console.log("source code has changed");
                // for efficiency: will only apply "updatedModel" code if
                // something has actually changed in the textbox:
                this.hasChanged = true;
            },

            resetTracking: function () {
                this.hasChanged = false;
            },

            onShow: function () {
                this.render();
            },

            updateModel: function () {
                console.log('updateModel: sourceCode', this.$el.find(".source-code").val());
                // if nothing has changed, exit this function
                if (!this.hasChanged) {
                    return;
                }
                // if something has changed, rebuild the symbols and redraw the map:
                var sourceCode;
                try {
                    sourceCode = JSON.parse(this.$el.find(".source-code").val());
                } catch (e1) {
                    alert('Invalid JSON. Please revert and try again.');
                    return;
                }
                try {
                    this.model.set("symbols", sourceCode);
                    this.model.trigger('rebuild-markers');
                } catch (e2) {
                    alert('Invalid icon shape specified. Please revert and try again.');
                }
                // reset hasChanged flag:
                this.resetTracking();
            }

        });
        return MarkerStyleView;
    });