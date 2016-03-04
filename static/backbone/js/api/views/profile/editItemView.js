define(["marionette",
        "form",
        "text!../../../templates/profile/item_photo.html",
        "text!../../../templates/profile/item_audio.html",
        "text!../../../templates/profile/item_map_image.html",
        "bootstrap-form-templates"
    ],
    function (Marionette, Form, ItemTemplate, ItemAudioTemplate, ItemMapImageTemplate) {
        'use strict';
        var ListEditView = Marionette.ItemView.extend({
            template: _.template(ItemTemplate),
            tagName: "div",
            hasBeenEdited: false,
            events: {
                'click input': 'markAsEdited'
            },
            modelEvents: {
                'save-if-edited': 'saveIfEdited'
            },
            initialize: function (opts) {
                /* This view now uses the API's update metadata and the "backbone-forms"
                 * library: https://github.com/powmedia/backbone-forms
                 * to dynamically generate forms on-the-fly.
                 */
                this.model.hiddenFields = ["geometry"]; //override the base.js model's hidden field array
                this.model.generateUpdateSchema(opts.updateMetadata);
                this.ModelForm = Form.extend({
                    schema: this.model.updateSchema
                });

                if (this.model.attributes["overlay_type"] == "photo") {
                  this.template = _.template(ItemTemplate);
                }
                else if (this.model.attributes["overlay_type"] == "map-image") {
                  this.template = _.template(ItemMapImageTemplate);
                }
                else if (this.model.attributes["overlay_type"] == "audio") {
                  this.template = _.template(ItemAudioTemplate);
                }

            },
            markAsEdited: function () {
                console.log("mark as edited");
                this.hasBeenEdited = true;
            },
            render: function () {

                this.form = new this.ModelForm({
                    model: this.model
                }).render();

                if (this.model.attributes["overlay_type"] == "photo") {
                  this.$el.html(_.template(ItemTemplate, this.model.toJSON()));
                }
                else if (this.model.attributes["overlay_type"] == "map-image") {
                  this.$el.html(_.template(ItemMapImageTemplate, this.model.toJSON()));
                }
                else if (this.model.attributes["overlay_type"] == "audio") {
                  this.$el.html(_.template(ItemAudioTemplate, this.model.toJSON()));
                }

                this.$el.find('.show-form').append(this.form.$el);
                this.hasBeenEdited = false;
                return this.$el;
            },
            saveIfEdited: function () {
                var errors = this.form.commit({ validate: true }),
                    that = this;
                if (errors) { return; }
                if (this.hasBeenEdited) {
                    this.model.setExtras(this.model.get("extras")); //JSON Serialization (todo: move to custom field)
                    this.model.save(null, {
                        success: function (model, response) {
                            //perhaps some sort of indication of success here?
                            that.$el.css({'background-color': 'rgba(0, 255, 0, 0.1)'});
                        },
                        error: function (model, response) {
                            console.error('error');
                            //perhaps some sort of indication of failure here?
                            that.$el.css({'background-color': 'rgba(255, 0, 0, 0.1)'});
                        }
                    });
                }
            }
        });
        return ListEditView;
    });
