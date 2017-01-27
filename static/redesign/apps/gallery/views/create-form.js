define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/create-form.html",
    "text!../templates/field-item.html",
    "models/form",
    "collections/fields"
], function ($, _, Handlebars, Marionette, CreateFormTemplate, FieldItemTemplate, Form, Fields) {
    // Setting up a create form js
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
            //this.listenTo(this.model, 'sync', this.createNewFields);
            this.template = Handlebars.compile(CreateFormTemplate);
            this.render();
        },
        initModel: function () {
            this.collection = this.model.fields;
            this.attachCollectionEventHandlers();
            Marionette.CompositeView.prototype.initialize.call(this);
            this.model.getFields();
        },
        attachCollectionEventHandlers: function () {
            //this.listenTo(this.collection, 'add', this.render);
            //this.listenTo(this.collection, 'destroy', this.render);
            this.listenTo(this.collection, 'reset', this.render);
        },

        childViewContainer: "#fieldList",
        childViewOptions: function () {
            return this.model.toJSON();
        },
        getChildView: function () {
            // this child view is responsible for displaying
            // and deleting Field models:
            return Marionette.ItemView.extend({
                initialize: function (opts) {
                    _.extend(this, opts);
                },
                events: {
                    'click .delete-field': 'doDelete'
                },
                template: Handlebars.compile(FieldItemTemplate),
                tagName: "tr",
                doDelete: function (e) {
                    if (!confirm("Are you sure you want to remove this field from the form?")) {
                        return;
                    }
                    this.model.destroy();
                    e.preventDefault();
                },
                onRender: function () {
                    console.log(this.model.toJSON());
                }
            });
        },
        template: Handlebars.compile(CreateFormTemplate),
        events: {
            'click #save-form-settings' : 'saveFormSettings',
            'click .close': 'hideModal',
            'click .delete-field': 'removeRow',
            'click .new_field_button' : 'addFieldButton',
            'click .back': 'backToList'
        },
        fetchShareData: function () {
            this.model.getFields();
        },
        removeRow: function (e) {
            var $elem = $(e.target),
                $row =  $elem.parent().parent();
            $row.remove();
        },
        saveFormSettings: function () {
            var formName = this.$el.find('#formName').val(),
                caption = this.$el.find('#caption').val(),
                that = this;

            this.model.set('name', formName);
            this.model.set('caption', caption);
            this.model.set('slug', 'slug_' + parseInt(Math.random() * 100000, 10));
            this.model.set('project_ids', [this.app.selectedProject.id]);
            this.model.save(null, {
                success: function () {
                    that.createNewFields();
                },
                error: function(){
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
                    if (!this.errorFieldName(fieldNameInput)){
                        existingField.set("ordering", i + 1);
                        existingField.set("col_alias", fieldName);
                        existingField.save();
                    }
                    else{
                        $row.css("background-color", "FFAAAA")
                    }
                } else {
                    //create new fields:
                    fieldType = $row.find(".fieldType").val();
                    if (!this.blankField(fieldNameInput, fieldType)){
                        this.model.createField(fieldName, fieldType, i + 1);
                    }
                    else{
                        $row.css("background-color", "FFAAAA")
                    }
                }
            }
        },
        blankField: function(fieldName, fieldType){
            var blankfield = false,

            blankfield = this.errorFieldName(fieldName) ||
                         this.errorFieldType(fieldType);

            return blankfield;
        },

        errorFieldName: function(_fieldName){
            var errorCaught = false;
            try{
                if (_fieldName.val().trim() == ""){
                    throw "Field Name Missing";
                }
            }
            catch (err){
                errorCaught = true;
                _fieldName.attr("placeholder", err);
                _fieldName.css("background-color", "#FFDDDD");
            }
            finally{
                return errorCaught;
            }
        },

        errorFieldType: function(_fieldType){
            var errorCaught = false;
            try{
                if (!_fieldType){
                    throw "Field Type Missing";
                }
            }
            catch (err){
                errorCaught = true;
            }
            finally{
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
            this.model.destroy( {
                success: function () {
                    that.backToList();
                }
            });

        },

        backToList: function(){
            this.app.vent.trigger("show-form-list");
        }
    });
    return CreateFormView;

});
