define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "models/layer",
    "text!../../templates/left/edit-display-field-modal.html",],
    function ($, _, Marionette, Handlebars, Layer, EditLayerModalTemplate) {
        'use strict';

        var NewLayer = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(EditLayerModalTemplate);
                this.displayFields = this.getFields();
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
                    generalError: this.generalError,
                    displayFields: this.displayFields,
                    current: this.model.get('display_field')
                };
                return helpers;
            },

            saveLayer: function() {
                console.log('new layer modal, save!', this);
                const display_field = this.$el.find('#display-field').val();
                this.model.set('display_field', display_field);

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
            },

            getFields: function() {
                const key = this.model.get('data_source'),
                    collection = this.app.dataManager.getCollection(key);
                let fields = [];
                console.log(collection);
                console.log(collection.getFields());
                collection.getFields().models.forEach((record) => {
                    var field = record.get("col_name");
                    console.log(field);
                    fields.push({
                        text: record.get("col_alias"),
                        value: record.get("col_name"),
                    })
                    // dataColumns.push({
                    //     text: record.get("col_alias"),
                    //     value: record.get("col_name"),
                    //     hasData: this.fieldHasData(collection, field),
                    //     type: record.get("data_type")
                    // });
                });
                console.log(fields);
                return fields;
            }
        });
        return NewLayer;

    }
);
