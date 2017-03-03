var rootDir = "../../";
define([
    rootDir + "lib/data/dataManager",
    rootDir + "models/project",
    "tests/spec-helper"
],
    function (DataManager, Project) {
        'use strict';
        var dataManager;

        function initApp(scope) {
            // add spies for all relevant objects and initialize dataManager:
            spyOn(DataManager.prototype, 'initialize').and.callThrough();
            spyOn(DataManager.prototype, 'setCollections').and.callThrough();
            spyOn(Project.prototype, 'fetch').and.callThrough();
        }

        describe("DataManager: Initialization Tests", function () {
            beforeEach(function () {
                initApp(this);
            });

            it("Initialization methods called successfully w/o model", function () {
                dataManager = new DataManager({
                    app: this.app
                });
                expect(dataManager).toEqual(jasmine.any(DataManager));
                expect(dataManager.initialize).toHaveBeenCalled();
                expect(dataManager.setCollections).toHaveBeenCalled();
                expect(dataManager.model.fetch).toHaveBeenCalled();
            });

            it("Initialization methods called successfully w/model", function () {
                dataManager = new DataManager({
                    app: this.app,
                    model: this.projects.models[0]
                });
                expect(dataManager).toEqual(jasmine.any(DataManager));
                expect(dataManager.initialize).toHaveBeenCalled();
                expect(dataManager.model.fetch).not.toHaveBeenCalled();
                expect(dataManager.setCollections).toHaveBeenCalled();
            });
        });
    });
