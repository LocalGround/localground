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
            //id: 'print',
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
                this.on('makeAnotherPrint', this.showMap.bind(this));
                this.on('generatePrint', this.generatePrint.bind(this));
            },

            onShow: function () {
                this.form = new PrintForm(_.defaults({controller: this}, this.opts));
                this.mockup = new PrintMockup(_.defaults({controller: this}, this.opts));
                this.confirmation = new PrintConfirmation({ controller: this }, this.opts);
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
                this.showPrintRequestScreen();
                var formData = _.extend(this.form.getFormData(), this.mockup.getFormData());
                this.requestPrint(formData);
            },

            requestPrint: function (formData) {
                var that = this;
                $.post('/api/0/prints/', formData, function (response) {
                //$.post('/maps/print/', formData, function (response) {
                    that.printGenerated(response);
                }, "json").fail(function (err) {
                    console.error('failed to download print pdf: ' + err);
                });
            },

            showPrintRequestScreen: function () {
                this.confirmation.showRequestingScreen();
                this.printConfirmationRegion.$el.show();
                this.printConfirmationRegion.show(this.confirmation);
                this.printFormRegion.$el.hide();
                this.printMockupRegion.$el.hide();
            },

            showMap: function () {
                this.printConfirmationRegion.$el.hide(); //in case it's hidden from the makeAnotherPrint
                this.printFormRegion.$el.show();
                this.printMockupRegion.$el.show();
                var printMockup = this.printMockupRegion.currentView;
                if (printMockup) {
                    printMockup.resizeMap();
                }
            },

            printGenerated: function (response) {
                this.confirmation.response = response;
                this.confirmation.render();
            }

        });
        return Print;
    });