define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "text!../../templates/left/new-map-modal.html"],
    function ($, _, Marionette, Handlebars, NewMapModalTemplate) {
        'use strict';

        var NewMap = Marionette.ItemView.extend({    
            initialize: function (opts) {
                _.extend(this, opts);
                this.listenTo(this.app.vent, "send-modal-error", this.updateModal);
                this.template = Handlebars.compile(NewMapModalTemplate);
            },

            events: {
                "change #new-map-name" : "generateSlug"
            },
            slugError: null,
            templateHelpers: function () {
                var helpers = {
                    slugError: this.slugError,
                    generalError: this.generalError
                };
                return helpers; 
            },

            saveMap: function () {
                var mapAttrs = {};
                mapAttrs.name = this.$el.find("#new-map-name").val();
                mapAttrs.slug = this.$el.find('#new-map-slug').val();
                this.app.vent.trigger("create-new-map", mapAttrs);
            },
           
            generateSlug: function () {
                var name = this.$el.find('#new-map-name').val(),
                    slug = name.toLowerCase().replace(/\s+/g, "_");
                this.$el.find('#new-map-slug').val(slug);
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
        return NewMap;

    }
);
