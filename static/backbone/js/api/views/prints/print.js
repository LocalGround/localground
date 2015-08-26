define(["jquery",
        "marionette",
        "underscore",
        "text!" + templateDir + "/prints/print.html",
        "views/prints/printForm",
        "views/prints/printMockup",
        "backbone-bootstrap-modal"
    ],
    function ($, Marionette, _, print, PrintForm, PrintMockup) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * print data modal
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

            },

            onShow: function() {
                this.printFormRegion.show(new PrintForm(_.defaults({controller: this}, this.opts)));
                this.printMockupRegion.show(new PrintMockup(_.defaults({controller: this}, this.opts)));
            }



        });
        return Print;
    });