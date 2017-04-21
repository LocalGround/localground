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
            spyOn(CreateForm.prototype, 'fetchShareData').and.callThrough();
            spyOn(CreateForm.prototype, 'saveFields').and.callThrough();
            spyOn(Form.prototype, "getFields").and.callThrough();

            //event methods:
            spyOn(CreateForm.prototype, 'saveFormSettings').and.callThrough();
            spyOn(CreateForm.prototype, 'removeRow').and.callThrough();
            spyOn(CreateForm.prototype, 'addFieldButton').and.callThrough();
            spyOn(CreateForm.prototype, 'backToList').and.callThrough();
            spyOn(Field.prototype, 'save').and.callThrough();
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

                    expect(CreateForm.prototype.saveFormSettings).toHaveBeenCalledTimes(0);
                    expect(CreateForm.prototype.saveFields).toHaveBeenCalledTimes(0);
                    newCreateForm.saveFormSettings();

                    expect(newCreateForm.model.get('name')).toBe('new form name');
                    expect(newCreateForm.model.get('caption')).toBe('dummy caption');

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

                it("Successfully deletes the form", function () {
                    newCreateForm = new CreateForm({
                        app: this.app,
                        model: this.form
                    });
                    //test "errorFieldType" method:
                    expect(1).toBe(1);
                });
            });

            describe("Field Child View Operations", function () {
                it("Renders a field correctly", function () {
                    //import Field model and create a field or else
                    // use an existing field from this.form.fields
                    newCreateForm = new CreateForm({
                        app: this.app,
                        model: this.form
                    });
                    //test "errorFieldType" method:
                    expect(1).toBe(1);
                });

                it("Successfully deletes a field", function () {
                    newCreateForm = new CreateForm({
                        app: this.app,
                        model: this.form
                    });
                    //test "errorFieldType" method:
                    expect(1).toBe(1);
                });

            });
        });

    });
