var rootDir = "../../";
define([
    "handlebars",
    rootDir + "apps/gallery/views/create-form",
    rootDir + "models/form",
    "tests/spec-helper"
],
    function (Handlebars, CreateForm, Form) {
        'use strict';
        var fixture;
        var newCreateForm;

        var initSpies = function () {
            spyOn(CreateForm.prototype, 'render').and.callThrough();
            spyOn(CreateForm.prototype, 'initModel').and.callThrough();
            spyOn(CreateForm.prototype, 'attachCollectionEventHandlers').and.callThrough();
            spyOn(CreateForm.prototype, 'fetchShareData').and.callThrough();
            spyOn(Form.prototype, "getFields").and.callThrough();

            //event methods:
            spyOn(CreateForm.prototype, 'saveFormSettings').and.callThrough();
            spyOn(CreateForm.prototype, 'removeRow').and.callThrough();
            spyOn(CreateForm.prototype, 'addFieldButton').and.callThrough();
            spyOn(CreateForm.prototype, 'backToList').and.callThrough();
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
                //console.log(newCreateForm.template);
                newCreateForm = new CreateForm();
                expect(newCreateForm.template).toEqual(jasmine.any(Function));
            });

            it("Render function called", function () {
                newCreateForm = new CreateForm();
                expect(CreateForm.prototype.render).toHaveBeenCalledTimes(1);
            });

            it("No Model defined, make new model", function(){
                newCreateForm = new CreateForm({
                    model: this.form
                });
                expect(CreateForm.prototype.initModel).toHaveBeenCalledTimes(1);
            });
        });

        describe("Create Form: Initialize model", function() {
            beforeEach(function () {
                initSpies();
                newCreateForm = new CreateForm({
                    model: this.form
                });
            });

            it("Put fields into collection", function(){
                //console.log("New Create Form Collection: " + newCreateForm.collection);
                //console.log("Length of test Collection " + newCreateForm.collection.length);
                expect(newCreateForm.collection).toEqual(newCreateForm.model.fields);
                expect(newCreateForm.collection.length).toEqual(3);
            });
        });

        describe("Create Form: Attach Collection Event Handler", function(){
            beforeEach(function () {
                initSpies();
                newCreateForm = new CreateForm({
                    model: this.form
                });
            });

            it("Calls Render when Collection Resets", function(){
                // trigger collection set and make render be called
                newCreateForm.collection.trigger("reset");
                expect(CreateForm.prototype.render).toHaveBeenCalledTimes(2);
            });
        });

        describe("Create Form: Initialize Model without fields", function(){
            it("Create an empty form without fields and get fields", function(){
                initSpies();
                var emptyForm = new CreateForm({
                    model: new Form()
                });
                expect(emptyForm.collection).toBeUndefined();
                expect(Form.prototype.getFields).toHaveBeenCalledTimes(1);
            });

            it("Create an empty form with an ID without fields", function(){
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

            it("Calls remove row when 'delete field' button is clicked", function () {
                fixture = setFixtures('<div></div>').append(newCreateForm.$el);
                expect(CreateForm.prototype.removeRow).toHaveBeenCalledTimes(0);
                fixture.find('.new_field_button').trigger('click');
                fixture.find('.remove-row').trigger('click');
                expect(CreateForm.prototype.removeRow).toHaveBeenCalledTimes(1);
            });
        });

        describe("Create Form: All Methods work", function () {
            beforeEach(function () {
                initSpies();
            });

            describe("Functions that require Form to be empty", function(){

                it("calls the Form's getFields() method when fetchShareData is called", function () {

                    expect(CreateForm.prototype.fetchShareData).toHaveBeenCalledTimes(0);
                    newCreateForm = new CreateForm({
                        model: new Form()
                    });
                    expect(CreateForm.prototype.fetchShareData).toHaveBeenCalledTimes(1);
                    expect(Form.prototype.getFields).toHaveBeenCalledTimes(1);
                });
            });

            describe("Functions that the form has fields", function(){
                beforeEach(function(){
                    newCreateForm = new CreateForm({
                        model: new Form()
                    });
                });

                it("removes the new row from the DOM successfully when removeRow is called", function () {
                    // hint: first call newCreateForm.addFieldButton() and then
                    // make sure that there's a ".remove-row" in the DOM. Then call
                    // newCreateForm.removeRow() and make sure there's not a ".remove-row" in
                    // the DOM

                    // Work in progress
                    fixture = setFixtures('<div></div>').append(newCreateForm.$el);
                    expect(CreateForm.prototype.removeRow).toHaveBeenCalledTimes(0);
                    expect(CreateForm.prototype.addFieldButton).toHaveBeenCalledTimes(0);

                    //add a new row by triggering the '.new_field_button click'
                    fixture.find('.new_field_button').trigger('click');
                    expect(CreateForm.prototype.addFieldButton).toHaveBeenCalledTimes(1);
                    expect(fixture.find('.remove-row')).toBeInDOM();
                    expect(fixture.find('.remove-row').html()).not.toBeUndefined();
                    console.log(fixture.find('.remove-row').html());

                    //remove new row by triggering '.remove-row click' 
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
                });
            });
        });
    }
);
