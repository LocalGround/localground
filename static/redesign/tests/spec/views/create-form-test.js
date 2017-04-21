var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/gallery/views/create-form",
    rootDir + "models/form",
    rootDir + "models/field",
    "tests/spec-helper"
],
    function ($, CreateForm, Form, Field) {
        'use strict';
        var fixture, newCreateForm, initSpies;

        initSpies = function () {
            spyOn(CreateForm.prototype, 'render').and.callThrough();
            spyOn(CreateForm.prototype, 'initModel').and.callThrough();
            spyOn(CreateForm.prototype, 'attachCollectionEventHandlers').and.callThrough();
            spyOn(CreateForm.prototype, 'fetchShareData').and.callThrough();
            spyOn(CreateForm.prototype, 'saveFields').and.callThrough();
            spyOn(Form.prototype, "getFields").and.callThrough();

            //event methods:
            spyOn(CreateForm.prototype, 'saveFormSettings').and.callThrough();
            spyOn(CreateForm.prototype, 'deleteForm').and.callThrough();
            spyOn(CreateForm.prototype, 'removeRow').and.callThrough();
            spyOn(CreateForm.prototype, 'addFieldButton').and.callThrough();
            spyOn(CreateForm.prototype, 'backToList').and.callThrough();
            spyOn(Field.prototype, 'save').and.callThrough();
            spyOn(Form.prototype, 'createField').and.callThrough();

            //error catch functions
            spyOn(CreateForm.prototype, 'blankField').and.callThrough();
            spyOn(CreateForm.prototype, 'errorFieldName').and.callThrough();
            spyOn(CreateForm.prototype, 'errorFieldType').and.callThrough();
            spyOn(Form.prototype, 'createField').and.callThrough();
            spyOn(Form.prototype, 'destroy').and.callThrough();

            //error catch functions
            spyOn(CreateForm.prototype, 'blankField').and.callThrough();
            spyOn(CreateForm.prototype, 'errorFieldName').and.callThrough();
            spyOn(CreateForm.prototype, 'errorFieldType').and.callThrough();
        };

        describe("Create Form: Initialization Tests", function () {
            beforeEach(function () {
                initSpies();
            });

            it("Form Successfully created", function () {
                newCreateForm = new CreateForm();
                expect(newCreateForm.model).toEqual(jasmine.any(Form));
                expect(CreateForm.prototype.initModel).toHaveBeenCalledTimes(0);
            });

            it("Template is created", function () {
                newCreateForm = new CreateForm();
                expect(newCreateForm.template).toEqual(jasmine.any(Function));
            });

            it("Render function called", function () {
                newCreateForm = new CreateForm();
                expect(CreateForm.prototype.render).toHaveBeenCalledTimes(1);
            });

            it("No Model defined, make new model", function () {
                newCreateForm = new CreateForm({
                    model: this.form
                });
                expect(CreateForm.prototype.initModel).toHaveBeenCalledTimes(1);
            });
        });

        describe("Create Form: Initialize model", function () {
            beforeEach(function () {
                initSpies();
                newCreateForm = new CreateForm({
                    model: this.form //initializes w/three fields
                });
            });

            it("Put fields into collection", function () {
                expect(newCreateForm.collection).toEqual(newCreateForm.model.fields);
                expect(newCreateForm.collection.length).toEqual(3);
            });
        });

        describe("Create Form: Attach Collection Event Handler", function () {
            beforeEach(function () {
                initSpies();
                newCreateForm = new CreateForm({
                    model: this.form
                });
            });

            it("Calls Render when Collection Resets", function () {
                expect(CreateForm.prototype.render).toHaveBeenCalledTimes(1);
                newCreateForm.collection.trigger("add");
                expect(CreateForm.prototype.render).toHaveBeenCalledTimes(2);
            });
        });

        describe("Create Form: Initialize Model without fields", function () {
            it("Create an empty form without fields and get fields", function () {
                initSpies();
                var emptyForm = new CreateForm({
                    model: new Form()
                });
                expect(emptyForm.collection.length).toBe(0);
                expect(Form.prototype.getFields).toHaveBeenCalledTimes(1);
            });

            it("Create an empty form with an ID without fields", function () {
                initSpies();
                var emptyForm = new CreateForm({
                    model: new Form({id: 5})
                });
                expect(emptyForm.collection).not.toBeNull();
                expect(Form.prototype.getFields).toHaveBeenCalledTimes(1);
            });
        });

        describe("Create Form: Parent Events All Fire", function () {
            beforeEach(function () {
                initSpies();
                newCreateForm = new CreateForm({
                    model: this.form
                });
            });

            it("Adds new field when user clicks 'add column' button", function () {
                fixture = setFixtures('<div></div>').append(newCreateForm.$el);
                expect(CreateForm.prototype.addFieldButton).toHaveBeenCalledTimes(0);
                fixture.find('.new_field_button').trigger('click');
                expect(CreateForm.prototype.addFieldButton).toHaveBeenCalledTimes(1);
            });
        });

        describe("Create Form: All Methods work", function () {
            beforeEach(function () {
                initSpies();
            });

            describe("Functions that require Form to be empty", function () {

                it("calls the Form's getFields() method when fetchShareData is called", function () {

                    expect(CreateForm.prototype.fetchShareData).toHaveBeenCalledTimes(0);
                    newCreateForm = new CreateForm({
                        model: new Form()
                    });
                    expect(CreateForm.prototype.fetchShareData).toHaveBeenCalledTimes(1);
                    expect(Form.prototype.getFields).toHaveBeenCalledTimes(1);
                });
            });

            describe("Functions that the form has fields", function () {
                beforeEach(function () {
                    newCreateForm = new CreateForm({
                        model: this.form,
                        app: this.app
                    });
                });

                it("removes the new row from the DOM successfully when removeRow is called", function () {
                    // hint: first call newCreateForm.addFieldButton() and then
                    // make sure that there's a ".remove-row" in the DOM. Then call
                    // newCreateForm.removeRow() and make sure there's not a ".remove-row" in
                    // the DOM

                    fixture = setFixtures('<div></div>').append(newCreateForm.$el);
                    expect(CreateForm.prototype.removeRow).toHaveBeenCalledTimes(0);
                    expect(CreateForm.prototype.addFieldButton).toHaveBeenCalledTimes(0);

                    //add a new row by triggering the '.new_field_button click'
                    expect(fixture.find('.remove-row').html()).toBeUndefined();
                    fixture.find('.new_field_button').trigger('click');
                    expect(CreateForm.prototype.addFieldButton).toHaveBeenCalledTimes(1);
                    expect(fixture.find('.remove-row')).toBeInDOM();
                    expect(fixture.find('.remove-row').html()).not.toBeUndefined();

                    //remove new row by triggering '.remove-row click'
                    expect(CreateForm.prototype.removeRow).toHaveBeenCalledTimes(0);
                    fixture.find('.remove-row').trigger('click');
                    expect(CreateForm.prototype.removeRow).toHaveBeenCalledTimes(2);
                    expect(fixture.find('.remove-row').html()).toBeUndefined();
                });

                it("correctly saves the model when the saveForm is called", function () {
                    //hint: make sure that it sets all of the attributes on the model and then
                    //triggers the form model's "save" method.
                    expect(CreateForm.prototype.saveFormSettings).toHaveBeenCalledTimes(0);
                    fixture = setFixtures('<div></div>').append(newCreateForm.$el);
                    fixture.find('#formName').val('new form name');
                    fixture.find('#caption').val('dummy caption');
                    newCreateForm.saveFormSettings();
                    expect(newCreateForm.model.get('name')).toBe('new form name');
                    expect(newCreateForm.model.get('caption')).toBe('dummy caption');
                });
            });

            describe("Creating a field", function () {
                it("successfully adds and saves the field where no fields exist", function () {
                    newCreateForm = new CreateForm({
                        app: this.app,
                        model: new Form({id: 5})
                    });
                    fixture = setFixtures("<div></div>").append(newCreateForm.$el);
                    expect(CreateForm.prototype.addFieldButton).toHaveBeenCalledTimes(0);

                    //add a new row by triggering the '.new_field_button click'
                    fixture.find('.new_field_button').trigger('click');
                    expect(CreateForm.prototype.addFieldButton).toHaveBeenCalledTimes(1);

                    fixture.find('#formName').val('new form name');
                    fixture.find('#caption').val('dummy caption');
                    // We are working with one field from a newly created form
                    // so it should be easy to find one class of field properties

                    fixture.find('.fieldname').val("Sample Text");
                    fixture.find('.fieldType').val("text");
                    fixture.find('.display_field_button').prop("checked");

                    expect(CreateForm.prototype.saveFormSettings).toHaveBeenCalledTimes(0);
                    expect(CreateForm.prototype.saveFields).toHaveBeenCalledTimes(0);
                    newCreateForm.saveFormSettings();

                    expect(newCreateForm.model.get('name')).toBe('new form name');
                    expect(newCreateForm.model.get('caption')).toBe('dummy caption');

                    expect(CreateForm.prototype.saveFormSettings).toHaveBeenCalledTimes(1);
                    expect(CreateForm.prototype.saveFields).toHaveBeenCalledTimes(1);

                    // Form has a collection of fields
                    expect(Form.prototype.createField).toHaveBeenCalledWith("Sample Text", "text", false, 1);

                });
                it("successfully modifies and saves existing fields", function () {
                    newCreateForm = new CreateForm({
                        app: this.app,
                        model: this.form
                    });

                    //render existing form:
                    fixture = setFixtures("<div></div>").append(newCreateForm.$el);

                    //pretend to be a user and update the field names:
                    var $inputs = fixture.find('input.fieldname');
                    $($inputs[0]).val("new field 1");
                    $($inputs[1]).val("new field 2");
                    $($inputs[2]).val("new field 3");

                    //save the form:
                    newCreateForm.saveFormSettings();
                    expect(Field.prototype.save).toHaveBeenCalledTimes(3);
                    expect(newCreateForm.collection.at(0).get("col_alias")).toBe("new field 1");
                    expect(newCreateForm.collection.at(1).get("col_alias")).toBe("new field 2");
                    expect(newCreateForm.collection.at(2).get("col_alias")).toBe("new field 3");
                });

                it("If fieldname is blank, it shows an error", function () {
                    newCreateForm = new CreateForm({
                        app: this.app,
                        model: this.form
                    });

                    fixture = setFixtures("<div></div>").append(newCreateForm.$el);

                    var $inputs = fixture.find('input.fieldname');
                    $($inputs[0]).val(""); // empty out the field and test for the error

                    expect(CreateForm.prototype.errorFieldName).toHaveBeenCalledTimes(0);
                    newCreateForm.saveFormSettings();

                    expect(CreateForm.prototype.errorFieldName).toHaveBeenCalledTimes(3);
                    expect($($inputs[0]).css("background-color")).toBe("rgb(255, 221, 221)");
                    expect($($inputs[1]).css("background-color")).not.toBe("rgb(255, 221, 221)");
                    expect($($inputs[2]).css("background-color")).not.toBe("rgb(255, 221, 221)");
                    expect($($inputs[0]).attr("placeholder")).toBe("Field Name Missing");

                });

                it("If fieldtype is blank, it shows an error", function () {
                    newCreateForm = new CreateForm({
                        app: this.app,
                        model: this.form
                    });
                    //test "errorFieldType" method:
                    expect(1).toBe(1);
                });


                it("If fieldname is blank, it shows an error", function () {
                    newCreateForm = new CreateForm({
                        app: this.app,
                        model: this.form
                    });

                    fixture = setFixtures("<div></div>").append(newCreateForm.$el);

                    var $inputs = fixture.find('input.fieldname');
                    $($inputs[0]).val(""); // empty out the field and test for the error

                    expect(CreateForm.prototype.errorFieldName).toHaveBeenCalledTimes(0);
                    newCreateForm.saveFormSettings();

                    expect(CreateForm.prototype.errorFieldName).toHaveBeenCalledTimes(3);
                    expect($($inputs[0]).css("background-color")).toBe("rgb(255, 221, 221)");
                    expect($($inputs[1]).css("background-color")).not.toBe("rgb(255, 221, 221)");
                    expect($($inputs[2]).css("background-color")).not.toBe("rgb(255, 221, 221)");
                    expect($($inputs[0]).attr("placeholder")).toBe("Field Name Missing");

                });

                it("If fieldtype is blank, it shows an error", function () {

                    newCreateForm = new CreateForm({
                        app: this.app,
                        model: new Form({id: 5})
                    });
                    newCreateForm.render();

                    fixture = setFixtures("<div></div>").append(newCreateForm.$el);
                    fixture.find('.new_field_button').trigger('click');
                    var $inputs_type = fixture.find('select.fieldType');
                    //$($inputs_type[0]).val(""); // empty out the field and test for the error

                    var $inputs_name = fixture.find('input.fieldname');
                    $($inputs_name[0]).val('Test'); // empty out the field and test for the error

                    expect(CreateForm.prototype.errorFieldType).toHaveBeenCalledTimes(0);
                    newCreateForm.saveFormSettings();

                    expect(CreateForm.prototype.errorFieldType).toHaveBeenCalledTimes(1);
                    expect($($inputs_type[0]).parent().parent().css("background-color")).toBe("rgb(255, 170, 170)");

                });

                it("Changes default display of field inside form", function(){
                    newCreateForm = new CreateForm({
                        app: this.app,
                        model: this.form
                    });

                    fixture = setFixtures("<div></div>").append(newCreateForm.$el);

                    var $inputs_isDisplay = fixture.find('input.display_field_button');
                    console.log($inputs_isDisplay);
                    // before save changes
                    expect($($inputs_isDisplay[0]).prop("checked")).toBe(true);
                    expect($($inputs_isDisplay[1]).prop("checked")).toBe(false);
                    expect($($inputs_isDisplay[2]).prop("checked")).toBe(false);

                    // Set property of other check to be true,
                    // and previous check automatically set to false
                    $($inputs_isDisplay[1]).prop("checked", true);
                    newCreateForm.saveFormSettings();

                    // After save changes
                    expect($($inputs_isDisplay[0]).prop("checked")).toBe(false);
                    expect($($inputs_isDisplay[1]).prop("checked")).toBe(true);
                    expect($($inputs_isDisplay[2]).prop("checked")).toBe(false);



                });

                it("Successfully deletes the form", function () {
                    newCreateForm = new CreateForm({
                        app: this.app,
                        model: this.form
                    });
                    //I am almost there with delete form, but I am getting the problem that
                    // deleteForm is not defined


                    spyOn(window, 'confirm').and.returnValue(true);

                    fixture = setFixtures("<div></div>").append(newCreateForm.$el);

                    expect(CreateForm.prototype.deleteForm).toHaveBeenCalledTimes(0);
                    expect(Form.prototype.destroy).toHaveBeenCalledTimes(0);
                    expect(CreateForm.prototype.backToList).toHaveBeenCalledTimes(0);

                    newCreateForm.deleteForm();

                    expect(CreateForm.prototype.deleteForm).toHaveBeenCalledTimes(1);
                    expect(Form.prototype.destroy).toHaveBeenCalledTimes(1);
                    expect(CreateForm.prototype.backToList).toHaveBeenCalledTimes(1);


                });
            });

        });

    });
