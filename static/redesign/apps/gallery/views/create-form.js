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

            /* to check if editing works
            this.model = new Form({ id: 13 });
            this.listenTo(this.model, 'reset', this.test);
            var that = this;
            this.model.fetch({ success: function () {
                that.render();
            }});
            */ //end check if editing works

            if (this.model == undefined) {
                // Create a blank project if new project made
                console.log("creating new form...");
                this.model = new Form();
            } else {
                console.log("initializing form...");
                this.initModel();
            }
            this.listenTo(this.model, 'sync', this.createNewFields);
            this.template = Handlebars.compile(CreateFormTemplate);
            this.render();
            Marionette.CompositeView.prototype.initialize.call(this);
        },
        initModel: function () {
            this.collection = this.model.fields;
            this.listenTo(this.collection, 'reset', this.render);
            this.model.getFields();
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
            'click .new_field_button' : 'addFieldButton'
        },
        fetchShareData: function () {
            this.model.getFields();
        },
        hideModal: function () {
            this.$el.hide();
        },
        /*
        Behavior problem: After opeiing the modal window and closing
        for the first time, modal windows opo up when
        clicking on the add button again.
        */
        onRender: function () {
            //console.log("rerender");
            var modal = this.$el.find('.modal').get(0),
                span = this.$el.find('.close').get(0);
            modal.style.display = "block";
            // When the user clicks on <span> (x), close the modal
            span.onclick = function () {
                modal.style.display = "none";
            };

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            };
        },

        // Need to add more functions to handle various events
        // and to get the form to open up
        saveFormSettings: function () {
            alert("Need to save form");
            var $formName = $('#formName').val(),
                $shareType = $('#share_type').val(),
                $caption = $('#caption').val(),
                $tags = $('#tags').val();

            this.model.set('name', $formName);
            this.model.set('access_authority', $shareType);
            this.model.set('tags', $tags);
            this.model.set('caption', $caption);
            this.model.set('slug', 'slug_' + parseInt(Math.random() * 100000, 10));
            this.model.set('project_ids', [this.app.selectedProject.id]);
            this.model.save();
        },

        //
        // Still needs refactoring since the majority of the code
        // is based on the share-form.js file
        //

        createNewFields: function () {
            console.log(this.model);
            console.log("createNewFields Called");
            if (this.model.fields == undefined) {
                console.log("this.model.fields is undefined");
                this.model.fields = new Fields(null,
                        { id: this.model.get("id") }
                    );
                this.collection = this.model.fields;
                // Gather the list of fields changed / added
                var $fieldList = $("#fieldList"),
                    $fields = $fieldList.children(),
                    i,
                    $row,
                    fieldName,
                    fieldType,
                    existingField;

                //loop through each table row:
                for (i = 0; i < $fields.length; i++) {
                    $row = $($fields[i]);
                    console.log(i);
                    console.log($row);
                    if ($row.attr("id") == this.model.id) {
                        //edit existing fields:
                        console.log("This field already exists");
                        fieldName = $row.find(".fieldname").html();
                        existingField = this.model.getFieldByName(fieldName);
                        existingField.save();
                    } else {
                        //create new fields:
                        console.log("Create new Field");
                        fieldName = $row.find(".fieldname").val();
                        fieldType = $row.find(".fieldType").val();
                        this.model.createField(fieldName, fieldType);
                    }
                }
                this.collection.fetch({ reset: true });
                this.listenTo(this.collection, 'reset', this.render);
            }
        },

        addFieldButton: function () {
            console.log("Pressed new Field Link");
            var fieldTableDisplay = $(".fieldTable"),
                $newTR = $("<tr class='new-row'></tr>"),
                template = Handlebars.compile(FieldItemTemplate);
            fieldTableDisplay.show();// Make this visible even with 0 users
            $newTR.append(template());
            this.$el.find("#fieldList").append($newTR);
            // Now find out how many rows are there
            // to either show user table or add user prompt
            //
            // this.checkNumberOfRows();

        }
    });
    return CreateFormView;

});
