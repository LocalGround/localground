define(["jquery",
        "marionette",
        "backbone",
        "underscore",
        "text!" + templateDir + "/prints/print.html",
        "views/prints/printForm",
        "views/prints/printMockup",
        "backbone-bootstrap-modal"
    ],
    function ($, Marionette, Backbone, _, print, PrintForm, PrintMockup) {
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

            onShow: function() {
                this.form = new PrintForm(_.defaults({controller: this}, this.opts));
                this.mockup = new PrintMockup(_.defaults({controller: this}, this.opts));


                this.printFormRegion.show(this.form);
                this.printMockupRegion.show(this.mockup);
            },

            resize: function () {
                var printMockup = this.printMockupRegion.currentView;
                if(printMockup) {
                    printMockup.resizeMap();
                }
            },

            generatePrint: function () {
                var formData = _.extend(this.form.getFormData(), this.mockup.getFormData());

                $.post('/maps/print/new/',
                    formData,
                    function () {
                            debugger;
                    }
                ).fail(function () {
                    debugger;
                });
            }



        });
        return Print;
    });