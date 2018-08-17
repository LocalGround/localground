var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/spreadsheet/add-field",
    rootDir + 'models/layer',
    rootDir + 'collections/layers',
    "tests/spec-helper1"
],
    function (Backbone, AddField, Layer, Layers) {
        'use strict';

        const initView = function (scope) {
            // events: {
            //     'change #data_type': 'showDetailedOptions',
            //     'click .add-new-choice': 'addChoice',
            //     'click .remove-choice': 'removeChoice'
            // },
            spyOn(AddField.prototype, 'initialize').and.callThrough();
            spyOn(AddField.prototype, 'getMenuSelection').and.callThrough();
            spyOn(AddField.prototype, 'setDataType').and.callThrough();
            spyOn(AddField.prototype, 'commitData').and.callThrough();
            spyOn(AddField.prototype, 'showDetailedOptions').and.callThrough();
            spyOn(AddField.prototype, 'addChoice').and.callThrough();
            spyOn(AddField.prototype, 'removeChoice').and.callThrough();
            spyOn(AddField.prototype, '_clearErrorMessages').and.callThrough();
            spyOn(AddField.prototype, '_validateColAlias').and.callThrough();
            spyOn(AddField.prototype, '_validateColType').and.callThrough();
            spyOn(AddField.prototype, 'saveField').and.callThrough();
            spyOn(AddField.prototype, 'afterSave').and.callThrough();

            scope.layer = scope.categoricalLayer;
            scope.dataset = scope.layer.getDataset(scope.app.dataManager);
            scope.view = new AddField({
                app: scope.app,
                dataset: scope.dataset,
                sourceModal: scope.app.secondaryModal,
                ordering: 2
            });

            scope.errorDisplaysCorrectly = (selector, message) => {
                const $parent = scope.view.$el.find(selector).parent();
                return $parent.hasClass('error') && $parent.find('p').html() === message;
            };

            scope.noErrorFound = (selector) => {
                return !scope.view.$el.hasClass('error');
            };

            spyOn(scope.app.vent, 'trigger');
            spyOn(scope.view.sourceModal, 'hide');
            spyOn(scope.dataset, 'fetch').and.callThrough();
            spyOn(scope.dataset, 'getDependentLayers').and.callThrough();
            spyOn(scope.view.model, 'save').and.callThrough();

        };

        describe("AddField: initialization: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
            });
        });

        describe('AddField: UI events: ', function () {
            beforeEach(function () {
                initView(this);
            });
            it("datatype_toggle triggers show choices", function () {
                expect(AddField.prototype.showDetailedOptions).toHaveBeenCalledTimes(0);
                this.view.render();
                this.view.$el.find('#data_type').trigger('change');
                expect(AddField.prototype.showDetailedOptions).toHaveBeenCalledTimes(1);
            });
        });

        describe('AddField: instance methods: ', function () {
            beforeEach(function () {
                initView(this);
            });
            it("works", function () {
                expect(1).toEqual(1);
            });
        });

        describe('AddField: rendering: ', function () {

            beforeEach(function () {
                initView(this);
            });

            it('should have all form elements', function () {
                this.view.render();
                const $el = this.view.$el;
                expect($el.find('label').html()).toEqual('Field Name');
                const d = {};
                $el.find('#data_type option').each(function() {
                    d[$(this).val()] = $(this).html();
                });
                expect(d).toEqual({
                    text: "Text",
                    number: "Number",
                    boolean: "Yes / No",
                    choice: "Choice" //,
                    // date: "Date",
                    // time: "Time"
                });
            });

        });

    });
