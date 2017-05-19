var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/gallery/views/create-form",
    rootDir + "apps/gallery/views/field-child-view",
    rootDir + "models/field",
    "tests/spec-helper"
],
    function ($, CreateForm, FieldChildView, Field) {
        'use strict';
        var fixture, formView, fieldView, initSpies, createExistingFieldView, createNewFieldView;

        initSpies = function () {
            //error catch functions
            spyOn(FieldChildView.prototype, 'initialize').and.callThrough();
            spyOn(FieldChildView.prototype, 'render').and.callThrough();
            spyOn(FieldChildView.prototype, 'doDelete').and.callThrough();
            spyOn(FieldChildView.prototype, 'validate').and.callThrough();

            spyOn(FieldChildView.prototype, 'setRatingsFromModel').and.callThrough();
            spyOn(FieldChildView.prototype, 'saveNewRating').and.callThrough();
            spyOn(FieldChildView.prototype, 'removeRating').and.callThrough();
            spyOn(FieldChildView.prototype, 'updateRatingList').and.callThrough();
            spyOn(FieldChildView.prototype, 'addNewRating').and.callThrough();
            spyOn(FieldChildView.prototype, 'saveRatingsToModel').and.callThrough();
            spyOn(FieldChildView.prototype, 'validateRating').and.callThrough();

            spyOn(Field.prototype, 'destroy');

        };

        createExistingFieldView = function (scope) {
            var opts = {};
            _.extend(opts, scope.form.toJSON(), {
                model: scope.form.fields.at(0),
                parent: new CreateForm({
                    model: scope.form
                })
            });
            fieldView = new FieldChildView(opts);
            fieldView.render();
        };

        createNewFieldView = function (scope) {
            var opts = {};
            _.extend(opts, scope.form.toJSON(), {
                model: new Field({}, {id: scope.form.id }),
                parent: new CreateForm({
                    model: scope.form
                })
            });
            fieldView = new FieldChildView(opts);
            fieldView.render();
        };

        describe("Create Form Fields: Initialization Tests", function () {
            beforeEach(function () {
                initSpies();
            });

            it("Three fields successfully created", function () {
                expect(FieldChildView.prototype.initialize).toHaveBeenCalledTimes(0);
                expect(FieldChildView.prototype.render).toHaveBeenCalledTimes(0);
                formView = new CreateForm({
                    model: this.form
                });
                fixture = setFixtures('<div></div>').append(formView.$el);
                expect(FieldChildView.prototype.initialize).toHaveBeenCalledTimes(3);
                expect(FieldChildView.prototype.render).toHaveBeenCalledTimes(3);
            });

             it("Creates field and sets variables", function () {
                var opts = {};
                _.extend(opts, this.form.toJSON(), {
                    model: this.form.fields.at(0)
                });
                expect(FieldChildView.prototype.initialize).toHaveBeenCalledTimes(0);
                fieldView = new FieldChildView(opts);
                expect(FieldChildView.prototype.initialize).toHaveBeenCalledTimes(1);
                expect(fieldView.model).toBe(this.form.fields.at(0));
            });
        });

        describe("Create Form Fields: Render Tests", function () {
            beforeEach(function () {
                initSpies();
            });
            it("Renders child HTML", function () {
                var opts = {}, field = this.form.fields.at(0);
                _.extend(opts, this.form.toJSON(), {
                    model: field
                });
                expect(FieldChildView.prototype.render).toHaveBeenCalledTimes(0);
                fieldView = new FieldChildView(opts);
                fieldView.render();
                expect(FieldChildView.prototype.render).toHaveBeenCalledTimes(1);

                //check HTML in DOM:
                console.log(fieldView.$el.html());
                expect(fieldView.$el).toEqual("tr");
                expect(fieldView.$el).toContainElement(".fa-grip");
                expect(fieldView.$el).toContainElement("input.fieldname");
                expect(fieldView.$el).toContainElement("td.form-reorder");
                expect(fieldView.$el).toContainElement("span.fieldType");
                expect(fieldView.$el).toContainElement("a.delete-field");
                expect(fieldView.$el).toContainElement(".display-field");
                expect(fieldView.model.get("is_display_field")).toBe(true);
                expect(fieldView.$el.find('.display-field').is(":checked")).toBeTruthy();
                expect(fieldView.$el.attr('id')).toBe(field.id.toString());
                expect(fieldView.$el.find('select')).not.toExist();
                expect(fieldView.$el.find('input.fieldname').val().trim()).toBe(field.get("col_alias"));
                expect(fieldView.$el.find('span.fieldType').html().trim()).toBe(field.get("data_type"));
                expect(fieldView.$el.find('input.fieldname').val()).toBe(field.get("col_alias"));
            });

            it("If isn't a display field, don't check box", function () {
                var opts = {}, field = this.form.fields.at(1);
                _.extend(opts, this.form.toJSON(), {
                    model: field
                });
                fieldView = new FieldChildView(opts);
                fieldView.render();
                expect(fieldView.$el).toContainElement(".display-field");
                expect(fieldView.model.get("is_display_field")).toBe(false);
                expect(fieldView.$el.find('.display-field').is(":checked")).toBeFalsy();
            });

            it("Don't delete when user cancels confirm dialog", function () {
                var opts = {}, field = this.form.fields.at(0);
                _.extend(opts, this.form.toJSON(), {
                    model: field
                });
                spyOn(window, 'confirm').and.returnValue(false);
                expect(FieldChildView.prototype.doDelete).toHaveBeenCalledTimes(0);
                expect(Field.prototype.destroy).toHaveBeenCalledTimes(0);
                fieldView = new FieldChildView(opts);
                fieldView.render();
                fixture = setFixtures('<div></div>').append(fieldView.$el);
                fieldView.$el.find('a.delete-field').trigger('click');
                expect(FieldChildView.prototype.doDelete).toHaveBeenCalledTimes(1);
                expect(Field.prototype.destroy).toHaveBeenCalledTimes(0);
            });

            it("Delete when user cancels confirm dialog", function () {
                var opts = {}, field = this.form.fields.at(0);
                _.extend(opts, this.form.toJSON(), {
                    model: field
                });
                spyOn(window, 'confirm').and.returnValue(true);
                expect(FieldChildView.prototype.doDelete).toHaveBeenCalledTimes(0);
                expect(Field.prototype.destroy).toHaveBeenCalledTimes(0);
                fieldView = new FieldChildView(opts);
                fieldView.render();
                fixture = setFixtures('<div></div>').append(fieldView.$el);
                expect(fieldView.$el).toBeInDOM();
                fieldView.$el.find('a.delete-field').trigger('click');
                expect(FieldChildView.prototype.doDelete).toHaveBeenCalledTimes(1);
                expect(Field.prototype.destroy).toHaveBeenCalledTimes(1);
                expect(fieldView.$el).not.toBeInDOM();
            });

            it("If fieldname is blank, it shows an error", function () {
                createExistingFieldView(this);
                expect(FieldChildView.prototype.validate).toHaveBeenCalledTimes(0);
                fixture = setFixtures("<div></div>").append(fieldView.$el);
                fixture.find(".fieldname").val("").trigger('blur');
                fieldView.saveField();
                expect(FieldChildView.prototype.validate).toHaveBeenCalledTimes(1);
                expect(fieldView.$el.hasClass("failure-message")).toBeTruthy();
                expect($(fieldView.$el.find('span')[0]).html()).toBe("Field Name Missing");
            });

            it("If fieldtype is blank, it shows an error", function () {
                createNewFieldView(this);
                fieldView.$el.find("select").val("-1");
                fieldView.saveField(1);
                expect(fieldView.$el.hasClass("failure-message")).toBeTruthy();
                expect($(fieldView.$el.find('span')[0]).html()).toBe("Field Name Missing");
                expect($(fieldView.$el.find('span')[1]).html()).toBe("Field Type Missing");
            });
        });


        describe("Radio button switch test", function () {
            beforeEach(function () {
                initSpies();
            });
            it("Renders child HTML", function () {
                var opts = {}, field = this.form.fields.at(1);
                _.extend(opts, this.form.toJSON(), {
                    model: field,
                    parent: new CreateForm({
                        model: this.form
                    })
                });
                fieldView = new FieldChildView(opts);
                fieldView.render();
                fixture = setFixtures('<div></div>').append(fieldView.$el);
                expect(fieldView.model.get("is_display_field")).toBeFalsy();
                expect(fieldView.$el.find('.display-field').is(":checked")).toBeFalsy();
                fieldView.$el.find('.display-field').trigger('click');
                fieldView.saveField();
                expect(fieldView.$el.find('.display-field').is(":checked")).toBeTruthy();
            });
        });

        describe("Ratings Test", function(){
            beforeEach(function(){
                initSpies();
                var opts = {}, field = this.form.fields.at(2);
                _.extend(opts, this.form.toJSON(), {
                    model: field,
                    parent: new CreateForm({
                        model: this.form
                    })
                });
                fieldView = new FieldChildView(opts);
                fieldView.render();
                fixture = setFixtures('<div></div>').append(fieldView.$el);

            });

            it("Successfully loads the ratings list onto the field", function(){

                var field = this.form.fields.at(2);
                expect(fieldView.model).toEqual(field);

                expect(fieldView.model.get("extras")).toEqual(field.get("extras"));

                console.log(field);
                console.log(fixture.find(".rating-row"));
                console.log(field.get("extras"));
                console.log(fixture.find(".rating-row").length);
                console.log(field.get("extras").length);

                expect(fixture.find(".rating-row").length).toEqual(field.get("extras").length);
                expect(fixture.find(".rating-row").length).toEqual(3);


            });

            it ("Successfully adds a new rating to the list", function(){
                //
            });
        });
    });
