define(["jquery",
        "marionette",
        "underscore",
        "text!" + templateDir + "/modals/uploadModal.html",
        "backbone-bootstrap-modal"
    ],
    function ($, Marionette, _, uploadModal) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * upload data modal
         * @class UploadModal
         */

        var UploadModal = Marionette.ItemView.extend({
            id: 'upload-modal-wrapper',
            template: function (data) {
                return _.template(uploadModal, data);
            },
            ui: {
                modal: '#upload-modal'
            },
            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.url = opts.url;
            },

            onRender: function () {
                this.ui.modal.on('hidden.bs.modal', this.cleanUp.bind(this));
            },

            serializeData: function () {
                return {
                    urlRoot: window.location.origin,
                    url: this.url + '?project_id=' + this.app.activeProjectID
                };
            },

            cleanUp: function () {
                this.app.vent.trigger('refresh-collections');
            },

            showModal: function () {
                this.ui.modal.modal();
                var iframe = this.$el.find('iframe')[0],
                    $projectSelect = $(iframe.contentDocument.getElementById('project'));
                $projectSelect.val(this.app.activeProjectID);
            }
        });
        return UploadModal;
    });


