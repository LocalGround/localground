define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "text!./edit-map-form.html"],
    function ($, _, Marionette, Handlebars, EditMapFormTemplate) {
        'use strict';

        var EditMapForm = Marionette.ItemView.extend({
            errors: {},

            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(EditMapFormTemplate);
                this.formData = {
                    name: this.model.get('name'),
                    caption: this.model.get('caption'),
                };
            },

            templateHelpers: function () {
                this.formData.errors = this.errors;
                return this.formData;
            },

            setName: function () {
                this.formData.name = this.$el.find("#map-name").val();
                if (this.formData.name.length > 0) {
                    this.model.set("name", this.formData.name);
                } else {
                    this.errors.name = "A valid map name is required";
                }
            },

            setCaption: function () {
                this.formData.caption = this.$el.find("#map-caption").val();
                this.model.set("caption", this.formData.caption);
            },

            applyChanges: function () {
                this.errors = {};
                this.setName();
                this.setCaption();
            },

            onShow: function () {
                if (this.focusDataset) {
                    setTimeout(() => {
                        this.$el.find('#map-caption').focus().select();
                    }, 50);
                } else {
                    setTimeout(() => {
                        this.$el.find('#map-name').focus().select();
                    }, 50);
                }
                
            },

            saveMap: function () {
                this.applyChanges()
                if (!_.isEmpty(this.errors)) {
                    this.render();
                    return;
                }
                this.model.save({
                    name: this.model.get('name'),
                    caption: this.model.get('caption')
                }, {
                    patch: true,
                    success: this.updateMapName.bind(this),
                    failure: this.handleServerError.bind(this)
                });
            },
            updateMapName: function () {
                this.model.collection.trigger('update');
                this.app.vent.trigger('close-modal');
            },

            handleServerError: function (errorMessage) {
                alert('there was an error');
            }
        });
        return EditMapForm;

    }
);
