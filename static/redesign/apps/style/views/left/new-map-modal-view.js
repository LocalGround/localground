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
                var helpers = {};
                helpers.slugError = this.slugError;
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
                this.slugError = errorMessage;
                this.render();
            }

        });
        return NewMap;

    }
);
