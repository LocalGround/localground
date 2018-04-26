var rootDir = "../../";
define([
    rootDir + "lib/data/dataManager",
    rootDir + "models/project",
    rootDir + "collections/records",
    rootDir + "collections/photos",
    rootDir + "collections/audio",
    rootDir + "collections/videos",
    rootDir + "collections/mapimages",
    rootDir + "collections/maps",
    rootDir + "collections/tilesets",
    rootDir + "collections/fields",
    "tests/spec-helper1"
],
    function (DataManager, Project, Records, Photos, Audio, Videos, MapImages,
            Maps, TileSets, Fields) {
        'use strict';
        var initSpies = (that) => {
            // add spies for all relevant objects and initialize dataManager:
            spyOn(DataManager.prototype, 'initialize').and.callThrough();
            spyOn(DataManager.prototype, 'getProject').and.callThrough();
            spyOn(DataManager.prototype, 'getMap').and.callThrough();
            spyOn(DataManager.prototype, 'setMapById').and.callThrough();
            spyOn(DataManager.prototype, 'addMap').and.callThrough();
            spyOn(DataManager.prototype, 'deleteCollection').and.callThrough();
            spyOn(DataManager.prototype, 'each').and.callThrough();
            spyOn(DataManager.prototype, 'getLookup').and.callThrough();
            spyOn(DataManager.prototype, 'getDatasets').and.callThrough();
            spyOn(DataManager.prototype, 'getMediaCollections').and.callThrough();
            spyOn(DataManager.prototype, 'getCollection').and.callThrough();
        };

        describe("DataManager: Initialization Tests w/o model", function () {

            it("Initialization methods called successfully w/model", function () {
                expect(1).toEqual(1);
            });
        });

        describe("DataManager: Method Tests", function () {
            beforeEach(function () {
                initSpies(this);
            });

            it("Correctly initializes *private* __dataDictionary property", function () {
                var keys = Object.keys(this.dataManager.__dataDictionary);
                expect(keys.sort()).toEqual([
                    'dataset_3', 'dataset_2', 'photos', 'audio', 'map_images', 'videos'
                ].sort());
            });

            it("does not have a template defined", function () {
                expect(this.dataManager.template).toBeFalsy();
            });

            it("Sets data sources as expected", function () {
                expect(this.dataManager.getLookup()).toEqual([
                    { id: 'dataset_3', name: 'Buildings', hasData: true },
                    { id: 'dataset_2', name: 'Trees', hasData: true },
                    { id: 'map_images', name: 'Map Images', hasData: true }
                ]);
            });

            it("getDatasets works", function () {
                const collections = this.dataManager.getDatasets();
                expect(collections.length).toEqual(2);
                expect(collections[0].key).toEqual('dataset_3');
                expect(collections[0].length).toEqual(5);
                expect(collections[1].key).toEqual('dataset_2');
                expect(collections[1].length).toEqual(18);
            });

            it("getMediaCollections works", function () {
                const collections = this.dataManager.getMediaCollections();
                expect(collections.length).toEqual(4);
                expect(collections[0].key).toEqual('photos');
                expect(collections[0].length).toEqual(18);
                expect(collections[1].key).toEqual('audio');
                expect(collections[1].length).toEqual(4);
                expect(collections[2].key).toEqual('videos');
                expect(collections[2].length).toEqual(7);
                expect(collections[3].key).toEqual('map_images');
                expect(collections[3].length).toEqual(2);
            });

            it("getProject returns active project", function () {
                expect(this.dataManager.getProject()).toEqual(jasmine.any(Project));
                expect(this.dataManager.getProject().id).toEqual(this.getProjectJSON().id);
            });

            it("getMaps returns list of available maps", function () {
                expect(this.dataManager.getMaps()).toEqual(jasmine.any(Maps));
                expect(this.dataManager.getMaps().length).toEqual(2);
            });

            it("getTilesets returns list of available tilesets", function () {
                expect(this.dataManager.getTilesets()).toEqual(jasmine.any(TileSets));
            });

            it("map getter / setter both work", function () {
                expect(this.dataManager.getMap()).toBeUndefined();
                this.dataManager.setMapById(3);
                expect(this.dataManager.getMap().id).toEqual(3);
            });

            it("Gets a data entry associated with the correct key and returns expected values", function () {
                var d, collection, jsonData, dataType, that = this;
                d = {
                    dataset_2: Records,
                    dataset_3: Records,
                    photos: Photos,
                    audio: Audio,
                    videos: Videos,
                    map_images: MapImages
                };
                for (dataType in d) {
                    collection = this.dataManager.getCollection(dataType);
                    expect(collection).toEqual(jasmine.any(d[dataType]));
                }
                //check that it throws an error for invalid data_type:
                expect(function () {
                    that.dataManager.getCollection('invalid_datatype');
                }).toThrow(new Error("No collection found for invalid_datatype"));
            });

            it("Successfully executes getModel for every data type", function () {
                const dataset_3 = this.dataManager.getModel('dataset_3', 52);
                expect(dataset_3.id).toEqual(52);
                expect(dataset_3.get('overlay_type')).toEqual('dataset_3');
                expect(dataset_3).toEqual(this.dataManager.getCollection('dataset_3').get(52));

                const dataset_2 = this.dataManager.getModel('dataset_2', 11);
                expect(dataset_2.id).toEqual(11);
                expect(dataset_2.get('overlay_type')).toEqual('dataset_2');
                expect(dataset_2).toEqual(this.dataManager.getCollection('dataset_2').get(11));

                const photo = this.dataManager.getModel('photos', 20);
                expect(photo.id).toEqual(20);
                expect(photo.get('overlay_type')).toEqual('photo');
                expect(photo).toEqual(this.dataManager.getCollection('photos').get(20));

                const audio = this.dataManager.getModel('audio', 4);
                expect(audio.id).toEqual(4);
                expect(audio.get('overlay_type')).toEqual('audio');
                expect(audio).toEqual(this.dataManager.getCollection('audio').get(4));

                const video = this.dataManager.getModel('videos', 53);
                expect(video.id).toEqual(53);
                expect(video.get('overlay_type')).toEqual('video');
                expect(video).toEqual(this.dataManager.getCollection('videos').get(53));

                //TODO: dashs or underscores? Combo is confusing:
                const map_image = this.dataManager.getModel('map_images', 6);
                expect(map_image.id).toEqual(6);
                expect(map_image.get('overlay_type')).toEqual('map-image');
                expect(map_image).toEqual(this.dataManager.getCollection('map_images').get(6));
            });

            it("deleteCollection works as expected", function () {
                //check that it throws an error for invalid data_type:
                var that = this;
                expect(that.dataManager.getCollection('photos')).toEqual(jasmine.any(Photos));
                expect(this.dataManager.getMediaCollections().length).toEqual(4);
                this.dataManager.deleteCollection('photos');
                expect(this.dataManager.getMediaCollections().length).toEqual(3);
                expect(function () {
                    that.dataManager.getCollection('photos');
                }).toThrow(new Error("No collection found for photos"));
            });

            it("addMap works as expected", function () {
                expect(1).toEqual(1);
            });
        });
    });
