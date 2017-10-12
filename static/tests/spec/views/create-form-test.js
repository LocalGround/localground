var rootDir = "../../";
define([
    "jquery",
    rootDir + "views/create-form",
    rootDir + "models/form",
    rootDir + "models/field",
    "tests/spec-helper"
],
    function ($, CreateForm, Form, Field) {
        'use strict';
        var fixture, newCreateForm, initSpies;

        initSpies = function (scope) {
            spyOn(CreateForm.prototype, 'render').and.callThrough();
            spyOn(CreateForm.prototype, 'initModel').and.callThrough();
            spyOn(CreateForm.prototype, 'fetchShareData').and.callThrough();
            spyOn(CreateForm.prototype, 'saveFields').and.callThrough();
            spyOn(CreateForm.prototype, 'validateFields').and.callThrough();
            spyOn(CreateForm.prototype, 'fieldViewMode').and.callThrough();
            spyOn(Form.prototype, "getFields").and.callThrough();

            //event methods:
            spyOn(CreateForm.prototype, 'saveFormSettings').and.callThrough();
            spyOn(CreateForm.prototype, 'deleteForm').and.callThrough();
            spyOn(CreateForm.prototype, 'removeRow').and.callThrough();
            spyOn(CreateForm.prototype, 'addFieldButton').and.callThrough();
            spyOn(CreateForm.prototype, 'backToList').and.callThrough();
            spyOn(Field.prototype, 'save').and.callThrough();
            spyOn(Form.prototype, 'createField').and.callThrough();
            spyOn(Form.prototype, 'destroy').and.callThrough();

            spyOn(Field.prototype, 'validate').and.callThrough();
            spyOn(Field.prototype, 'validateRating').and.callThrough();
            spyOn(Field.prototype, 'validateChoice').and.callThrough();

            spyOn(scope.app.vent, 'trigger').and.callThrough();
        };

        describe("Create Form: Initialization Tests", function () {
            beforeEach(function () {
                initSpies(this);
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
                initSpies(this);
                newCreateForm = new CreateForm({
                    model: this.form
                });
            });

            it("Put fields into collection", function () {
                expect(newCreateForm.collection).toEqual(newCreateForm.model.fields);
                expect(newCreateForm.collection.length).toEqual(newCreateForm.model.fields.length);
            });
        });

        describe("Create Form: Attach Collection Event Handler", function () {
            beforeEach(function () {
                initSpies(this);
                newCreateForm = new CreateForm({
                    model: this.form
                });

                // Where are the tests for them?
            });

        });

        describe("Create Form: Initialize Model without fields", function () {
            it("Create an empty form without fields and get fields", function () {
                initSpies(this);
                var emptyForm = new CreateForm({
                    model: new Form()
                });
                expect(emptyForm.collection.length).toBe(0);
                expect(Form.prototype.getFields).toHaveBeenCalledTimes(1);
            });

            it("Create an empty form with an ID without fields", function () {
                initSpies(this);
                var emptyForm = new CreateForm({
                    model: new Form({id: 5})
                });
                expect(emptyForm.collection).not.toBeNull();
                expect(Form.prototype.getFields).toHaveBeenCalledTimes(1);
            });
        });

        describe("Create Form: Parent Events All Fire", function () {
            beforeEach(function () {
                initSpies(this);
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
                initSpies(this);
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
                    expect(CreateForm.prototype.removeRow).toHaveBeenCalledTimes(1);
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
                    //expect(newCreateForm.model.get('name')).toBe('new form name');
                    //expect(newCreateForm.model.get('caption')).toBe('dummy caption');
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

                    expect(newCreateForm.model.get('name')).toEqual('new form name');
                    expect(newCreateForm.model.get('caption')).toEqual('dummy caption');

                    expect(CreateForm.prototype.saveFormSettings).toHaveBeenCalledTimes(1);
                    expect(CreateForm.prototype.saveFields).toHaveBeenCalledTimes(1);

                });
                it("successfully modifies and saves existing fields", function () {
                    newCreateForm = new CreateForm({
                        app: this.app,
                        model: this.form
                    });

                    //render existing form:
                    fixture = setFixtures("<div></div>").append(newCreateForm.$el);
                    fixture.find('.fieldname').each(function (i) {
                        $(this).val("new field " + (i + 1)).trigger('blur');
                    });
                    expect($(fixture.find('.fieldname')[0]).val()).toBe("new field 1");
                    expect($(fixture.find('.fieldname')[1]).val()).toBe("new field 2");
                    expect($(fixture.find('.fieldname')[2]).val()).toBe("new field 3");

                    //save the form:
                    newCreateForm.saveFormSettings();
                    expect(Field.prototype.save).toHaveBeenCalledTimes(5);
                    expect(newCreateForm.collection.at(0).get("col_alias")).toBe("new field 1");
                    expect(newCreateForm.collection.at(1).get("col_alias")).toBe("new field 2");
                    expect(newCreateForm.collection.at(2).get("col_alias")).toBe("new field 3");
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

            describe("Validating a New Field", function(){

                it("Successfully passes all validation tests", function(){
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

                    expect(CreateForm.prototype.validateFields).toHaveBeenCalledTimes(0);
                    expect(CreateForm.prototype.saveFields).toHaveBeenCalledTimes(0);
                    expect(CreateForm.prototype.fieldViewMode).toHaveBeenCalledTimes(0);

                    newCreateForm.saveFormSettings();

                    // Having trouble getting the saveFields to be called
                    // despite that saveFormSettings does call upon success case

                    expect(CreateForm.prototype.validateFields).toHaveBeenCalledTimes(1);
                    expect(CreateForm.prototype.validateFields).toBeTruthy();
                    expect(CreateForm.prototype.saveFields).toHaveBeenCalledTimes(1);
                    expect(CreateForm.prototype.fieldViewMode).toHaveBeenCalledTimes(1);


                });

                it("Successfully Detects Unfilled Field Error", function(){
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

                    fixture.find('.fieldname').val("");
                    fixture.find('.fieldType').val("-1");


                    expect(CreateForm.prototype.validateFields).toHaveBeenCalledTimes(0);
                    expect(CreateForm.prototype.fieldViewMode).toHaveBeenCalledTimes(0);

                    newCreateForm.saveFormSettings();

                    expect(CreateForm.prototype.validateFields).toHaveBeenCalledTimes(1);
                    expect(CreateForm.prototype.validateFields).toBeFalsy(); // Having trouble gettign this to be false
                    expect(CreateForm.prototype.fieldViewMode).toHaveBeenCalledTimes(1);
                    // I want the error message to actually be trigger when fields are invalid
                    expect(this.app.vent.trigger).toHaveBeenCalledWith('error-message', jasmine.any(Object));
                });

            });

        });

    });
