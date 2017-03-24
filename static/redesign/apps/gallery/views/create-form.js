define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/create-form.html",
    "text!../templates/field-item.html",
    "models/form",
    "collections/fields",
    "apps/gallery/views/field-child-view",
    "jquery.ui"
], function ($, _, Handlebars, Marionette, CreateFormTemplate, FieldItemTemplate, Form, Fields, FieldChildView) {
    'use strict';
    var CreateFormView = Marionette.CompositeView.extend({

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
            this.collection = this.model.fields;
            if (this.collection) {
                this.attachCollectionEventHandlers();
            }
            Marionette.CompositeView.prototype.initialize.call(this);
            if (!this.collection || this.collection.isEmpty()) {
                this.fetchShareData();
            }
        },
        attachCollectionEventHandlers: function () {
            this.listenTo(this.collection, 'reset', this.render);
        },

        childViewContainer: "#fieldList",
        childViewOptions: function () {
            return this.model.toJSON();
        },
        childView: FieldChildView,
        template: Handlebars.compile(CreateFormTemplate),
        events: {
            'click .remove-row': 'removeRow',
            'click .new_field_button' : 'addFieldButton',
            'click .back': 'backToList'
        },
        onRender: function () {
            var sortableFields = this.$el.find("#fieldList"),
                that  = this;
            sortableFields.sortable({
                helper: this.fixHelper,
                update: function (event, ui) {
                    var newOrder = ui.item.index() + 1,
                        modelID = ui.item.find('.id').val(),
                        targetModel = that.collection.get(modelID);
                    targetModel.set("ordering", newOrder);
                    targetModel.save();
                    // TODO: get model from collection, set the order, and
                    // save to the API.
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
        saveFormSettings: function () {
            var formName = this.$el.find('#formName').val(),
                caption = this.$el.find('#caption').val(),
                that = this;
            this.model.set('name', formName);
            this.model.set('caption', caption);
            this.model.set('slug', 'slug_' + parseInt(Math.random() * 100000, 10));
            this.model.set('project_ids', [this.app.getProjectID()]);
            this.model.save(null, {
                success: function () {
                    that.createNewFields();
                },
                error: function () {
                    console.log("The fields could not be saved");
                }
            });
        },

        createNewFields: function () {
            // Gather the list of fields changed / added
            var $fieldList = this.$el.find("#fieldList"),
                $fields = $fieldList.children(),
                i,
                id,
                $row,
                fieldName,
                fieldNameInput,
                fieldType,
                existingField;

            if (!this.model.fields) {
                this.model.fields = new Fields(null,
                        { id: this.model.get("id") }
                    );
                this.collection = this.model.fields;
                this.attachCollectionEventHandlers();
            }

            //loop through each table row:
            for (i = 0; i < $fields.length; i++) {
                $row = $($fields[i]);
                fieldName = $row.find(".fieldname").val();
                fieldNameInput = $row.find(".fieldname");
                if ($row.attr("id") == this.model.id) {
                    //edit existing fields:
                    id = $row.find(".id").val();
                    existingField = this.model.getFieldByID(id);
                    if (!this.errorFieldName(fieldNameInput)) {
                        existingField.set("ordering", i + 1);
                        existingField.set("col_alias", fieldName);
                        existingField.save();
                    } else {
                        $row.css("background-color", "FFAAAA");
                    }
                } else {
                    //create new fields:
                    fieldType = $row.find(".fieldType").val();
                    if (!this.blankField(fieldNameInput, fieldType)) {
                        this.model.createField(fieldName, fieldType, i + 1);
                    } else {
                        $row.css("background-color", "FFAAAA");
                    }
                }
            }
        },
        blankField: function (fieldName, fieldType) {
            return this.errorFieldName(fieldName) ||
                         this.errorFieldType(fieldType);
        },

        errorFieldName: function (_fieldName) {
            var errorCaught = false;
            try {
                if (_fieldName.val().trim() === "") {
                    throw "Field Name Missing";
                }
            } catch (err) {
                errorCaught = true;
                _fieldName.attr("placeholder", err);
                _fieldName.css("background-color", "#FFDDDD");
            } finally {
                return errorCaught;
            }
        },

        errorFieldType: function (_fieldType) {
            var errorCaught = false;
            try {
                if (!_fieldType) {
                    throw "Field Type Missing";
                }
            } catch (err) {
                errorCaught = true;
            } finally {
                return errorCaught;
            }
        },

        addFieldButton: function () {
            var fieldTableDisplay = $(".fieldTable"),
                $newTR = $("<tr class='new-row'></tr>"),
                template = Handlebars.compile(FieldItemTemplate);
            fieldTableDisplay.show();// Make this visible even with 0 users
            $newTR.append(template());
            this.$el.find("#fieldList").append($newTR);
        },

        deleteForm: function () {
            var that = this;
            if (!confirm("Are you sure you want to delete this form?")) {
                return;
            }
            this.model.destroy({
                success: function () {
                    that.backToList();
                }
            });

        },

        backToList: function () {
            this.app.vent.trigger("show-form-list");
        }
    });
    return CreateFormView;

});
