/*
  Still making changes so that the choices and ratings can be used for the tests
*/

var rootDir = "../../";
define([
    "jquery",
    "backbone",
    rootDir + "models/record",
    rootDir + "lib/forms/backbone-form",
    rootDir + "apps/gallery/views/data-detail", // Maybe needed???
    "tests/spec-helper"
],
    function ($, Backbone, Record, DataForm, DataDetail) {
        'use strict';
        var fixture,
            initRecord,
            initSpies,
            record,
            form;

        initSpies = function () {
            /*
            spyOn(DateTimePicker.prototype, 'initialize').and.callThrough();
            spyOn(DateTimePicker.prototype, 'dateTimeValidator').and.callThrough();
            spyOn(Pikaday.prototype, 'show').and.callThrough();
            spyOn(Pikaday.prototype, 'hide').and.callThrough();
            */
        };
        initRecord = function (scope, choice) {
            //create the simplest record possible:
            //step 1: create a form with fields:
            var form_fields = [{
                "id": 1,
                "form": 1,
                "col_alias": "Choice Test",
                "col_name": "choice_test",
                "ordering": 1,
                "data_type": "choice",
                "url": "http://localhost:7777/api/0/forms/1/fields/1",
                "val": choice,
                "extras": JSON.stringify([
                    { "name": "Alpha" },
                    { "name": "Beta" }
                ])
            }];
            //step 2: create a record with the appropriate "choice" type:
            record = new Record({
                id: 1,
                choice_test: choice,
                display_name: choice,
                project_id: 1,
                overlay_type: "form_1",
                fields: form_fields
            });
            //step 3: create a Backbone form to allow the user to do data entry
            //        (inside of the data-detail.js file):
            console.log(record.getFormSchema());
            form = new DataForm({
                model: record,
                schema: record.getFormSchema(),
                app: scope.app
            });
            form.render();
            fixture = setFixtures("<div></div>").append(form.$el);
        };

        describe("Form: Choice Editor Test: Initializes and Renders Correctly", function () {
            beforeEach(function () {
                initSpies();
            });

            it("Initializes correctly", function () {
                initRecord(this, "Alpha");
                expect(form.schema).toEqual(record.getFormSchema());
                expect(form.model).toEqual(record);
            });

            it("Renders all controls correctly", function () {
                initRecord(this, "Alpha");
                // Need more specifics before expanding on the tests
                expect(fixture).toContainElement("select > option");
                expect(fixture.find('select > option').length).toEqual(2);
                expect($(fixture.find('select > option')[0]).val()).toEqual("Alpha");
                expect($(fixture.find('select > option')[1]).val()).toEqual("Beta");
            });

            it("Make sure selected matches Alpha", function () {
                initRecord(this, "Alpha");
                expect(1).toEqual(-1);
            });

            it("Make sure selected matches Beta", function () {
                initRecord(this, "Beta");
                expect(1).toEqual(-1);
            });
        });

        describe("Form Saves Data Correctly", function () {
            beforeEach(function () {
                initSpies();
            });

            it("Make sure selected matches Beta", function () {
                initRecord(this, "Alpha");
                fixture.find('select').val("Beta");
                var errors = form.commit({ validate: true });
                expect(record.get("choice_test")).toEqual("Beta");
                expect(errors).toBeUndefined();
            });

            it("Make sure that form validates correctly and throws error", function () {
                initRecord(this, "Alpha");
                fixture.find('select').val("Beta");
                var errors = form.commit({ validate: true });
                expect(record.get("choice_test")).toEqual("Delta");
                expect(1).toEqual(-1);
            });
        });

    });
