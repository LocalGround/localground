define(["marionette",
        "underscore",
        "text!" + templateDir + "/prints/printConfirmation.html"
    ],
    function (Marionette, _, printConfirmationTemplate) {
        'use strict';
        var PrintConfirmation = Marionette.View.extend({
            events: {
                'click #make-another-map': 'makeAnotherPrint'
            },
            initialize: function (opts) {
                _.extend(this, opts);
                this.response = this.response || {};
                this.template = _.template(printConfirmationTemplate);
            },
            onShow: function () {
                this.$el.show();
                this.$el.html(this.template({ data: this.response }));
            },
            showRequestingScreen: function () {
                this.$el.show();
                this.$el.html(this.template({ data: {} }));
            },
            render: function () {
                this.$el.html(this.template({ data: this.response }));
            },
            makeAnotherPrint: function () {
                this.controller.trigger('makeAnotherPrint');
            }
        });
        return PrintConfirmation;
    });