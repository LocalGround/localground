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
            spyOn(Form.prototype, "getFields").and.callThrough();
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
                expect(Form.prototype.getFields).toHaveBeenCalledTimes(0);
            });
        });
    });
