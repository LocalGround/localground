var rootDir = "../../../";
define([
    "backbone",
    rootDir + "lib/editor-views/edit-map-form",
    rootDir + "models/map",
    "tests/spec-helper1"
],
    function (Backbone, EditMapForm, Map) {
        'use strict';

        const initView = function (scope) {
            scope.model = scope.dataManager.getMaps().at(0);
            spyOn(scope.model.collection, 'trigger');
            spyOn(EditMapForm.prototype, 'initialize').and.callThrough();
            spyOn(EditMapForm.prototype, 'saveMap').and.callThrough();
            spyOn(EditMapForm.prototype, 'updateMapName').and.callThrough();
            spyOn(Map.prototype, 'save');
            spyOn(scope.app.vent, 'trigger');

            scope.view = new EditMapForm({
                app: scope.app,
                model: scope.model
            });

            scope.errorDisplaysCorrectly = (selector, message) => {
                const $parent = scope.view.$el.find(selector).parent();
                return $parent.hasClass('error') && $parent.find('p').html() === message;
            };

            scope.noErrorFound = (selector) => {
                return !scope.view.$el.hasClass('error');
            };
        };

        describe("EditMapForm: initialization: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(this.model);
            });
        });

        describe("EditMapForm: renderer & user events", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should have all form elements", function () {
                this.view.render();
                const $el = this.view.$el;
                expect($el.find('#map-name').val()).toEqual('Map 3');
                expect($el.find('#map-caption').val()).toEqual('');
            })

            it("If map title empty, the form should display an error", function () {
                this.view.render();
                const $el = this.view.$el;
                expect(Map.prototype.save).toHaveBeenCalledTimes(0);
                expect(this.noErrorFound('#map-name')).toBeTruthy();
                $el.find('#map-name').val('');
                $el.find('#map-caption').val('Some description');
                this.view.saveMap();


                expect(this.errorDisplaysCorrectly(
                    '#map-name', 'A valid map name is required')).toBeTruthy();

                //persists the caption:
                expect($el.find('#map-caption').val()).toEqual('Some description');
                expect(Map.prototype.save).toHaveBeenCalledTimes(0);
            });

        });

        describe("EditMapForm: validated form sets model data correctly", function () {
            beforeEach(function () {
                initView(this);
            });

            it("Should update map model if form data valid", function () {
                this.view.render();
                const $el = this.view.$el;expect(Map.prototype.save).toHaveBeenCalledTimes(0);
                $el.find('#map-name').val('My Favorite Flowers');
                $el.find('#map-caption').val('Some description');
                this.view.saveMap();

                expect(Map.prototype.save).toHaveBeenCalledTimes(1);
                expect(this.view.model.get('name')).toEqual('My Favorite Flowers');
                expect(this.view.model.get('caption')).toEqual('Some description');
            });


            it("Should navigate to new map and close form upon success", function () {

                expect(this.model.collection.trigger).not.toHaveBeenCalledWith('update');
                expect(this.app.vent.trigger).not.toHaveBeenCalledWith('close-modal');                expect(this.model.collection.trigger).toHaveBeenCalledTimes(0);
                this.view.model.set("id", 999);
                this.view.model.set("name", 'My Favorite Flowers');
                this.view.model.set("caption", 'Some description');

                this.view.updateMapName();

                //expect(this.app.vent.trigger).toHaveBeenCalledTimes(1);
                expect(this.app.vent.trigger).toHaveBeenCalledWith('close-modal');
                expect(this.model.collection.trigger).toHaveBeenCalledWith('update');
            });

        });
    });
