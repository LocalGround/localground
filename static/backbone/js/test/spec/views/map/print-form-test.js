define(["underscore",
        "jquery",
        "views/prints/printForm",
        "config",
        "../../../../test/spec-helper"],
    function (_, $, PrintForm, Config) {
        'use strict';

        function getPrintFormParams() {
            return {
                availableProjects: this.projectsLite,
                controller: jasmine.createSpyObj('controller', ['trigger']),
                app: this.app
            };
        }

        describe("Print Form:", function () {
            var printForm,
                printFormOpts;

            it("Initializes correctly when loaded with valid parameters", function () {
                var that = this;
                expect(function () {
                    printFormOpts = getPrintFormParams.call(that);
                    printForm = new PrintForm(printFormOpts);
                }).not.toThrow();
            });
            describe("Functionality:", function () {
                beforeEach(function () {
                    printFormOpts = getPrintFormParams.call(this);
                    printForm = new PrintForm(printFormOpts);
                    window.setFixtures(printForm.render().$el);
                });

                it("correctly triggers layout change", function () {
                    printForm.$el.find('#portrait').click();
                    expect(printFormOpts.controller.trigger).toHaveBeenCalledWith('change-layout', 'portrait');
                });

                it("correctly triggers print generation", function () {
                    printForm.$el.find('#submit').click();
                    expect(printFormOpts.controller.trigger).toHaveBeenCalledWith('generatePrint');
                });

                it("correctly returns form data", function () {
                    var formData;
                    formData = printForm.getFormData();
                    expect(formData.layout).toEqual(1);
                    printForm.$el.find('#portrait').click();
                    this.app.setActiveProjectID(2);
                    formData = printForm.getFormData();
                    //console.log(formData);
                    expect(formData.layout).toEqual(2);
                    expect(formData.project_id).toEqual(2);
                });
            });
        });


    });