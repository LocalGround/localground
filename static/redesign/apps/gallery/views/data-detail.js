define([
    "backbone",
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/photo-detail.html",
    "text!../templates/audio-detail.html",
    "text!../templates/marker-detail.html",
    "text!../templates/record-detail.html",
    "form" //extends Backbone
], function (Backbone, _, Handlebars, Marionette, PhotoTemplate, AudioTemplate, MarkerTemplate, RecordTemplate) {
    "use strict";
    var MediaEditor = Marionette.ItemView.extend({
        events: {
            'click .view-mode': 'switchToViewMode',
            'click .edit-mode': 'switchToEditMode',
            'click .save-model': 'saveModel',
            'click .delete-model': 'deleteModel'
        },
        getTemplate: function () {
            if (this.app.dataType == "photos") {
                return Handlebars.compile(PhotoTemplate);
            } else if (this.app.dataType == "audio") {
                return Handlebars.compile(AudioTemplate);
            } else if (this.app.dataType == "markers") {
                return Handlebars.compile(MarkerTemplate);
            } else {
                return Handlebars.compile(RecordTemplate);
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
            var context = {
                mode: this.app.mode,
                dataType: this.app.dataType
            };
            return context;
        },
        onRender: function () {
            //https://github.com/powmedia/backbone-forms#custom-editors
            var fields, i, field;
            if (this.app.dataType.indexOf('form_') != -1) {
                fields = [];
                for (i = 0; i < this.model.get("fields").length; i++) {
                    field = this.model.get("fields")[i];
                    console.log(field);
                    fields.push(field.col_name);
                }
            } else {
                fields = ['name', 'caption', 'tags', 'attribution'];
            }
            this.form = new Backbone.Form({
                model: this.model,
                fields: fields
            }).render();
            this.$el.find('#model-form').append(this.form.$el);
        },
        saveModel: function () {
            var errors = this.form.commit({ validate: true }),
                that = this,
                isNew = this.model.get("id") ? false : true;
            if (errors) {
                console.log("errors: ", errors);
                return;
            }
            this.model.save(null, {
                success: function (model, response) {
                    //perhaps some sort of indication of success here?
                    that.$el.find(".success-message").show().delay(3000).fadeOut(1500);
                    if (!isNew) {
                        console.log("updating...");
                        model.trigger('saved');
                    } else {
                        console.log("adding...");
                        model.collection.add(model);
                    }
                },
                error: function (model, response) {
                    that.$el.find("#model-form").append("error saving");
                }
            });
        },
        deleteModel: function (e) {
            var that = this;
            if (!confirm("Are you sure you want to delete this entry?")) {
                return;
            }
            this.model.destroy({
                success: function () {
                    //trigger an event that clears out the deleted model's detail:
                    that.app.vent.trigger('hide-detail');
                }
            });
            e.preventDefault();
        },
        doNotDisplay: function () {
            this.$el.html("");
        }
    });
    return MediaEditor;
});
