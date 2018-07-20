var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/spreadsheet/rename-field",
    rootDir + 'models/layer',
    rootDir + 'collections/layers',
    "tests/spec-helper1"
],
    function (Backbone, RenameField, Layer, Layers) {
        'use strict';

        const initView = function (scope) {
            spyOn(RenameField.prototype, 'initialize').and.callThrough();
            spyOn(RenameField.prototype, 'saveField').and.callThrough();
            spyOn(RenameField.prototype, 'reloadDataset').and.callThrough();
            spyOn(RenameField.prototype, 'updateModal').and.callThrough();
            spyOn(Layers.prototype, 'forEach').and.callThrough();
            spyOn(Layer.prototype, 'refreshFromServer'); // don't call through
            spyOn(Layer.prototype, 'hasFieldDependency').and.callThrough();
            spyOn(Layer.prototype, 'getGroupByField').and.callThrough();

            scope.layer = scope.categoricalLayer;
            scope.dataset = scope.layer.getDataset(scope.app.dataManager);
            scope.field = scope.layer.getGroupByField(scope.app.dataManager);
            scope.view = new RenameField({
                app: scope.app,
                model: scope.field,
                dataset: scope.dataset,
                sourceModal: scope.app.modal
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
            spyOn(scope.view, 'reloadDependentLayers').and.callThrough();
            spyOn(scope.dataset, 'fetch').and.callThrough();
            spyOn(scope.dataset, 'getDependentLayers').and.callThrough();
            spyOn(scope.view.model, 'save').and.callThrough();

        };

        describe("RenameField: initialization: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(this.field);
            });
        });

        describe('RenameField: instance methods: ', function () {
            beforeEach(function () {
                initView(this);
            });

            it('reloadDataset() should work', function () {
                expect(this.dataset.fetch).toHaveBeenCalledTimes(0);
                expect(this.view.reloadDependentLayers).toHaveBeenCalledTimes(0);
                this.view.reloadDataset();
                expect(this.dataset.fetch).toHaveBeenCalledTimes(1);
                expect(this.view.reloadDependentLayers).toHaveBeenCalledTimes(1);
            });

            it('reloadDependentLayers() should not refresh if field name did not change', function () {
                expect(this.dataset.getDependentLayers).toHaveBeenCalledTimes(0);
                expect(Layers.prototype.forEach).toHaveBeenCalledTimes(0);
                expect(Layer.prototype.hasFieldDependency).toHaveBeenCalledTimes(0);
                expect(Layer.prototype.getGroupByField).toHaveBeenCalledTimes(1);
                expect(Layer.prototype.refreshFromServer).toHaveBeenCalledTimes(0);

                this.view.reloadDependentLayers();
                expect(this.dataset.getDependentLayers).toHaveBeenCalledTimes(1);
                expect(Layers.prototype.forEach).toHaveBeenCalledTimes(1);
                expect(Layer.prototype.hasFieldDependency).toHaveBeenCalledTimes(3);
                expect(Layer.prototype.getGroupByField).toHaveBeenCalledTimes(3);
                expect(Layer.prototype.refreshFromServer).toHaveBeenCalledTimes(0);
            });


            it('reloadDependentLayers() should  refresh if field name changed', function () {
                expect(this.dataset.getDependentLayers).toHaveBeenCalledTimes(0);
                expect(Layers.prototype.forEach).toHaveBeenCalledTimes(0);
                expect(Layer.prototype.hasFieldDependency).toHaveBeenCalledTimes(0);
                expect(Layer.prototype.getGroupByField).toHaveBeenCalledTimes(1);
                expect(Layer.prototype.refreshFromServer).toHaveBeenCalledTimes(0);

                this.field.set('col_alias', 'species');
                this.field.set('col_name', 'species');
                this.view.reloadDependentLayers();

                expect(this.dataset.getDependentLayers).toHaveBeenCalledTimes(1);
                expect(Layers.prototype.forEach).toHaveBeenCalledTimes(1);
                expect(Layer.prototype.hasFieldDependency).toHaveBeenCalledTimes(3);
                expect(Layer.prototype.getGroupByField).toHaveBeenCalledTimes(3);
                expect(Layer.prototype.refreshFromServer).toHaveBeenCalledTimes(1);
            });
        });

        describe('RenameField: rendering: ', function () {

            beforeEach(function () {
                initView(this);
            });

            it('should have all form elements', function () {
                this.view.render();
                const $el = this.view.$el;
                expect($el.find('label').html()).toEqual('Column Name');
                expect($el.find('input').val()).toEqual('Type');
            });

            it("If column name is empty, the form should display an error", function () {
                this.view.render();
                const $el = this.view.$el;
                expect(this.view.model.save).toHaveBeenCalledTimes(0);
                expect(this.noErrorFound('#col_alias')).toBeTruthy();
                $el.find('#col_alias').val('');
                this.view.saveField();


                expect(this.errorDisplaysCorrectly(
                    '#col_alias', 'A valid column name is required')).toBeTruthy();

                expect(this.view.model.save).toHaveBeenCalledTimes(0);
            });

            it("If column name is valid, the form should save data to the model", function () {
                this.view.render();
                expect(this.app.vent.trigger).not.toHaveBeenCalledWith('field-updated');
                expect(RenameField.prototype.reloadDataset).toHaveBeenCalledTimes(0);
                expect(this.view.sourceModal.hide).toHaveBeenCalledTimes(0);
                const $el = this.view.$el;
                expect(this.view.model.save).toHaveBeenCalledTimes(0);
                expect(this.noErrorFound('#col_alias')).toBeTruthy();
                $el.find('#col_alias').val('Species');
                this.view.saveField();

                expect(this.view.model.save).toHaveBeenCalledTimes(1);
                expect(this.view.model.get('col_alias')).toEqual('Species');
                expect(RenameField.prototype.reloadDataset).toHaveBeenCalledTimes(1);
                expect(this.app.vent.trigger).toHaveBeenCalledWith('field-updated');
                expect(this.view.sourceModal.hide).toHaveBeenCalledTimes(1);
            });

        });

    });
