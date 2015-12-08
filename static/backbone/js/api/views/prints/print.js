define(["jquery",
        "marionette",
        "underscore",
        "text!" + templateDir + "/prints/print.html",
        "views/prints/printForm",
        "views/prints/printMockup",
        "views/maps/sidepanel/shareModal/confirmation",
        "backbone-bootstrap-modal"

    ],
    function ($, Marionette, _, print, PrintForm, PrintMockup, Confirmation) {
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
                printMockupRegion: "#print-mockup-container"
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
                var printMockup = this.printMockupRegion.currentView,
                    printForm = this.printFormRegion.currentView;
                if (printMockup) {
                    printMockup.resizeMap();
                }
            },

            generatePrint: function () {
                var formData = _.extend(this.form.getFormData(), this.mockup.getFormData());
                if (!formData.map_title) {
                    Confirmation.confirm({
                        message: 'Are you sure you want to create a print with no title?',
                        callback: _.partial(this.requestPrint, formData)
                    });
                } else {
                    this.requestPrint(formData);
                }
            },

            requestPrint: function (formData) {
                $.post('/maps/print/new/', formData, function (printUrl) {
                    document.location = printUrl;
                }).fail(function (err) {
                    console.error('failed to download print pdf: ' + err);
                });
            }

        });
        return Print;
    });