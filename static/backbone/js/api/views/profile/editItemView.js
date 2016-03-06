define(["marionette",
        "form",
        "bootstrap-form-templates"
    ],
    function (Marionette, Form) {
        'use strict';
        var ListEditView = Marionette.ItemView.extend({
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
                this.mode = opts.mode;
                if (this.mode == "edit") {
                    this.Template = opts.EditItemTemplate;
                } else {
                    this.Template = opts.ItemTemplate;
                }
                this.template = _.template(this.Template);
                this.model.hiddenFields = ["geometry"]; //override the base.js model's hidden field array
                this.model.generateUpdateSchema(opts.updateMetadata);
                this.ModelForm = Form.extend({
                    schema: this.model.updateSchema
                });

            },
            markAsEdited: function () {
                console.log("mark as edited");
                this.hasBeenEdited = true;
            },
            render: function () {
                this.$el.html(_.template(this.Template, this.model.toJSON()));

                // if the form is in edit mode, also append the form:
                if (this.mode == "edit") {
                    this.form = new this.ModelForm({
                        model: this.model
                    }).render();
                    this.$el.find('.show-form').append(this.form.$el);
                    this.hasBeenEdited = false;
                }

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
