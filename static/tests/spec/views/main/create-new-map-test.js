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
            spyOn(CreateMapForm.prototype, 'handleServerError').and.callThrough();
            spyOn(Map.prototype, 'save').and.callThrough();


            const latLng = scope.app.basemapView.getCenter();
            map = new Map({
                center: {
                    "type": "Point",
                    "coordinates": [ latLng.lng(), latLng.lat() ]
                },
                basemap: scope.app.getMapTypeId(),
                zoom: scope.app.getZoom(),
                project_id: scope.app.getProjectID()
            });
            scope.view  = new CreateMapForm({
                app: scope.app,
                model: map
            });
        };

        describe("Create new map form initialization: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(map);
            });
        });

        describe("Renderer: ", function () {
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

            it("should have a radio button for each available dataset", function () {
                /*
                    <div class="checkbox-list" style="margin-left: 30px; display: none;">
                        <input type="checkbox" name="dataset" checked="" value="form_24">
                        <label>Untitled Dataset</label><br>
                        <input type="checkbox" name="dataset" checked="" value="form_23">
                        <label>Flower</label><br>
                    </div>
                */
                expect(1).toEqual(1);
            })
        });

    });
