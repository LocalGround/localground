define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "text!../../templates/left/new-map-modal.html"],
    function ($, _, Marionette, Handlebars, CreateMapFormTemplate) {
        'use strict';

        var CreateMapForm = Marionette.ItemView.extend({
            errors: {},
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(CreateMapFormTemplate);

                const datasets = this.app.dataManager.getDatasets();
                this.formData = {
                    name: 'Untitled Map',
                    description: '',
                    create: '',
                    existing: 'checked',
                    datasets: datasets.map(dataset => {
                        dataset.checked = 'checked';
                        return dataset;
                    })
                };
            },

            events: {
                "click #new-dataset": "toggleCheckboxes",
                "click #existing-datasets": "toggleCheckboxes"
            },

            toggleCheckboxes: function (e) {
                this.$el.find('#existing-datasets').parent().removeClass('error');
                var $cb = this.$el.find('.checkbox-list');
                if (e.target.id === 'new-dataset') {
                    $cb.hide();
                } else {
                    $cb.show();
                }
            },
            templateHelpers: function () {
                this.formData.errors = this.errors;
                return this.formData;
            },

            applyChanges: function () {
                this.errors = {};
                this.formData.name = this.$el.find("#map-name").val();
                this.formData.description = this.$el.find("#map-description").val();
                this.formData.create = this.$el.find('#new-dataset').prop('checked') ? "checked" : "";
                this.formData.existing = this.formData.create ? "" : "checked";
                console.log(this.formData);
                //validate name:
                if (this.formData.name.length > 0) {
                    this.model.set("name", this.formData.name);
                } else {
                    this.errors.name = "A valid map name is required";
                }

                // validate dataset selection: either create one or select existing one
                if (this.formData.create === 'checked') {
                    this.model.set("create_new_dataset", true);
                } else {
                    const data_sources = []
                    this.formData.datasets.forEach(dataset => {
                        if (dataset.dataType === this.value) {
                            this.checked = '';
                        }
                    });
                    var that = this;
                    this.$el.find('input[type="checkbox"]').each(function() {
                        if ($(this).prop('checked')) {
                            data_sources.push(this.value);
                            that.formData.datasets.forEach(dataset => {
                                if (dataset.dataType === this.value) {
                                    this.checked = 'checked';
                                }
                            })
                        }
                    });
                    if (data_sources.length === 0) {
                        this.errors.datasets =  'Please select at least one data source';
                    } else {
                        this.model.set("data_sources", JSON.stringify(data_sources));
                    }
                }

                // no description validation necessary:
                this.model.set("description", this.formData.description);
            },

            saveMap: function () {
                this.applyChanges()
                if (!_.isEmpty(this.errors)) {
                    this.render();
                    return;
                }
                this.model.save(null, {
                    success: this.displayMap.bind(this),
                    failure: this.handleServerError.bind(this)
                });
            },
            displayMap: function () {
                this.app.dataManager.addMap(this.model);
                this.app.vent.trigger('close-modal');
                this.app.router.navigate('//' + this.model.id);
            },

            handleServerError: function (errorMessage) {
                //TODO: Fix this
                if (errorMessage.status == '400') {
                    var messages = JSON.parse(errorMessage.responseText);
                    this.slugError = messages.slug[0];
                    this.generalError = null;
                } else {
                    this.generalError = "Save Unsuccessful. Unspecified Server Error. Consider changing Map Title or Friendly Url";
                    this.slugError = null;
                }
                this.render();
            }
        });
        return CreateMapForm;

    }
);
