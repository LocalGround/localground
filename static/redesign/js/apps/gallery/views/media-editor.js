define([
    "underscore",
    "handlebars",
    "marionette",
    "form",
    "text!../templates/media-editor.html"
], function (_, Handlebars, Marionette, Form, MediaEditorTemplate) {
    "use strict";
    var MediaEditor = Marionette.ItemView.extend({
        events: {
            'click .view-mode': 'switchToViewMode',
            'click .save-model': 'saveModel'
        },
        template: Handlebars.compile(MediaEditorTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            Marionette.ItemView.prototype.initialize.call(this);
            this.template = Handlebars.compile(MediaEditorTemplate);
        },
        switchToViewMode: function () {
            this.app.vent.trigger("show-detail", this.model.get("id"));
        },
        onRender: function () {
            //https://github.com/powmedia/backbone-forms#custom-editors
            this.form = new Backbone.Form({
                model: this.model,
                fields: ['name', 'caption', 'tags']
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
                    that.$el.find("#model-form").append("saved successfully");
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