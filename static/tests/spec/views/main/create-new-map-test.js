var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/left/new-map-modal-view",
    rootDir + "models/map",
    "tests/spec-helper1"
],
    function (Backbone, CreateMapForm, Map) {
        'use strict';
        var map;

        const initView = function (scope) {
            spyOn(CreateMapForm.prototype, 'initialize').and.callThrough();
            spyOn(CreateMapForm.prototype, 'toggleCheckboxes').and.callThrough();
            spyOn(CreateMapForm.prototype, 'saveMap').and.callThrough();
            spyOn(CreateMapForm.prototype, 'displayMap').and.callThrough();
            spyOn(Map.prototype, 'save');
            spyOn(scope.dataManager, 'addMap');
            spyOn(scope.app.vent, 'trigger');
            spyOn(scope.app.router, 'navigate');


            const latLng = scope.app.basemapView.getCenter();
            map = new Map({
                center: {
                    "type": "Point",
                    "coordinates": [ latLng.lng(), latLng.lat() ]
                },
                basemap: scope.app.basemapView.getMapTypeId(),
                zoom: scope.app.basemapView.getZoom(),
                project_id: scope.app.getProjectID()
            });
            scope.view = new CreateMapForm({
                app: scope.app,
                model: map
            });

            scope.errorDisplaysCorrectly = (selector, message) => {
                const $parent = scope.view.$el.find(selector).parent();
                return $parent.hasClass('error') && $parent.find('p').html() === message;
            };

            scope.noErrorFound = (selector) => {
                return !scope.view.$el.hasClass('error');
            };
        };

        describe("CreateMapForm: initialization: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(map);
            });
        });

        describe("CreateMapForm: renderer & user events", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should listen for user's dataset selections", function () {
                this.view.render();
                expect(this.view.toggleCheckboxes).toHaveBeenCalledTimes(0);

                //user asks for a map with a new dataset:
                this.view.$el.find('#new-dataset').trigger('click');
                expect(this.view.$el.find('.checkbox-list').css('display')).toEqual('none');
                expect(this.view.toggleCheckboxes).toHaveBeenCalledTimes(1);

                //user asks for a map with one or more existing datasets:
                this.view.$el.find('#existing-datasets').trigger('click');
                expect(this.view.$el.find('.checkbox-list').css('display')).toEqual('block');
                expect(this.view.toggleCheckboxes).toHaveBeenCalledTimes(2);
            });

            it("should have all form elements", function () {
                this.view.render();
                const $el = this.view.$el;
                expect($el.find('#map-name').val()).toEqual('Untitled Map');
                expect($el.find('#map-caption').val()).toEqual('');
                expect($el.find('#new-dataset').prop('checked')).toBeFalsy();
                expect($el.find('#existing-datasets').prop('checked')).toBeTruthy();
                this.app.dataManager.getDatasets().forEach(dataset => {
                    expect($el.find('#' + dataset.dataType).val()).toEqual(dataset.dataType);
                    expect($el.find('#' + dataset.dataType).prop('checked')).toBeTruthy();
                });
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

            it("If no datasets selected, the form should display an error", function () {
                this.view.render();
                const $el = this.view.$el;
                expect(Map.prototype.save).toHaveBeenCalledTimes(0);
                $el.find('#map-name').val('My Favorite Flowers');
                $el.find('#map-caption').val('Some description');
                this.app.dataManager.getDatasets().forEach(dataset => {
                    $el.find('#' + dataset.dataType).prop('checked', false);
                    expect($el.find('#' + dataset.dataType).prop('checked')).toBeFalsy();
                });
                this.view.saveMap();


                expect(this.errorDisplaysCorrectly(
                    '#existing-datasets',
                    'Please select at least one data source (or indicate that you want to create a new one).'
                )).toBeTruthy();

                //persists the set values:
                expect($el.find('#map-name').val()).toEqual('My Favorite Flowers');
                expect($el.find('#map-caption').val()).toEqual('Some description');
                this.app.dataManager.getDatasets().forEach(dataset => {
                    expect($el.find('#' + dataset.dataType).prop('checked')).toBeFalsy();
                });
                expect(Map.prototype.save).toHaveBeenCalledTimes(0);
            });
        });

        describe("CreateMapForm: validated form sets model data correctly", function () {
            beforeEach(function () {
                initView(this);
            });

            it("Should issue new dataset request", function () {
                this.view.render();
                const $el = this.view.$el;
                expect(Map.prototype.save).toHaveBeenCalledTimes(0);
                $el.find('#map-name').val('My Favorite Flowers');
                $el.find('#map-caption').val('Some description');
                $el.find('#new-dataset').prop('checked', true);
                this.view.saveMap();

                expect(Map.prototype.save).toHaveBeenCalledTimes(1);
                expect(this.view.model.get('name')).toEqual('My Favorite Flowers');
                expect(this.view.model.get('caption')).toEqual('Some description');
                expect(this.view.model.get('create_new_dataset')).toBeTruthy();
            });

            it("Should issue request to include all layers", function () {
                this.view.render();
                const $el = this.view.$el;expect(Map.prototype.save).toHaveBeenCalledTimes(0);
                $el.find('#map-name').val('My Favorite Flowers');
                $el.find('#map-caption').val('Some description');
                this.view.saveMap();

                expect(Map.prototype.save).toHaveBeenCalledTimes(1);
                expect(this.view.model.get('name')).toEqual('My Favorite Flowers');
                expect(this.view.model.get('caption')).toEqual('Some description');
                expect(this.view.model.get('datasets')).toEqual('["3","2"]');
            });

            it("Should issue request to include form_3", function () {
                this.view.render();
                const $el = this.view.$el;expect(Map.prototype.save).toHaveBeenCalledTimes(0);
                $el.find('#map-name').val('My Favorite Flowers');
                $el.find('#map-caption').val('Some description');
                $el.find('#form_2').prop('checked', false);
                this.view.saveMap();

                expect(Map.prototype.save).toHaveBeenCalledTimes(1);
                expect(this.view.model.get('name')).toEqual('My Favorite Flowers');
                expect(this.view.model.get('caption')).toEqual('Some description');
                expect(this.view.model.get('datasets')).toEqual('["3"]');
            });



            it("Should navigate to new map and close form upon success", function () {
                expect(this.dataManager.addMap).toHaveBeenCalledTimes(0);
                expect(this.app.vent.trigger).toHaveBeenCalledTimes(0);
                expect(this.app.router.navigate).toHaveBeenCalledTimes(0);
                this.view.model.set("id", 999);
                this.view.model.set("name", 'My Favorite Flowers');
                this.view.model.set("caption", 'Some description');
                this.view.model.set("datasets", '["3"]');
                this.view.displayMap();

                expect(this.dataManager.addMap).toHaveBeenCalledTimes(1);
                expect(this.app.vent.trigger).toHaveBeenCalledTimes(1);
                expect(this.app.router.navigate).toHaveBeenCalledTimes(1);
                expect(this.app.router.navigate).toHaveBeenCalledWith('//999');
            });

        });
    });
