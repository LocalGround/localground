var rootDir = "../../";
define([
    "backbone",
    rootDir + "apps/main/main-app",
    rootDir + "lib/maps/basemap",
    "tests/spec-helper1"
],
    function (Backbone, MainApp, BaseMapView) {
        'use strict';
        var mainApp, fixture, initApp;

        initApp = function (scope) {

            // 1) add spies for all relevant objects:
            spyOn(MainApp.prototype, 'initialize').and.callThrough();

            // 3) add dummy HTML elements:
            fixture = setFixtures('<div id="breadcrumb" class="breadcrumb"></div> \
                <div class="main-panel">\
                    <div id="left-panel"></div>\
                    <div id="map-panel">\
                        <div id="map"></div>\
                    </div>\
                    <div id="right-panel" class="side-panel"></div>\
                </div>');
            // 2) initialize ProfileApp object:
            mainApp = new MainApp({
                dataManager: scope.dataManager
            });
            fixture.append(mainApp.$el);
        };

        describe("StyleApp: Application-Level Tests", function () {
            beforeEach(function () {
                initApp(this);
            });
            afterEach(function () {
                Backbone.history.stop();
            });

            it("should initialize correctly", function () {
                expect(mainApp.initialize).toHaveBeenCalledTimes(1);
                expect(mainApp).toEqual(jasmine.any(MainApp));
                console.log('dataManager:', this.dataManager);
                console.log('photos:', this.photos);
                console.log('audio:', this.audio);
                console.log('form_2:', this.form_2);
                console.log('form_3:', this.form_3);
            });
        });
    });
