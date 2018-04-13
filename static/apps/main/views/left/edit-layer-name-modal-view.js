define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "models/layer",
    "text!../../templates/left/edit-layer-name-modal.html",],
    function ($, _, Marionette, Handlebars, Layer, EditLayerModalTemplate) {
        'use strict';

        var NewLayer = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(EditLayerModalTemplate);
            },

            events: {
                "click #layer-new-dataset": "toggleCheckboxes",
                "click #layer-existing-datasets": "toggleCheckboxes"
            },
            
            slugError: null,
            templateHelpers: function () {
                var name;


                var helpers = {
                    slugError: this.slugError,
                    generalError: this.generalError
                };
                return helpers;
            },

            saveLayer: function() {
                console.log('new layer modal, save!', this);
                const layer_title = this.$el.find('#layer-title').val();
                this.model.set('title', layer_title);

                this.model.save(null, {
                    dataType:"text",
                    success: () => {
                        this.app.vent.trigger('close-modal');
                    },
                    error: (model, response) => {
                        var messages = response.responseText;
                        if (messages.slug && messages.slug.length > 0) {
                            this.slugError = messages.slug[0];
                        }
                        this.updateModal(response);
                    }
                });

            },

            updateModal: function (errorMessage) {
                if (errorMessage.status == '400') {
                    var messages = JSON.parse(errorMessage.responseText);
                    this.slugError = messages.slug[0];
                    this.generalError = null;
                } else {
                    this.generalError = "Save Unsuccessful. Unspecified Server Error. Consider changing layer title";
                    this.slugError = null;
                }
                this.render();
            }
        });
        return NewLayer;

    }
);
