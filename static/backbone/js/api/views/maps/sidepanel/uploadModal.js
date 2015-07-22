define(["marionette",
        "underscore",
        "text!" + templateDir + "/modals/uploadModal.html",
    ],
    function (Marionette, _, uploadModal) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * share Snapshot modal
         * @class DataPanel
         */

        var UploadModal = Marionette.ItemView.extend({
            id: 'upload-modal-wrapper',
            template: function (data) {
                return _.template(uploadModal, data);
            },

            events: {
                'click .dismiss-modal': 'cleanUp',
            },

            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.url = opts.url;
            },
            serializeData: function(){
                return {
                  urlRoot: location.origin,
                  url: this.url
                };
            },

            cleanUp: function () {
                this.app.vent.trigger('refresh-collections');
            },

            showModal: function () {
                this.$el.find('#upload-modal').modal();
            }



        });
        return UploadModal;
    });


