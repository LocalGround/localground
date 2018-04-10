define(["underscore", "marionette", "models/project",
            "collections/photos", "collections/audio", "collections/videos",
            "collections/mapimages", "collections/records", "collections/fields",
            "collections/tilesets", "collections/maps"],
    function (_, Marionette, Project, Photos, Audio, Videos, MapImages,
                Records, Fields, TileSets, Maps) {
        'use strict';
        var DataManager = Marionette.ItemView.extend({
            __dataDictionary: {},
            template: false,
            initialize: function (opts) {
                _.extend(this, opts);
                if (typeof this.projectJSON === 'undefined') {
                    window.location = '/';
                    return false;
                }
                this.__initProject();
                this.__initTilesets();
                this.listenTo(this.vent, "delete-collection", this.deleteCollection);
                this.listenTo(this.vent, "create-collection", this.addNewRecordsCollection);
            },
            __initProject: function () {
                if (!this.__project) {
                    this.__project = new Project(this.projectJSON);
                }
                this.__initCollections();
                this.__initMaps();
            },

            __initTilesets: function () {
                this.__tilesets = new TileSets();
                this.__tilesets.fetch({reset: 'true'});
            },
            __initMaps: function () {
                this.__maps = new Maps(this.__project.get('maps').data, {
                    projectID: this.__project.id});
            },

            __initCollections: function () {
                var dataLists = {};
                _.extend(dataLists, this.__project.get('datasets'));
                _.extend(dataLists, this.__project.get('media'));
                var opts, dataType, jsonData, collection;
                for (dataType in dataLists) {
                    opts = dataLists[dataType];
                    _.extend(opts, {
                        title: opts.name,
                        overlayType: opts.overlay_type,
                        isSite: false,
                        isCustomType: false,
                        isMedia: false,
                        dataType: dataType,
                        projectID: this.__project.id
                    });
                    collection = this.__initCollection(opts);
                    this.__dataDictionary[dataType] = collection;
                }
            },
            __initCollection: function (opts) {
                var collection;
                var jsonData = opts.data;
                delete opts.data;
                switch (opts.dataType) {
                    case "photos":
                        opts.isMedia = true;
                        collection = new Photos(jsonData, opts);
                        break;
                    case "audio":
                        opts.isMedia = true;
                        collection = new Audio(jsonData, opts);
                        break;
                    case "videos":
                        opts.isMedia = true;
                        collection = new Videos(jsonData, opts);
                        break;
                    case "map_images":
                        opts.isMedia = true;
                        collection = new MapImages(jsonData, opts);
                        break;
                    default:
                        if (opts.dataType.includes("form_")) {
                            collection = this.__createRecordsCollection(jsonData, opts);
                        } else {
                            throw new Error("case not handled");
                        }
                        break;
                }
                return collection;
            },

            __attachFieldsToRecord: function (fields, record) {
                fields.each(function (field) {
                    field.set("val", record.get(field.get("col_name")));
                });
                record.set('fields', fields.toJSON());
            },

            __attachFieldsToRecords:  function (fields, records) {
                // some extra post-processing for custom datatypes so that
                // it's easier to loop through fields and output corresponding
                // values
                records.each((record) => {
                    this.__attachFieldsToRecord(fields, record);
                });
            },

            __createRecordsCollection:  function (jsonData, opts, fields) {
                var fieldsURL,
                    collection;
                opts.formID = parseInt(opts.dataType.split("_")[1]);
                opts.url = '/api/0/datasets/' + opts.formID + '/data/';
                fieldsURL = '/api/0/datasets/' + opts.formID + '/fields/';
                _.extend(opts, {
                    fields: new Fields(opts.fields, { baseURL: fieldsURL }),
                    isCustomType: true,
                    isSite: true,
                    key: opts.dataType
                });
                collection = new Records(jsonData, opts);
                this.__attachFieldsToRecords(opts.fields, collection);
                return collection
            },

            __getCollections: function () {
                return Object.values(this.__dataDictionary);
            },

            /******************/
            /* PUBLIC METHODS */
            /******************/
            getProject: function () {
                return this.__project;
            },
            getMap: function () {
                return this.map;
            },
            setMapById: function (mapID) {
                this.map = this.__maps.get(mapID);
            },
            addMap: function (map) {
                map.getLayers().each(function (layer) {
                    console.log(layer.get('title'));
                })
                this.__maps.add(map);
            },
            deleteCollection: function (dataType) {
                delete this.__dataDictionary[dataType];
            },
            each: function (f) {
                //TODO: deprecate. There are newer convenience functions that
                //      are better.
                this.getLookup().forEach((obj) => {
                    f(this.getCollection(obj.id));
                });
            },
            getModel: function (dataType, id) {
                return this.__dataDictionary[dataType].getModel(id);
            },
            getLookup: function () {
                // First datasets, then map images (order matters):
                const lookup = [];
                this.getDatasets().forEach(collection => {
                    lookup.push({
                        id: collection.getDataType(),
                        name: collection.getTitle(),
                        hasData: collection.length > 0
                    })
                });
                lookup.push.apply(lookup, [
                    { id: "map_images", name: "Map Images", hasData: this.getCollection("map_images").length > 0 }
                ])
                return lookup;
            },
            getCollection: function (dataType) {
                if (!this.__dataDictionary[dataType]) {
                    throw new Error("No collection found for " + dataType);
                }
                return this.__dataDictionary[dataType];
            },
            getDatasets: function () {
                return this.__getCollections().filter(collection => {
                    return collection.getIsCustomType();
                });
            },
            getMediaCollections: function () {
                return this.__getCollections().filter(collection => {
                    return collection.getIsMedia();
                });
            },
            getMaps: function () {
                return this.__maps;
            },
            getTilesets: function () {
                return this.__tilesets;
            }
        });
        return DataManager;
    });
