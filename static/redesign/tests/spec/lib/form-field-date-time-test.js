var rootDir = "../../";
define([
    "jquery",
    rootDir + "models/record",
    rootDir + "models/form",
    rootDir + "lib/forms/backbone-form",
    "tests/spec-helper"
],
    function ($, Record, FormModel, DataForm) {
        'use strict';
        var fixture, initRecordAndForm, initSpies, record, formModel, form;

        initSpies = function () {
            //spyOn(ProjectUserView.prototype,'doDelete').and.callThrough();
            //spyOn(ProjectUser.prototype,'destroy').and.callThrough();
        };
        initRecordAndForm = function (scope) {
            var dateTime = '2017-04-28T22:25:51';
            formModel = new FormModel({
                "url": "http://localhost:7777/api/0/forms/1/",
                "id": 1,
                "name": "Test Form",
                "caption": "",
                "overlay_type": "form",
                "tags": [],
                "owner": "MrJBRPG",
                "data_url": "http://localhost:7777/api/0/forms/1/data/",
                "fields_url": "http://localhost:7777/api/0/forms/1/fields/",
                "slug": "slug_64358",
                "project_ids": [ 1 ],
                "fields": [
                    {
                        "id": 1,
                        "form": 1,
                        "col_alias": "DateTime Test",
                        "col_name": "datetime_test",
                        "is_display_field": true,
                        "ordering": 1,
                        "data_type": "date-time",
                        "url": "http://localhost:7777/api/0/forms/1/fields/1"
                    }]
            });
            formModel.fields.at(0).set("val", dateTime);
            record = new Record({
                id: 1,
                datetime_test: dateTime,
                display_name: dateTime,
                tags: ['my house'],
                project_id: 1,
                overlay_type: "form_1",
                geometry: {"type": "Point", "coordinates": [-122.294, 37.864]},
                photo_count: 3,
                audio_count: 1,
                fields: formModel.fields.toJSON()
            });
            form = new DataForm({
                model: record,
                schema: record.getFormSchema(),
                app: scope.app
            });
            form.render();
            fixture = setFixtures("<div></div>").append(form.$el);
        };

        describe("Initialize Record and Form", function () {
            beforeEach(function () {
                initSpies();
                initRecordAndForm(this);
            });

            it("Initializes correctly", function () {
                expect(form.schema).toEqual(record.getFormSchema());
                expect(form.model).toEqual(record);
                console.log(form.$el.html());
            });
        });
    });
