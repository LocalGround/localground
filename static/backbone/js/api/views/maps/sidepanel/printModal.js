define(["jquery",
        "marionette",
        "underscore",
        "text!" + templateDir + "/modals/printModal.html",
        "views/prints/print",
        "backbone-bootstrap-modal"
    ],
    function ($, Marionette, _, printModal, Print) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * print data modal
         * @class UploadModal
         */

        var PrintModal = Marionette.LayoutView.extend({
            id: 'print-modal-wrapper',
            template: function (data) {
                return _.template(printModal, data);
            },
            ui: {
                modal: '#print-modal'
            },
            regions: {
                printRegion: "#print-container",
            },
            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;

            },

            onShow: function() {
                this.printRegion.show(new Print(this.opts));
            },

            showModal: function () {
                this.ui.modal.modal();
            }



        });
        return PrintModal;
    });


