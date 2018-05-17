var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/left/create-layer-form",
    rootDir + "lib/modals/modal",
    rootDir + "models/layer",
    rootDir + "lib/data/dataManager",
    "tests/spec-helper1"
],
    function (Backbone, CreateLayerForm, Modal, Layer, DataManager) {
        'use strict';
        var map;

        const initMap = function (scope) {
            map = scope.dataManager.getMaps().at(0);
            map.set("layers", scope.getLayers(map.id));
        };

        const initView = function (scope) {
            spyOn(CreateLayerForm.prototype, 'initialize').and.callThrough();
            spyOn(CreateLayerForm.prototype, 'toggleCheckboxes').and.callThrough();

            spyOn(Modal.prototype, 'show').and.callThrough();
            spyOn(Modal.prototype, 'update').and.callThrough();

            spyOn(Layer.prototype, 'save');
            spyOn(DataManager.prototype, 'addLayerToMap');
            spyOn(scope.app.vent, 'trigger');

            scope.view = new CreateLayerForm({
                app: scope.app,
                map: map,
                model: new Layer({
                    map_id: map.id
                })
            });

            scope.errorDisplaysCorrectly = (selector, message) => {
                const $parent = scope.view.$el.find(selector).parent();
                return $parent.hasClass('error') && $parent.find('p').html() === message;
            };

            scope.noErrorFound = (selector) => {
                return !scope.view.$el.hasClass('error');
            };

            scope.responseJSON = {
                "id": 101,
                "overlay_type": "layer",
                "owner": "tester",
                "title": "My New Layer",
                "dataset": {
                    "id": 3,
                    "overlay_type": "dataset_3",
                    "fields": scope.dataset_3.fields,
                    "name": scope.dataset_3.name
                },
                "group_by": "uniform",
                "display_field": "square_feet",
                "ordering": 1,
                "metadata": {
                    "strokeWeight": 1,
                    "buckets": 4,
                    "isShowing": true,
                    "strokeOpacity": 1,
                    "width": 20,
                    "shape": "circle",
                    "fillOpacity": 1,
                    "strokeColor": "#ffffff",
                    "paletteId": 0,
                    "fillColor": "#4e70d4"
                },
                "map_id": 22,
                "symbols": [
                    {
                        "fillOpacity": 1,
                        "title": "Untitled Symbol",
                        "strokeWeight": 1,
                        "isShowing": true,
                        "strokeOpacity": 1,
                        "height": 20,
                        "width": 20,
                        "shape": "circle",
                        "rule": "*",
                        "strokeColor": "#ffffff",
                        "id": 1,
                        "fillColor": "#ffdd33"
                    },
                    {
                        "fillOpacity": 1,
                        "title": "Uncategorized",
                        "strokeWeight": 1,
                        "isShowing": false,
                        "rule": "¯\\_(ツ)_/¯",
                        "height": 20,
                        "width": 20,
                        "shape": "circle",
                        "strokeOpacity": 1,
                        "strokeColor": "#FFFFFF",
                        "id": 2,
                        "fillColor": "#4e70d4"
                    }
                ]
            }
        };

        describe("CreateLayerForm: initialization: ", function () {
            beforeEach(function () {
                initMap(this);
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.map).toEqual(map);
            });
        });

        describe("CreateLayerForm: UI rendering / listening works: ", function () {
            beforeEach(function () {
                initMap(this);
                initView(this);
            });

            it("should listen for user's dataset selections", function () {
                this.view.render();
                expect(this.view.toggleCheckboxes).toHaveBeenCalledTimes(0);
                expect(this.view.$el.find('#dataset-list').attr('disabled')).toBeUndefined();

                //user asks for a map with a new dataset:
                this.view.$el.find('#layer-new-dataset').trigger('click');
                expect(this.view.$el.find('#dataset-list').attr('disabled')).toEqual('disabled');
                expect(this.view.toggleCheckboxes).toHaveBeenCalledTimes(1);

                //user asks for a map with one or more existing datasets:
                this.view.$el.find('#layer-existing-datasets').trigger('click');
                expect(this.view.$el.find('#dataset-list').attr('disabled')).toBeUndefined();
                expect(this.view.toggleCheckboxes).toHaveBeenCalledTimes(2);
            });

            it("should have all form elements", function () {
                this.view.render();
                const $el = this.view.$el;
                expect($el.find('#layer-title').val()).toEqual('Untitled Layer 1');
                expect($el.find('#layer-new-dataset').prop('checked')).toBeFalsy()
                expect($el.find('#layer-existing-datasets').attr('disabled')).toBeUndefined();
                expect($el.find('#dataset-list').attr('disabled')).toBeUndefined();
                this.app.dataManager.getDatasets().forEach(dataset => {
                    expect($el.find('option[value=' + dataset.formID + ']').val()).toEqual(dataset.formID.toString());
                });
            });

        });

        describe("CreateLayerForm: Layer Names Increment", function () {
            beforeEach(function () {
                initMap(this);
            });

            it("should increment the map name to 'Untitled Layer 1'", function () {
                const layers = map.get('layers');
                layers.at(0).set('title', 'Untitled Layer 1');
                initView(this);
                this.view.render();
                expect(this.view.$el.find('#layer-title').val()).toEqual('Untitled Layer 2');
            });

            it("should increment the map name to 'Untitled Map 105'", function () {
                const layers = map.get('layers');
                layers.at(0).set('title', 'Untitled Layer 104');
                initView(this);
                this.view.render();
                expect(this.view.$el.find('#layer-title').val()).toEqual('Untitled Layer 105');
            });
        });

        describe("CreateLayerForm: renderer & user events", function () {
            beforeEach(function () {
                initMap(this);
                initView(this);
            });

            it("If layer title empty, the form should display an error", function () {
                this.view.render();
                const $el = this.view.$el;
                expect(Layer.prototype.save).toHaveBeenCalledTimes(0);
                expect(this.noErrorFound('#layer-title')).toBeTruthy();
                $el.find('#layer-title').val('');
                $el.find('#layer-new-dataset').trigger('click');
                this.view.saveLayer();


                expect(this.errorDisplaysCorrectly(
                    '#layer-title', 'A valid layer name is required')).toBeTruthy();

                //ensure that state is persisted:
                expect($el.find('#layer-new-dataset').prop('checked')).toBeTruthy();
                expect($el.find('#dataset-list').attr('disabled')).toEqual('disabled');
                expect(Layer.prototype.save).toHaveBeenCalledTimes(0);
            });

            it("Saves correctly if valid title: new dataset", function () {
                this.view.render();
                const $el = this.view.$el;
                $el.find('#layer-title').val('My New Layer');
                expect(Layer.prototype.save).toHaveBeenCalledTimes(0);
                expect(this.view.model.get('title')).toBeUndefined();
                $el.find('#layer-new-dataset').trigger('click');
                this.view.saveLayer();

                expect(this.noErrorFound('#layer-title')).toBeTruthy();
                expect(this.view.model.get('title')).toEqual('My New Layer');
                expect(this.view.model.get('create_new_dataset')).toBeTruthy();
                expect(this.view.model.get('dataset')).toBeNull();
                expect(Layer.prototype.save).toHaveBeenCalledTimes(1);

            });

            it("Saves correctly if valid title: existing dataset", function () {
                this.view.render();
                const $el = this.view.$el;
                $el.find('#layer-title').val('My New Layer');
                expect(Layer.prototype.save).toHaveBeenCalledTimes(0);
                this.view.saveLayer();


                expect(this.noErrorFound('#layer-title')).toBeTruthy();
                expect(this.view.model.get('title')).toEqual('My New Layer');
                expect(this.view.model.get('create_new_dataset')).toBeFalsy();
                expect(this.view.model.get('dataset')).toEqual(3);
                expect(Layer.prototype.save).toHaveBeenCalledTimes(1);

            });

            it("Handles a successful POST server response", function () {
                this.view.render();
                const $el = this.view.$el;
                $el.find('#layer-title').val('My New Layer');
                expect(Layer.prototype.save).toHaveBeenCalledTimes(0);
                this.view.saveLayer();
                expect(this.app.vent.trigger).not.toHaveBeenCalledWith('close-modal');
                expect(DataManager.prototype.addLayerToMap).toHaveBeenCalledTimes(0);

                //explicitly call the success callback function:
                this.view.handleSuccess(
                    this.view.model, JSON.stringify(this.responseJSON));
                expect(this.view.model.get('symbols').toJSON())
                    .toEqual(this.responseJSON.symbols);
                expect(this.view.model.get('dataset').fields.length)
                    .toEqual(3);
                expect(DataManager.prototype.addLayerToMap).toHaveBeenCalledTimes(1);
                expect(DataManager.prototype.addLayerToMap).toHaveBeenCalledWith(
                    map, this.view.model
                );
                expect(this.app.vent.trigger).toHaveBeenCalledWith('close-modal');
            });
        });
    });
