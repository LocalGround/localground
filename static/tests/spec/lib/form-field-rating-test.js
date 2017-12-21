/*
  Still making changes so that the ratings and ratings can be used for the tests
*/

var rootDir = "../../";
define([
    "jquery",
    rootDir + "models/record",
    rootDir + "lib/forms/backbone-form",
    "tests/spec-helper"
],
    function ($, Record, DataForm) {
        'use strict';
        var fixture,
            initRecord,
            record,
            form;

        initRecord = function (scope, rating) {
            //create the simplest record possible:
            //step 1: create a form with fields:
            var form_fields = [{
                "id": 1,
                "form": 1,
                "col_alias": "rating Test",
                "col_name": "rating_test",
                "ordering": 1,
                "data_type": "rating",
                "url": "http://localhost:7777/api/0/datasets/1/fields/1",
                "val": rating,
                "extras": JSON.stringify([
                    { "name": "One", "value": 1},
                    { "name": "Two", "value": 2}
                ])
            }];
            //step 2: create a record with the appropriate "rating" type:
            record = new Record({
                id: 1,
                rating_test: rating,
                display_name: rating,
                project_id: 1,
                overlay_type: "form_1",
                fields: form_fields
            });
            //step 3: create a Backbone form to allow the user to do data entry
            //        (inside of the data-detail.js file):
            form = new DataForm({
                model: record,
                schema: record.getFormSchema(),
                app: scope.app
            });
            form.render();
            fixture = setFixtures("<div></div>").append(form.$el);
        };

        describe("Form: Rating Editor Test: Initializes and Renders Correctly", function () {

            it("Initializes correctly", function () {
                initRecord(this, 1);
                expect(form.schema).toEqual(record.getFormSchema());
                expect(form.model).toEqual(record);
            });

            it("Renders all controls correctly", function () {
                initRecord(this, 1);
                expect(fixture).toContainElement("select > option");
                expect(fixture.find('select > option').length).toEqual(2);
                expect($(fixture.find('select > option')[0]).text()).toEqual("One");
                expect($(fixture.find('select > option')[1]).text()).toEqual("Two");
                expect($(fixture.find('select > option')[0]).val()).toEqual("1");
                expect($(fixture.find('select > option')[1]).val()).toEqual("2");
            });

            it("Make sure selected matches One", function () {
                initRecord(this, 1);
                expect($(fixture.find('select > option:selected')).val()).toEqual("1");
            });

            it("Make sure selected matches Two", function () {
                initRecord(this, 2);
                expect($(fixture.find('select > option:selected')).val()).toEqual("2");
            });
        });
        describe("Form: Rating Editor Test: Saves Data Correctly", function () {

            it("Make sure selected matches Two after after switching option", function () {
                initRecord(this, 1);
                expect(record.get("rating_test")).toEqual(1);
                fixture.find('select').val("2");
                var errors = form.commit({ validate: true });
                expect(record.get("rating_test")).toEqual(2);
                expect(errors).toBeUndefined();
            });

        });

    });
