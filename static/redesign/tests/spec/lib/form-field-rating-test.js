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
        initRecord = function (scope, t) {
            //create the simplest record possible:
            record = new Record({
                id: 1,
                datetime_test: t,
                display_name: t,
                project_id: 1,
                overlay_type: "form_1",
                fields: [{
                    "id": 1,
                    "form": 1,
                    "col_alias": "Rating Test",
                    "col_name": "rating_test",
                    "ordering": 1,
                    "data_type": "rating",
                    "url": "http://localhost:7777/api/0/forms/1/fields/1",
                    "val": t
                }]
            });
            form = new DataForm({
                model: record,
                schema: record.getFormSchema(),
                app: scope.app
            });
            form.render();
            fixture = setFixtures("<div></div>").append(form.$el);
        };

        describe("Form: Rating Editor Test: Initializes and Renders Correctly", function () {
            beforeEach(function () {
                initSpies();
                initRecord();
            });



            it("Initializes correctly", function () {
                expect(form.schema).toEqual(record.getFormSchema());
                expect(form.model).toEqual(record);
                expect(DateTimePicker.prototype.initialize).toHaveBeenCalledTimes(1);
            });

            it("Renders all controls correctly", function(){
                // Need more specifics before expanding on the tests
                expect(fixture).toContainElement("select:option");
                expect("Need to specify Rating Render Controls Test").toEqual(-1);
            });

        });

    });
