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

        describe('AddField: instance methods: ', function () {
            beforeEach(function () {
                initView(this);
            });
            it("works", function () {
                expect(1).toEqual(1);
            });

        //     it('reloadDataset() should work', function () {
        //         expect(this.dataset.fetch).toHaveBeenCalledTimes(0);
        //         expect(this.view.reloadDependentLayers).toHaveBeenCalledTimes(0);
        //         this.view.reloadDataset();
        //         expect(this.dataset.fetch).toHaveBeenCalledTimes(1);
        //         expect(this.view.reloadDependentLayers).toHaveBeenCalledTimes(1);
        //     });
        //
        //     it('reloadDependentLayers() should not refresh if field name did not change', function () {
        //         expect(this.dataset.getDependentLayers).toHaveBeenCalledTimes(0);
        //         expect(Layers.prototype.forEach).toHaveBeenCalledTimes(0);
        //         expect(Layer.prototype.hasFieldDependency).toHaveBeenCalledTimes(0);
        //         expect(Layer.prototype.getGroupByField).toHaveBeenCalledTimes(1);
        //         expect(Layer.prototype.refreshFromServer).toHaveBeenCalledTimes(0);
        //
        //         this.view.reloadDependentLayers();
        //         expect(this.dataset.getDependentLayers).toHaveBeenCalledTimes(1);
        //         expect(Layers.prototype.forEach).toHaveBeenCalledTimes(1);
        //         expect(Layer.prototype.hasFieldDependency).toHaveBeenCalledTimes(3);
        //         expect(Layer.prototype.getGroupByField).toHaveBeenCalledTimes(3);
        //         expect(Layer.prototype.refreshFromServer).toHaveBeenCalledTimes(0);
        //     });
        //
        //
        //     it('reloadDependentLayers() should  refresh if field name changed', function () {
        //         expect(this.dataset.getDependentLayers).toHaveBeenCalledTimes(0);
        //         expect(Layers.prototype.forEach).toHaveBeenCalledTimes(0);
        //         expect(Layer.prototype.hasFieldDependency).toHaveBeenCalledTimes(0);
        //         expect(Layer.prototype.getGroupByField).toHaveBeenCalledTimes(1);
        //         expect(Layer.prototype.refreshFromServer).toHaveBeenCalledTimes(0);
        //
        //         this.field.set('col_alias', 'species');
        //         this.field.set('col_name', 'species');
        //         this.view.reloadDependentLayers();
        //
        //         expect(this.dataset.getDependentLayers).toHaveBeenCalledTimes(1);
        //         expect(Layers.prototype.forEach).toHaveBeenCalledTimes(1);
        //         expect(Layer.prototype.hasFieldDependency).toHaveBeenCalledTimes(3);
        //         expect(Layer.prototype.getGroupByField).toHaveBeenCalledTimes(3);
        //         expect(Layer.prototype.refreshFromServer).toHaveBeenCalledTimes(1);
        //     });
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
                    choice: "Choice",
                    date: "Date",
                    time: "Time"
                });
            });

            // it("If column name is empty, the form should display an error", function () {
            //     this.view.render();
            //     const $el = this.view.$el;
            //     expect(this.view.model.save).toHaveBeenCalledTimes(0);
            //     expect(this.noErrorFound('#col_alias')).toBeTruthy();
            //     $el.find('#col_alias').val('');
            //     this.view.saveField();
            //
            //
            //     expect(this.errorDisplaysCorrectly(
            //         '#col_alias', 'A valid column name is required')).toBeTruthy();
            //
            //     expect(this.view.model.save).toHaveBeenCalledTimes(0);
            // });
            //
            // it("If column name is valid, the form should save data to the model", function () {
            //     this.view.render();
            //     expect(this.app.vent.trigger).not.toHaveBeenCalledWith('field-updated');
            //     expect(RenameField.prototype.reloadDataset).toHaveBeenCalledTimes(0);
            //     expect(this.view.sourceModal.hide).toHaveBeenCalledTimes(0);
            //     const $el = this.view.$el;
            //     expect(this.view.model.save).toHaveBeenCalledTimes(0);
            //     expect(this.noErrorFound('#col_alias')).toBeTruthy();
            //     $el.find('#col_alias').val('Species');
            //     this.view.saveField();
            //
            //     expect(this.view.model.save).toHaveBeenCalledTimes(1);
            //     expect(this.view.model.get('col_alias')).toEqual('Species');
            //     expect(RenameField.prototype.reloadDataset).toHaveBeenCalledTimes(1);
            //     expect(this.app.vent.trigger).toHaveBeenCalledWith('field-updated');
            //     expect(this.view.sourceModal.hide).toHaveBeenCalledTimes(1);
            // });

        });

    });
