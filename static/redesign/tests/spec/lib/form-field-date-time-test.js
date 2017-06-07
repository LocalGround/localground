var rootDir = "../../";
define([
    "jquery",
    "backbone",
    rootDir + "models/record",
    rootDir + "lib/forms/backbone-form",
    "https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.6.0/pikaday.min.js",
    "tests/spec-helper"
],
    function ($, Backbone, Record, DataForm, Pikaday) {
        'use strict';
        var fixture,
            initRecord,
            initSpies,
            record,
            form,
            timeAM = '2017-04-21T03:25:51',
            timePM = '2017-04-21T23:25:51',
            DateTimePicker = Backbone.Form.editors.DateTimePicker;

        initSpies = function () {
            spyOn(DateTimePicker.prototype, 'initialize').and.callThrough();
            spyOn(DateTimePicker.prototype, 'dateTimeValidator').and.callThrough();
            spyOn(Pikaday.prototype, 'show').and.callThrough();
            spyOn(Pikaday.prototype, 'hide').and.callThrough();
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
                    "col_alias": "DateTime Test",
                    "col_name": "datetime_test",
                    "ordering": 1,
                    "data_type": "date-time",
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

        describe("Form: DateTime Editor Test: Initializes and Renders Correctly", function () {
            beforeEach(function () {
                initSpies();
            });

            afterEach(function () {
                $('.pika-single').remove();
            });

            it("Initializes correctly", function () {
                initRecord(this, timeAM);
                expect(form.schema).toEqual(record.getFormSchema());
                expect(form.model).toEqual(record);
                expect(DateTimePicker.prototype.initialize).toHaveBeenCalledTimes(1);
            });

            it("Renders all controls", function () {
                initRecord(this, timeAM);
                expect(fixture).toContainElement("input.datepicker");
                expect(fixture).toContainElement("table.time-table");
                expect(fixture).toContainElement("input.hours");
                expect(fixture).toContainElement("input.minutes");
                expect(fixture).toContainElement("input.seconds");
                expect(fixture).toContainElement("select.am_pm");
                //TODO: John, check for all inputs
                //expect(1).toEqual(-1);
            });

            it("Sets all form values correctly when time is AM value", function () {
                //NOTE: '2017-04-21T03:25:51'
                initRecord(this, timeAM);
                expect(fixture.find("input.datepicker").val()).toEqual("2017-04-21");
                expect(fixture.find("input.hours").val()).toEqual("03");
                expect(fixture.find("input.minutes").val()).toEqual("25");
                expect(fixture.find("input.seconds").val()).toEqual("51");
                expect(fixture.find("select.am_pm").val()).toEqual("AM");
            });

            it("Sets all form values correctly when time is PM value", function () {
                //NOTE: '2017-04-21T23:25:51'
                initRecord(this, timePM);
                expect(fixture.find("input.datepicker").val()).toEqual("2017-04-21");
                expect(fixture.find("input.hours").val()).toEqual("11");
                expect(fixture.find("input.minutes").val()).toEqual("25");
                expect(fixture.find("input.seconds").val()).toEqual("51");
                expect(fixture.find("select.am_pm").val()).toEqual("PM");
            });

            it("Sets all form values to empty when time is null value", function () {
                initRecord(this, null);
                expect(fixture.find("input.datepicker").val()).toEqual("");
                expect(fixture.find("input.hours").val()).toEqual("00");
                expect(fixture.find("input.minutes").val()).toEqual("00");
                expect(fixture.find("input.seconds").val()).toEqual("00");
                expect(fixture.find("select.am_pm").val()).toEqual("AM");
            });


            it("Tests for no zero padding if hour is 10 or 11 at AM", function () {
                initRecord(this, '2017-04-21T11:00:00');
                expect(fixture.find("input.hours").val()).toEqual("11");
                expect(fixture.find("select.am_pm").val()).toEqual("AM");
            });

            it("Tests for zero padding if hour is less than 10 at AM", function () {
                initRecord(this, '2017-04-21T09:00:00');
                expect(fixture.find("input.hours").val()).toEqual("09");
                expect(fixture.find("select.am_pm").val()).toEqual("AM");
            });

            it("Tests for hour being less than 12 at PM", function () {
                initRecord(this, '2017-04-21T15:00:00');
                expect(fixture.find("input.hours").val()).toEqual("03");
                expect(fixture.find("select.am_pm").val()).toEqual("PM");
            });

            it("Tests for hour being 12 at PM", function () {
                initRecord(this, '2017-04-21T12:00:00');
                expect(fixture.find("input.hours").val()).toEqual("12");
                expect(fixture.find("select.am_pm").val()).toEqual("PM");
            });

            it("Tests for hour being 12 at AM", function () {
                initRecord(this, '2017-04-21T00:00:00');
                expect(fixture.find("input.hours").val()).toEqual("12");
                expect(fixture.find("select.am_pm").val()).toEqual("AM");
            });

            it("Triggers the calendar popup when the user clicks on the calendar", function () {
                initRecord(this, null);
                expect(Pikaday.prototype.show).toHaveBeenCalledTimes(0);
                expect(Pikaday.prototype.hide).toHaveBeenCalledTimes(1);

                //click input and make sure calendar appears:
                fixture.find("input.datepicker").trigger("click");
                expect(Pikaday.prototype.show).toHaveBeenCalledTimes(1);
                expect(Pikaday.prototype.hide).toHaveBeenCalledTimes(1);

                //click outside the input and make sure calendar disappears:
                fixture.trigger("click");
                expect(Pikaday.prototype.show).toHaveBeenCalledTimes(1);
                expect(Pikaday.prototype.hide).toHaveBeenCalledTimes(2);
            });
        });

        describe("Form: DateTime Editor Test: User makes changes to input", function () {
            beforeEach(function () {
                initSpies();
            });

            afterEach(function () {
                $('.pika-single').remove();
            });

            describe("Valid Date Changes through various ways", function(){
                it("Saves date correctly when user makes a valid time change with single digits", function () {
                    initRecord(this, timeAM);
                    expect(DateTimePicker.prototype.dateTimeValidator).toHaveBeenCalledTimes(0);
                    fixture.find('input.hours').val("3");
                    fixture.find('input.minutes').val("2");
                    fixture.find('input.seconds').val("1");
                    var errors = form.commit({ validate: true });
                    expect(DateTimePicker.prototype.dateTimeValidator).toHaveBeenCalledTimes(1);
                    expect(errors).toBeUndefined();
                });

                it("Keeps date correctly when user makes a valid date change through date input", function () {
                    initRecord(this, timeAM);
                    var oldDate = fixture.find("input.datepicker").val();
                    var newDate = "2017-04-22";
                    DateTimePicker.$el.find("input.datepicker").trigger("click");
                    expect(fixture.find("input.datepicker").val).not.toEqual(newDate);
                    fixture.find('input.datepicker').val(newDate);
                    expect(fixture.find("input.datepicker").val).toEqual(newDate);
                    DateTimePicker.$el.find("input.datepicker").trigger("blur");
                    expect(fixture.find("input.datepicker").val).toEqual(newDate);
                    var errors = form.commit({ validate: true });
                    expect(errors).toBeUndefined();
                });

            });


        });
    });
