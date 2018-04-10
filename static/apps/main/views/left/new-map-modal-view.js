define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "text!../../templates/left/new-map-modal.html"],
    function ($, _, Marionette, Handlebars, CreateMapFormTemplate) {
        'use strict';

        var CreateMapForm = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(CreateMapFormTemplate);
            },

            events: {
                "click #new-dataset": "toggleCheckboxes",
                "click #existing-datasets": "toggleCheckboxes"
            },
            toggleCheckboxes: function (e) {
                var $cb = this.$el.find('.checkbox-list');
                if (e.target.id === 'new-dataset') {
                    $cb.hide();
                } else {
                    $cb.show();
                }
            },
            templateHelpers: function () {
                var helpers = {
                    name: 'Untitled Map',
                    datasets: this.app.dataManager.getDatasets()
                };
                return helpers;
            },

            saveMap: function () {
                this.model.set("name", this.$el.find("#map-name").val());
                this.model.set("description",
                    this.$el.find("#map-description").val());

                // Either create a new dataset or select existing one
                const createNewDataset = this.$el.find('#new-dataset').prop('checked');
                if (createNewDataset) {
                    this.model.set("create_new_dataset", true);
                } else {
                    const data_sources = []
                    this.$el.find('input[type="checkbox"]:checked').each(function() {
                        data_sources.push(this.value);
                    });
                    if (data_sources.length === 0) {
                        console.error('no data sources chosen');
                        return;
                    }
                    this.model.set("data_sources", JSON.stringify(data_sources));
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
