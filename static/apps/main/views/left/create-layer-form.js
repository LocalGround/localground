define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "text!../../templates/left/create-layer-form.html"],
    function ($, _, Marionette, Handlebars, NewLayerModalTemplate) {
        'use strict';

        var NewLayer = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(NewLayerModalTemplate);
                this.datasets = this.app.dataManager.getDatasets();
                console.log(this.datasets[0].formID)
                this.formData = {
                    title: 'Untitled Layer',
                    create_new_dataset: '',
                    dataset: this.datasets[0].formID,
                    datasets: this.datasets
                };
            },
            errors: {},
            templateHelpers: function () {
                this.formData.errors = this.errors;
                return this.formData;
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

            onShow: function () {
                setTimeout(() => {
                    this.$el.find('#layer-title').focus().select();
                }, 50);
            },

            setTitle: function () {
                this.formData.title = this.$el.find("#layer-title").val();
                if (this.formData.title.length > 0) {
                    this.model.set("title", this.formData.title);
                } else {
                    this.errors.title = "A valid layer name is required";
                }
            },
            setDataset: function () {
                this.formData.create_new_dataset = this.$el.find('#layer-new-dataset').prop('checked') ? "checked" : "";
                if (this.formData.create_new_dataset === 'checked') {
                    this.formData.dataset = null;
                    this.model.set("create_new_dataset", true);
                    this.model.set('dataset', null);
                } else {
                    this.formData.dataset = this.$el.find('#dataset-list').val();
                    this.model.set("create_new_dataset", false);
                    this.model.set('dataset', this.formData.dataset);
                }
            },

            applyChanges: function () {
                this.errors = {};
                this.setTitle();
                this.setDataset();
            },

            saveLayer: function() {
                var that = this;
                this.applyChanges();
                if (Object.keys(this.errors).length > 0) {
                    this.render();
                    return;
                }
                this.model.save(null, {
                    dataType:"text",
                    success: (model, response) => {
                        //apply additional server-generated data to model:
                        this.model.set(JSON.parse(response));
                        this.app.dataManager.addLayerToMap(this.map, this.model);
                        this.app.vent.trigger('close-modal');
                    },
                    error: (model, response) => {
                        //TODO: more robust error handling for server-side errors:
                        console.error(response.responseText);
                    }
                });
            }
        });
        return NewLayer;

    }
);
