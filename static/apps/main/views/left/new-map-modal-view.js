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
                this.listenTo(this.app.vent, "send-modal-error", this.updateModal);
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
                var datasets = [];
                this.app.dataManager.each(function (item) {
                    if (item.isSite) {
                        datasets.push({key: item.key, title: item.title});
                    }
                });
                var helpers = {
                    generalError: this.generalError,
                    name: 'Untitled Map',
                    datasets: datasets
                };
                return helpers;
            },

            saveMap: function () {
                this.model.set("name", this.$el.find("#map-name").val());
                this.model.set("description",
                    this.$el.find("#map-description").val());
                this.model.set("create_new_dataset",
                    this.$el.find('#new-dataset').prop('checked'));

                var data_sources = []
                this.$el.find('input[type="checkbox"]:checked').each(function() {
                    data_sources.push(this.value);
                });
                this.model.set("data_sources", JSON.stringify(data_sources));

                this.model.save(null, {
                    success: this.displayMap.bind(this)
                });
            },
            displayMap: function () {
                this.app.dataManager.addMap(this.model);
                this.app.vent.trigger('close-modal');
                this.app.router.navigate('//' + this.model.id);
            },

            updateModal: function (errorMessage) {
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
