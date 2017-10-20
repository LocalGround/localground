define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/create-form.html",
    "models/form",
    "models/field",
    "collections/fields",
    "views/field-child-view",
    "jquery.ui"
], function ($, _, Handlebars, Marionette, CreateFormTemplate, Form, Field, Fields, FieldChildView) {
    'use strict';
    var CreateFormView = Marionette.CompositeView.extend({
        showSuccess: false,
        showError: false,
        className: 'create-form',
        initialize: function (opts) {
            _.extend(this, opts);

            if (!this.model) {
                // Create a blank project if new project made
                this.model = new Form();
            } else {
                this.initModel();
            }
            this.template = Handlebars.compile(CreateFormTemplate);
            this.render();
        },
        initModel: function () {
            this.initCollection();
            Marionette.CompositeView.prototype.initialize.call(this);
            if (!this.collection || this.collection.isEmpty()) {
                this.fetchShareData();
            }
        },

        templateHelpers: function () {
            return {
                showSuccess: this.showSuccess,
                showError: this.showError,
                caption: this.model.get("caption"),
                errorMessage: this.model.errorMessage
            };
        },

        childViewContainer: "#fieldList",
        childViewOptions: function () {
            return {
                parent: this
            };
        },
        childView: FieldChildView,
        template: Handlebars.compile(CreateFormTemplate),
        events: {
            'click .remove-row': 'removeRow',
            'click .new_field_button' : 'addFieldButton',
            'click .back': 'backToList',
            'blur .formName': 'setFormName',
            'blur .caption': 'setCaption'
        },
        modelEvents: {
            'error-message': 'modelErrorMessage'
        },
        setFormName: function () {
            this.model.set('name', this.$el.find('.formName').val());
        },
        setCaption: function () {
            this.model.set('caption', this.$el.find('.caption').val());
        },
        onRender: function () {
            var sortableFields = this.$el.find("#fieldList"),
                that  = this;
            sortableFields.sortable({
                helper: this.fixHelper,
                update: function (event, ui) {
                    var $rows = that.$el.find("#fieldList > tr"),
                        tempID,
                        model;
                    $rows.each(function (i) {
                        tempID = $(this).attr("id");
                        model = that.collection.find(function (model) { return model.get('temp_id') === tempID; });
                        model.set("ordering", i + 1);
                    });
                    that.collection.sort("ordering");
                    that.render();
                }
            }).disableSelection();
        },

        // Fix helper with preserved width of cells
        fixHelper: function (e, ui) {
            ui.children().each(function () {
                $(this).width($(this).width());
            });
            return ui;
        },
        fetchShareData: function () {
            this.model.getFields();
        },
        removeRow: function (e) { // to remove a field that has not yet been saved
            var $elem = $(e.target),
                $row =  $elem.parent().parent();
            if ($row.has('select').length != 0) {
                $row.remove();
            }
        },
        modelErrorMessage(message){
            this.app.vent.trigger('error-message', message);
        },
        wait: function (ms) {
            var d = new Date(),
                d2 = null;
            do { d2 = new Date(); } while (d2 - d < ms);
        },
        saveFormSettings: function () {
            var formName = this.$el.find('.formName').val(),
                caption = this.$el.find('.caption').val(),
                that = this,
                key = "form_" + this.model.id,
                fieldsValidated = this.validateFields();
            if (!fieldsValidated) {
                this.render();
                return;
            }

            this.model.set('name', formName);
            this.model.set('caption', caption);
            this.model.set('slug', 'slug_' + parseInt(Math.random() * 100000, 10));
            this.model.set('project_ids', [this.app.getProjectID()]);
            // Some way, there has to be a condition to
            // instantly trigger error when zero fields have name

            this.model.save(null, {
                success: function () {
                    that.saveFields();
                    key = "form_" + that.model.id;
                    that.app.vent.trigger("create-collection", key);
                    that.app.vent.trigger('success-message', "The form was saved successfully");
                    //that.app.vent.trigger('hide-modal');
                },
                error: function () {
                    that.app.vent.trigger('error-message', "Cannot save with empty form or fields.");
                }
            });
        },

        initCollection: function () {
            if (this.collection) {
                return;
            }
            if (!this.model.fields) {
                this.model.fields = new Fields(
                    null,
                    { form: this.model }
                );
            }
            this.collection = this.model.fields;
        },

        /*
          This shall only have 2 modes when reading and / or writing fields:

          1 - "validate" - check and return true if all fields filled
                           or false when any field is not filled
          2 - "save" - after going through validation steps,
                       simply save all complete fields onto form
        */
        checkEachFieldAndPerformAction: function (modeName) {
            var modeNameStr = modeName.trim().toLowerCase();
            if (!(modeNameStr === "save" || modeNameStr === "validate")){
                return;
            }
            var success = true;
            var errorsFound = 0;
            this.initCollection();
            var that = this,
                $rows = this.$el.find("#fieldList > tr"),
                tempID,
                model,
                childView;
            if($rows.length == 0){
                this.app.vent.trigger('error-message', "Cannot have an empty form.");
                return false;
            }
            $rows.each(function (i) {
                tempID = $(this).attr("id");
                model = that.collection.getModelByAttribute('temp_id', tempID);
                childView = that.children.findByModel(model);

                switch(modeNameStr) {
                    case "validate":
                        // set the values, but don't save them to the database:
                        childView.setFieldValuesFromHtmlForm();
                        success = success && childView.validateField();
                        if (!success){
                            errorsFound ++;
                        }
                        break;
                    case "save":
                        // set the values AND save them to the database:
                        childView.saveField(i + 1);
                        that.wait(100);
                        break;
                }
            });
            if (errorsFound > 0){
                success = false;
                this.app.vent.trigger('error-message', "Cannot have unfilled fields.");
            }
            return success
        },

        validateFields: function(){
            var success = this.checkEachFieldAndPerformAction("validate");
            return success;
        },

        saveFields: function () {
            this.checkEachFieldAndPerformAction("save");

        },
        addFieldButton: function () {
            this.initCollection();
            this.collection.add(new Field(
                { ordering: this.collection.length + 1},
                { form: this.model }
            ));
            this.render();
        },

        deleteForm: function () {
            var that = this;
            var key = "form_" + this.model.id;
            if (!confirm("Are you sure you want to delete this form? This will delete all data associated with this form and cannot be undone.")) {
                return;
            }
            this.model.destroy({
                success: function () {
                    that.backToList();
                    that.app.vent.trigger("delete-collection", key);

                }
            });
        },

        backToList: function () {
            this.app.vent.trigger("show-form-list");
        },
        renderWithSaveMessages: function () {
            this.showMessage();
            this.render();
        },
        showMessage: function () {
            var that = this;
            this.showSuccess = this.showError = false;
            this.collection.each(function (model) {
                if (model.errorMessage) {
                    that.showError = true;
                    return;
                }
            });
            if (!this.showError) {
                this.showSuccess = true;
            }
        }
    });
    return CreateFormView;

});
