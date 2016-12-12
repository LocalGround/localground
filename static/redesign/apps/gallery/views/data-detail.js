define([
    "backbone",
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/photo-detail.html",
    "text!../templates/audio-detail.html",
    "form" //extends Backbone
], function (Backbone, _, Handlebars, Marionette, PhotoTemplate, AudioTemplates) {
    "use strict";
    var MediaEditor = Marionette.ItemView.extend({
        events: {
            'click .view-mode': 'switchToViewMode',
            'click .edit-mode': 'switchToEditMode',
            'click .save-model': 'saveModel'
        },
        getTemplate: function () {
            if (this.app.dataType == "photos") {
                return Handlebars.compile(PhotoTemplate);
            } else {
                return Handlebars.compile(AudioTemplates);
            }
        },
        initialize: function (opts) {
            _.extend(this, opts);
            Marionette.ItemView.prototype.initialize.call(this);
        },
        switchToViewMode: function () {
            this.app.mode = "view";
            this.render();
        },
        switchToEditMode: function () {
            this.app.mode = "edit";
            this.render();
        },
        templateHelpers: function () {
            return {
                mode: this.app.mode,
                dataType: this.app.dataType
            };
        },
        onRender: function () {
            //https://github.com/powmedia/backbone-forms#custom-editors
            this.form = new Backbone.Form({
                model: this.model,
                fields: ['name', 'caption', 'tags', 'attribution']
            }).render();
            this.$el.find('#model-form').append(this.form.$el);
        },
        saveModel: function () {
            var errors = this.form.commit({ validate: true }),
                that = this;
            if (errors) {
                console.log("errors: ", errors);
                return;
            }
            this.model.save(null, {
                success: function (model, response) {
                    //perhaps some sort of indication of success here?
                    that.$el.find("#model-form").append("<span class = 'confirmation'>saved successfully</span>");
                    model.trigger('saved');
                },
                error: function (model, response) {
                    that.$el.find("#model-form").append("error saving");
                }
            });
        }
    });
    return MediaEditor;
});