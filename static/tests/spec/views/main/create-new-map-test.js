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
            spyOn(CreateMapForm.prototype, 'initialize').and.callThrough();

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

    });
