define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "models/layer",
    "text!../../templates/left/create-layer-form.html"],
    function ($, _, Marionette, Handlebars, Layer, NewLayerModalTemplate) {
        'use strict';

        var NewLayer = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(NewLayerModalTemplate);
            },

            events: {
                "click input[type=radio]": "toggleCheckboxes"
            },

            toggleCheckboxes: function (e) {
                var $cb = this.$el.find('#dataset-list');
                if (e.target.id === 'layer-new-dataset') {
                    $cb.attr("disabled", "disabled");
                } else {
                    $cb.removeAttr("disabled");
                }
            },

            templateHelpers: function () {
                return {
                    datasets: this.app.dataManager.getDatasets()
                };
            },

            saveLayer: function() {
                const map = this.app.dataManager.getMap();
                const layer_title = this.$el.find('#layer-title').val();
                const dataset = this.$el.find('#dataset-list').val();
                let layer = new Layer({
                    map_id: map.id,
                    title: layer_title
                });
                if (this.$el.find('#layer-new-dataset').prop('checked')) {
                    layer.set('create_new_dataset', 'True');
                } else {
                    layer.set('dataset', dataset)
                }
                layer.save(null, {
                    dataType:"text",
                    success: (model, response) => {
                        //apply additional server-generated data to model:
                        layer.set(JSON.parse(response));
                        map.get('layers').add(layer);
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
