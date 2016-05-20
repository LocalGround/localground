define(["jquery",
        "marionette",
        "underscore",
        "text!../../../templates/profile/create_project.html",
        "models/project",
        "form",
        "bootstrap-form-templates",
        "backbone-bootstrap-modal"

    ],
    function ($, Marionette, _, createProject, ProjectModel, Form) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * print data modal
         * @class PrintModal
         */

        var CreateProjectModal = Marionette.LayoutView.extend({
            id: 'print-modal-wrapper',
            model: new ProjectModel(),
            template: function (data) {
                return _.template(createProject, data);
            },
            render: function() {
                this.$el.html(this.template);
                this.$el.find("#create-project-form").empty();
                this.$el.find("#create-project-form").append(this.form.$el);
                return this;
            },

            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.listenTo(this.app.vent, "submit-create-project", this.submitData);
                this.model.generateCreateSchema(opts.projectCreateMetadata);

                this.Form = Form.extend({
                    schema: this.model.createSchema
                });
                this.form = new this.Form({
                    model: this.model
                }).render();

            },
            submitData: function (modal) {

                var errors = this.form.commit({ validate: true }),
                    that = this;
                if (errors) { return; }
                this.model.setExtras(this.model.get("extras")); //JSON Serialization (todo: move to custom field)
                this.model.save(null, {
                        success: function (model, response) {
                            //perhaps some sort of indication of success here?
                            // that.$el.css({'background-color': 'rgba(0, 255, 0, 0.1)'});
                            modal.close();
                            that.app.vent.trigger("project-saved");
                        },
                        error: function (model, response) {
                            console.error('error');
                            //perhaps some sort of indication of failure here?
                            that.$el.css({'background-color': 'rgba(255, 0, 0, 0.1)'});
                        }
                    });
            }
        });
        return CreateProjectModal;
    });
