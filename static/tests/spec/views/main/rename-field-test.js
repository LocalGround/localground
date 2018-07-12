var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/spreadsheet/rename-field",
    "tests/spec-helper1"
],
    function (Backbone, RenameField) {
        'use strict';

        const initView = function (scope) {
            scope.model = scope.dataManager.getMaps().at(0);
            spyOn(scope.model.collection, 'trigger');
            spyOn(RenameField.prototype, 'initialize').and.callThrough();
            spyOn(RenameField.prototype, 'saveField').and.callThrough();
            spyOn(RenameField.prototype, 'reloadDataset').and.callThrough();
            spyOn(RenameField.prototype, 'reloadDependentLayers').and.callThrough();
            spyOn(RenameField.prototype, 'updateModal').and.callThrough();
            spyOn(scope.app.vent, 'trigger');

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
            it('saveField() should work', function () {
                expect(1).toEqual(-1);
            });
            it('reloadDataset() should work', function () {
                expect(1).toEqual(-1);
            });
            it('reloadDependentLayers() should work', function () {
                expect(1).toEqual(-1);
            });
            it('updateModal() should work', function () {
                expect(1).toEqual(-1);
            });
        });

        describe('RenameField: rendering: ', function () {
            it('should render correctly', function () {
                expect(1).toEqual(-1);
            });

        });

        // describe("EditMapForm: renderer & user events", function () {
        //     beforeEach(function () {
        //         initView(this);
        //     });
        //
        //     it("should have all form elements", function () {
        //         this.view.render();
        //         const $el = this.view.$el;
        //         expect($el.find('#map-name').val()).toEqual('Map 3');
        //         expect($el.find('#map-caption').val()).toEqual('');
        //     })
        //
        //     it("If map title empty, the form should display an error", function () {
        //         this.view.render();
        //         const $el = this.view.$el;
        //         expect(Map.prototype.save).toHaveBeenCalledTimes(0);
        //         expect(this.noErrorFound('#map-name')).toBeTruthy();
        //         $el.find('#map-name').val('');
        //         $el.find('#map-caption').val('Some description');
        //         this.view.saveMap();
        //
        //
        //         expect(this.errorDisplaysCorrectly(
        //             '#map-name', 'A valid map name is required')).toBeTruthy();
        //
        //         //persists the caption:
        //         expect($el.find('#map-caption').val()).toEqual('Some description');
        //         expect(Map.prototype.save).toHaveBeenCalledTimes(0);
        //     });
        //
        // });
        //
        // describe("EditMapForm: validated form sets model data correctly", function () {
        //     beforeEach(function () {
        //         initView(this);
        //     });
        //
        //     it("Should update map model if form data valid", function () {
        //         this.view.render();
        //         const $el = this.view.$el;expect(Map.prototype.save).toHaveBeenCalledTimes(0);
        //         $el.find('#map-name').val('My Favorite Flowers');
        //         $el.find('#map-caption').val('Some description');
        //         this.view.saveMap();
        //
        //         expect(Map.prototype.save).toHaveBeenCalledTimes(1);
        //         expect(this.view.model.get('name')).toEqual('My Favorite Flowers');
        //         expect(this.view.model.get('caption')).toEqual('Some description');
        //     });
        //
        //
        //     it("Should navigate to new map and close form upon success", function () {
        //
        //         expect(this.model.collection.trigger).not.toHaveBeenCalledWith('update');
        //         expect(this.app.vent.trigger).not.toHaveBeenCalledWith('close-modal');                expect(this.model.collection.trigger).toHaveBeenCalledTimes(0);
        //         this.view.model.set("id", 999);
        //         this.view.model.set("name", 'My Favorite Flowers');
        //         this.view.model.set("caption", 'Some description');
        //
        //         this.view.updateMapName();
        //
        //         //expect(this.app.vent.trigger).toHaveBeenCalledTimes(1);
        //         expect(this.app.vent.trigger).toHaveBeenCalledWith('close-modal');
        //         expect(this.model.collection.trigger).toHaveBeenCalledWith('update');
        //     });
        //
        // });
    });
