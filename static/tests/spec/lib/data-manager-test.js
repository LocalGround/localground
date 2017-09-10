/*
TODO: JOHN FINISH TESTS
*/
var rootDir = "../../";
define([
    rootDir + "lib/data/dataManager",
    rootDir + "models/project",
    rootDir + "collections/markers",
    rootDir + "collections/records",
    rootDir + "collections/photos",
    rootDir + "collections/audio",
    rootDir + "collections/mapimages",
    rootDir + "collections/fields",
    "tests/spec-helper"
],
    function (DataManager, Project, Markers, Records, Photos, Audio, MapImages, Fields) {
        'use strict';
        var dataManager;

        var initSpies = function (that) {
            // add spies for all relevant objects and initialize dataManager:
            spyOn(DataManager.prototype, 'initialize').and.callThrough();
            spyOn(DataManager.prototype, 'initProject').and.callThrough();
            spyOn(DataManager.prototype, 'initTilesets').and.callThrough();
            spyOn(DataManager.prototype, 'initCollections').and.callThrough();
            spyOn(DataManager.prototype, 'initCollection').and.callThrough();
            spyOn(DataManager.prototype, 'attachFieldsToRecords').and.callThrough();
            spyOn(DataManager.prototype, 'attachFieldsToRecord').and.callThrough();
            spyOn(DataManager.prototype, 'createRecordsCollection').and.callThrough();
            spyOn(DataManager.prototype, 'getMarkerColor').and.callThrough();
            spyOn(DataManager.prototype, 'deleteCollection').and.callThrough();
            spyOn(DataManager.prototype, 'each').and.callThrough();
            spyOn(DataManager.prototype, 'getLookup').and.callThrough();
            spyOn(DataManager.prototype, 'getCollections').and.callThrough();
            spyOn(DataManager.prototype, 'getCollection').and.callThrough();
            spyOn(DataManager.prototype, 'getModel').and.callThrough();

            spyOn(Project.prototype, 'fetch').and.callThrough();
            spyOn(Fields.prototype, 'fetch').and.callThrough();
            spyOn(that.app.vent, 'trigger');
        };

        var initDataManager = function (that) {
            dataManager = new DataManager({
                vent: that.vent,
                projectID: that.projects.at(0).id,
                model: that.projects.at(0)
            });
        };

        describe("DataManager: Initialization Tests w/o model", function () {

            it("Initialization methods called successfully w/model", function () {
                spyOn(DataManager.prototype, 'initialize').and.callThrough();
                spyOn(Project.prototype, 'fetch').and.callThrough();
                spyOn(Fields.prototype, 'fetch').and.callThrough();
                spyOn(this.app.vent, 'trigger');

                dataManager = new DataManager({
                    vent: this.vent,
                    projectID: this.projects.at(0).id
                });
                expect(dataManager).toEqual(jasmine.any(DataManager));
                expect(dataManager.initialize).toHaveBeenCalled();
                expect(dataManager.model.fetch).toHaveBeenCalled();
                expect(dataManager.vent.trigger).toHaveBeenCalledWith('data-loaded');
            });
        });

        describe("DataManager: Initialization Tests w/o model", function () {
            beforeEach(function () {
                initSpies(this);
                initDataManager(this);
            });

            it("Initialization methods called successfully w/o model", function () {
                expect(dataManager).toEqual(jasmine.any(DataManager));
                expect(dataManager.initialize).toHaveBeenCalled();
                expect(dataManager.model.fetch).not.toHaveBeenCalled();
                expect(dataManager.initCollections).toHaveBeenCalled();
                expect(dataManager.vent.trigger).toHaveBeenCalledWith('data-loaded');
            });

            it("Successfully executes initProject if no model defined", function () {
                //test first half of if statement
                expect(1).toEqual(1);
            });
        });

        describe("DataManager: Method Tests", function () {
            beforeEach(function () {
                initSpies(this);
                initDataManager(this);
            });

            it("Sets data dictionary as expected", function () {
                var keys = Object.keys(dataManager.dataDictionary);
                expect(keys).toEqual(['photos', 'audio', 'map_images', 'markers', 'videos', 'form_1']);
            });

            it("does not have a template defined", function () {
                expect(dataManager.template).toBeFalsy();
            });

            it("isEmpty() Method works", function () {
                expect(dataManager.isEmpty()).toBeFalsy();
                dataManager.dataDictionary = {};
                expect(dataManager.isEmpty()).toBeTruthy();
            });

            it("Sets data sources as expected", function () {
                expect(dataManager.getLookup()).toEqual([
                    { id: 'markers', name: 'Sites' },
                    { id: 'form_1', name: 'Team Members' },
                    { id: 'photos', name: 'Photos' },
                    { id: 'audio', name: 'Audio' },
                    { id: 'videos', name: 'Videos' },
                    { id: 'map_images', name: 'Map Images' }
                ]);
            });

            it("Gets a data entry associated with the correct key and returns expected values", function () {
                var d, collection, jsonData, dataType;
                d = {
                    markers: Markers,
                    form_1: Records,
                    photos: Photos,
                    audio: Audio,
                    map_images: MapImages
                };
                for (dataType in d) {
                    collection = dataManager.getCollection(dataType);
                    jsonData = dataManager.model.get("children")[dataType];
                    expect(collection.getDataType()).toEqual(jsonData.id);
                    expect(collection.getModelType()).toEqual(jsonData.overlay_type);
                    expect(collection.getTitle()).toEqual(jsonData.name);
                    expect(collection).toEqual(jasmine.any(d[dataType]));
                }
            });
            it("Successfully executes initProject if model defined", function () {
                //test second half of if statement
                expect(1).toEqual(1);
            });
            it("Successfully executes initTilesets", function () {
                expect(1).toEqual(1);
            });
            it("Successfully executes initCollections", function () {
                expect(1).toEqual(1);
            });
            it("Successfully executes initCollection", function () {
                expect(1).toEqual(1);
            });
            it("Successfully executes attachFieldsToRecords", function () {
                expect(1).toEqual(1);
            });
            it("Successfully executes attachFieldsToRecord", function () {
                expect(1).toEqual(1);
            });
            it("Successfully executes createRecordsCollection", function () {
                expect(1).toEqual(1);
            });
            it("Successfully executes getMarkerColor", function () {
                expect(1).toEqual(1);
            });
            it("Successfully executes deleteCollection", function () {
                expect(1).toEqual(1);
            });
            it("Successfully executes each", function () {
                expect(1).toEqual(1);
            });
            it("Successfully executes getLookup", function () {
                expect(1).toEqual(1);
            });
            it("Successfully executes getCollections", function () {
                expect(1).toEqual(1);
            });
            it("Successfully executes getCollection", function () {
                expect(1).toEqual(1);
            });
            it("Successfully executes getModel", function () {
                expect(1).toEqual(1);
            });

        });
    });
