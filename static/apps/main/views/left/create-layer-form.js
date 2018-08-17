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
                this.formData = {
                    title: this.getDefaultLayerTitle(),
                    create_new_dataset: '',
                    dataset: this.datasets[0].formID,
                    datasets: this.datasets.map(dataset => {
                        return {
                            id: dataset.getDatasetID(),
                            title: dataset.getDatasetName()
                        }
                    })
                };
            },
            events: {
                "click input[type=radio]": "toggleCheckboxes"
            },
            errors: {},
            templateHelpers: function () {
                this.formData.errors = this.errors;
                return this.formData;
            },

            getDefaultLayerTitle: function () {
                const layers = this.map.get('layers');
                try {
                    const matchedTitles = layers.map(layer => {
                        return layer.get('title');
                    }).filter(title => {
                        return /Untitled\sLayer\s*\d*/g.test(title);
                    });
                    const maxNumber = matchedTitles.map(title => {
                        const a = /\d+/g.exec(title);
                        return (a && a.length > 0) ? parseInt(a[0]) : 0;
                    }).reduce((a, b) => {
                        return Math.max(a, b);
                    });
                    return 'Untitled Layer ' + (maxNumber + 1);
                } catch (e) {
                    return 'Untitled Layer 1'
                }
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
                    this.formData.dataset = parseInt(this.$el.find('#dataset-list').val());
                    this.model.set("create_new_dataset", false);
                    this.model.set('dataset', this.formData.dataset);
                }
            },

            applyChanges: function () {
                this.errors = {};
                this.setTitle();
                this.setDataset();
            },

            saveLayer: function () {
                var that = this;
                this.applyChanges();
                if (Object.keys(this.errors).length > 0) {
                    this.render();
                    return;
                }
                this.model.save(null, {
                    dataType:"text",
                    success: this.handleSuccess.bind(this),
                    error: (model, response) => {
                        console.error(response.responseText);
                    }
                });
            },

            handleSuccess: function (model, response) {
                // apply additional server-generated data to model:
                this.model.set(JSON.parse(response));
                this.app.dataManager.addLayerToMap(this.map, this.model);
                this.app.vent.trigger('close-modal');
                this.app.vent.trigger('new-layer-added', this.model);
            }
        });
        return NewLayer;

    }
);
