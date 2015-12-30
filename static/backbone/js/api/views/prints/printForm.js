define(["marionette",
        "underscore",
        "text!" + templateDir + "/prints/printForm.html"
    ],
    function (Marionette, _, printFormTemplate) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * print form
         * @class PrintForm
         */
        var PrintForm = Marionette.CompositeView.extend({
            /**
             * @lends localground.maps.views.PrintForm#
             */
            template: function () {
                return _.template(printFormTemplate);
            },

            tagName: 'div',
            id: 'print-form',
            events: {
                'click .layout-control': 'changeLayout',
                'click .btn-close': 'changeLayout',
                'click #submit': 'generatePrint'
            },

            ui: {
                layoutSelection: '.layout-control'
            },

            /**
             * Initializes the printForm
             * @param {Object} opts
             */
            initialize: function (opts) {
                this.app = opts.app;
                this.controller = opts.controller;
                this.opts = opts;
            },

            changeLayout: function (e) {
                var choice = e.target.value;
                this.controller.trigger('change-layout', choice);
            },

            generatePrint: function () {
                this.controller.trigger('generatePrint');
            },

            getFormData: function () {
                var layout_lookup = {'landscape': 1, 'portrait': 2};
                return {
                    layout: layout_lookup[this.ui.layoutSelection.filter(':checked').val()],
                    project_id: this.app.getActiveProjectID()
                };
            }

        });
        return PrintForm;
    });