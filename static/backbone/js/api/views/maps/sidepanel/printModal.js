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
                modal: '#print-modal',
                modalBody: '#print-modal-body'
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
                this.ui.modal.on('shown.bs.modal', this.resize.bind(this));
            },

            showModal: function () {
                this.ui.modal.modal();
            },

            resize: function () {
                this.printRegion.currentView.trigger('resize');
            }



        });
        return PrintModal;
    });


