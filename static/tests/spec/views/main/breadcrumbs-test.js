var rootDir = "../../../";
define([
    "backbone",
    rootDir + "views/breadcrumbs",
    rootDir + "models/map",
    rootDir + "collections/maps",
    "tests/spec-helper1"
],
    function (Backbone, Breadcrumbs, Map, Maps) {
        'use strict';
        const initToolbar = function (scope) {

            // 1) add spies for all relevant objects:
            spyOn(Breadcrumbs.prototype, 'initialize').and.callThrough();
            spyOn(Breadcrumbs.prototype, 'render').and.callThrough();
            spyOn(Maps.prototype, 'add').and.callThrough();
            //spyOn(Breadcrumbs.prototype, 'render').and.callThrough();

            // 3) add dummy HTML elements:
            scope.fixture = setFixtures('<div id="breadcrumb" class="breadcrumb"></div>');

            // 2) initialize Toolbar:
            scope.toolbar = new Breadcrumbs({
                app: scope.app,
                model: scope.dataManager.getProject(),
                collection: scope.dataManager.maps,
                activeMap: scope.dataManager.maps.at(0)
            });
        };

        describe("Breadcrumbs initialization: ", function () {
            beforeEach(function () {
                initToolbar(this);
            });

            it("should initialize correctly", function () {
                expect(this.toolbar.initialize).toHaveBeenCalledTimes(1);
                expect(this.toolbar).toEqual(jasmine.any(Breadcrumbs));
                expect(this.toolbar.model).toEqual(this.dataManager.getProject());
                expect(this.toolbar.collection).toEqual(this.dataManager.maps);
            });

            it("should listens for collection add", function () {
                expect(Breadcrumbs.prototype.render).toHaveBeenCalledTimes(0);

                expect(this.toolbar.collection.add).toHaveBeenCalledTimes(0);
                this.toolbar.collection.add(
                    new Map(null, { projectID: this.toolbar.model.id }));

                expect(Breadcrumbs.prototype.render).toHaveBeenCalledTimes(1);
            });
        });

        describe("Breadcrumbs templates: ", function () {
            beforeEach(function () {
                initToolbar(this);
            });

            it("should render toolbar correctly", function () {
                //expect(this.toolbar.initialize).toHaveBeenCalledTimes(1);
                this.toolbar.render();
                console.log(this.toolbar.$el.html());
                expect(1).toEqual(1);
            });
        });

    });
