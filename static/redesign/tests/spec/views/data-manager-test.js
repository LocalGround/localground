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

        function initApp(that) {
            // add spies for all relevant objects and initialize dataManager:
            spyOn(DataManager.prototype, 'initialize').and.callThrough();
            spyOn(DataManager.prototype, 'setCollections').and.callThrough();
            spyOn(Project.prototype, 'fetch').and.callThrough();
            spyOn(Fields.prototype, 'fetch').and.callThrough();
            spyOn(that.app.vent, 'trigger');
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
                expect(dataManager.app.vent.trigger).toHaveBeenCalledWith('data-loaded');
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
                expect(dataManager.app.vent.trigger).toHaveBeenCalledWith('data-loaded');
            });

            it("does not have a template defined", function () {
                dataManager = new DataManager({
                    app: this.app,
                    model: this.projects.models[0]
                });
                expect(dataManager.template).toBeFalsy();
            });
        });

        describe("DataManager: Method Tests", function () {
            beforeEach(function () {
                initApp(this);
            });

            it("Sets data dictionary as expected", function () {
                dataManager = new DataManager({
                    app: this.app,
                    model: this.projects.models[0]
                });
                var keys = Object.keys(dataManager.dataDictionary);
                expect(keys).toEqual(['photos', 'audio', 'map_images', 'markers', 'form_1']);
            });

            it("isEmpty() Method works", function () {
                dataManager = new DataManager({
                    app: this.app,
                    model: this.projects.models[0]
                });
                expect(dataManager.isEmpty()).toBeFalsy();
                dataManager.dataDictionary = {};
                expect(dataManager.isEmpty()).toBeTruthy();
            });

            it("Sets data sources as expected", function () {
                dataManager = new DataManager({
                    app: this.app,
                    model: this.projects.models[0]
                });
                expect(dataManager.getDataSources()).toEqual([
                    { value: 'markers', name: 'Markers' },
                    { value: 'form_1', name: 'Team Members' },
                    { value: 'photos', name: 'Photos' },
                    { value: 'audio', name: 'Audio' },
                    { value: 'map_images', name: 'Map Images' }
                ]);
            });

            it("Gets a data entry associated with the correct key and returns expected values", function () {
                dataManager = new DataManager({
                    app: this.app,
                    model: this.projects.models[0]
                });
                var d, entry, dm_entry, key;
                d = {
                    markers: Markers,
                    form_1: Records,
                    photos: Photos,
                    audio: Audio,
                    map_images: MapImages
                };
                for (key in d) {
                    dm_entry = dataManager.getData(key);
                    entry = dataManager.model.get("children")[key];
                    expect(entry.id).toEqual(dm_entry.id);
                    expect(entry.overlay_type).toEqual(dm_entry.overlay_type);
                    expect(entry.name).toEqual(dm_entry.name);
                    expect(dm_entry.collection).toEqual(jasmine.any(d[key]));
                }
            });

            it("Sets fields property for custom data types in data entry", function () {
                dataManager = new DataManager({
                    app: this.app,
                    model: this.projects.models[0]
                });
                var entry = dataManager.getData('form_1');
                expect(entry.fields).toEqual(jasmine.any(Fields));
                expect(entry.fields.fetch).toHaveBeenCalled();
                expect(entry.isSite).toBeTruthy();
                expect(entry.isCustomType).toBeTruthy();
            });

            it("Gets a collection associated with the correct key and returns expected values", function () {
                dataManager = new DataManager({
                    app: this.app,
                    model: this.projects.models[0]
                });
                var d, collection, key;
                d = {
                    markers: Markers,
                    form_1: Records,
                    photos: Photos,
                    audio: Audio,
                    map_images: MapImages
                };
                for (key in d) {
                    collection = dataManager.getCollection(key);
                    expect(collection).toEqual(jasmine.any(d[key]));
                    expect(collection.length).toEqual(dataManager.model.get("children")[key].collection.length);
                    expect(collection).toEqual(dataManager.model.get("children")[key].collection);
                }
            });
        });
    });
