define(["jquery",
        "marionette",
        "underscore",
        "text!" + templateDir + "/prints/print.html",
        "views/prints/printForm",
        "views/prints/printMockup",
        "views/prints/printConfirmation",
        "backbone-bootstrap-modal"

    ],
    function ($, Marionette, _, print, PrintForm, PrintMockup, PrintConfirmation) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * print view
         * @class UploadModal
         */

        var Print = Marionette.LayoutView.extend({
            id: 'print',
            template: function (data) {
                return _.template(print, data);
            },
            regions: {
                printFormRegion: "#print-form-container",
                printMockupRegion: "#print-mockup-container",
                printConfirmationRegion: "#print-confirmation-container"
            },
            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.on('resize', this.resize.bind(this));
                this.on('generatePrint', this.generatePrint.bind(this));
            },

            onShow: function () {
                this.form = new PrintForm(_.defaults({controller: this}, this.opts));
                this.mockup = new PrintMockup(_.defaults({controller: this}, this.opts));
                this.printFormRegion.show(this.form);
                this.printMockupRegion.show(this.mockup);
            },

            resize: function () {
                var printMockup = this.printMockupRegion.currentView;
                if (printMockup) {
                    printMockup.resizeMap();
                }
            },

            generatePrint: function () {
                var formData = _.extend(this.form.getFormData(), this.mockup.getFormData());
                this.requestPrint(formData);
            },

            printGenerated: function (response) {
                this.confirmation = new PrintConfirmation({ response: response });
                this.printConfirmationRegion.show(this.confirmation);
                this.printFormRegion.$el.hide();
                this.printMockupRegion.$el.hide();
            },

            requestPrint: function (formData) {
                var that = this;
                $.post('/maps/print/new/', formData, function (response) {
                    that.printGenerated(response);
                }).fail(function (err) {
                    console.error('failed to download print pdf: ' + err);
                });
            }

        });
        return Print;
    });