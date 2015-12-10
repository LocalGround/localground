define(["marionette",
        "underscore",
        "text!" + templateDir + "/prints/printMockup.html"
    ],
    function (Marionette, _, printConfirmationTemplate) {
        'use strict';
        var PrintConfirmation = Marionette.View.extend({
            initialize: function (opts) {
                this.response = opts.response;
            },
            template: function () {
                return _.template(printConfirmationTemplate);
            },
            onShow: function () {
                this.$el.html(JSON.stringify(this.response));
            }
        });
        return PrintConfirmation;
    });