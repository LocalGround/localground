var rootDir = "../../";
define([
    "backbone",
    rootDir + "../views/breadcrumbs",
    "tests/spec-helper1"
],
    function (Backbone, ToolbarGlobal) {
        'use strict';
        const initToolbar = function (scope) {

            // 1) add spies for all relevant objects:
            spyOn(ToolbarGlobal.prototype, 'initialize').and.callThrough();

            // 3) add dummy HTML elements:
            scope.fixture = setFixtures('<div id="breadcrumb" class="breadcrumb"></div> \
                <div class="main-panel">\
                    <div id="left-panel"></div>\
                    <div id="map-panel">\
                        <div id="map"></div>\
                    </div>\
                    <div id="right-panel" class="side-panel"></div>\
                </div>');

            // 2) initialize Toolbar:
            scope.toolbar = new ToolbarGlobal({
                app: scope.app,
                model: scope.dataManager.model,
                collection: scope.dataManager.maps
            });
        };

        describe("Breadcrumbs initialization: ", function () {
            beforeEach(function () {
                initToolbar(this);
            });

            it("should initialize correctly", function () {
                expect(this.toolbar.initialize).toHaveBeenCalledTimes(1);
                expect(this.toolbar).toEqual(jasmine.any(ToolbarGlobal));
            });
        });

    });
