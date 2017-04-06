var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/gallery/views/create-form",
    rootDir + "apps/gallery/views/field-child-view",
    rootDir + "models/form",
    rootDir + "models/field",
    "tests/spec-helper"
],
    function ($, CreateForm, FieldChildView, Form, Field) {
        'use strict';
        var fixture, formView, fieldView, initSpies;

        initSpies = function () {
            //error catch functions
            spyOn(FieldChildView.prototype, 'initialize').and.callThrough();
            spyOn(FieldChildView.prototype, 'render').and.callThrough();
            spyOn(FieldChildView.prototype, 'doDelete').and.callThrough();
            spyOn(Field.prototype, 'destroy');
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
                expect(fieldView.$el).toEqual("tr");
                expect(fieldView.$el).toContainElement(".fa-grip");
                expect(fieldView.$el).toContainElement("input.fieldname");
                expect(fieldView.$el).toContainElement("td.form-reorder");
                expect(fieldView.$el).toContainElement("span.fieldname");
                expect(fieldView.$el).toContainElement("a.delete-field");
                expect(fieldView.$el.attr('id')).toBe(field.id.toString());
                expect(fieldView.$el.find('select')).not.toExist();
                expect(fieldView.$el.find('span.fieldname').html().trim()).toBe(field.get("data_type"));
                expect(fieldView.$el.find('input.fieldname').val()).toBe(field.get("col_alias"));
                expect(fieldView.$el.find('input.display_field_button').prop("checked")\
                    .toBe(field.get("is_display_field"));
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
                console.log(fieldView.$el);
                expect(fieldView.$el).not.toBeInDOM();
            });
        });
    });
