define(["underscore",
        "jquery",
        "views/prints/printForm",
        "config",
        "../../../test/spec-helper"],
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
            var printForm;
            var printFormOpts;

            it("Initializes correctly when loaded with valid parameters", function () {
                var that = this;
                expect(function () {
                    printFormOpts = getPrintFormParams.call(that);
                    printForm = new PrintForm(printFormOpts);
                }).not.toThrow();
            });
            describe("Functionality:", function() {
                beforeEach(function() {
                    var that = this;
                    printFormOpts = getPrintFormParams.call(this);
                    printForm = new PrintForm(printFormOpts);
                    setFixtures(printForm.render().$el)
                });

                it("correctly triggers layout change", function () {
                    printForm.$el.find('#portrait').click();
                    expect(printFormOpts.controller.trigger).toHaveBeenCalledWith('change-layout', 'portrait');
                });

                it("correctly populates project menu", function () {
                    var i,
                    that = this;
                    this.projectsLite.each(function(project) {
                        var projectOption = printForm.ui.projectSelection.find('[value=' + project.get('id') +']');
                        expect(projectOption).toExist();
                        expect(projectOption.text()).toEqual(project.get('name'));
                    });
                });

                it("correctly triggers print generation", function () {
                    printForm.$el.find('#submit').click();
                    expect(printFormOpts.controller.trigger).toHaveBeenCalledWith('generatePrint');
                });

                it("correctly returns form data", function () {
                    var formData;

                    formData = printForm.getFormData();
                    expect(formData.orientation).toEqual('landscape');
                    expect(formData.project_id).toEqual('1')

                    printForm.$el.find('#portrait').click();
                    this.app.setActiveProjectID(2);                    
                    formData = printForm.getFormData();
                    expect(formData.orientation).toEqual('portrait');
                    expect(formData.project_id).toEqual('2')
                });

            });
                

           


        }); 


    });