define(["underscore", "marionette", "models/project",
            "collections/photos", "collections/audio", "collections/videos",
            "collections/mapimages", "collections/markers",
            "collections/records", "collections/fields",
            "collections/tilesets"],
    function (_, Marionette, Project, Photos, Audio, Videos, MapImages, Markers,
                Records, Fields, TileSets) {
        'use strict';
        var DataManager = Marionette.ItemView.extend({
            dataDictionary: {},
            formColors: ['#60C7CC', '#CF2045', '#A3A737', '#F27CA5'],
            colorCounter: 0,
            dataLoaded: false,
            template: false,
            initialize: function (opts) {
                _.extend(this, opts);
                if (typeof this.projectID === 'undefined') {
                    window.location = '/';
                    return false;
                }
                this.initProject();
                this.initTilesets();
                this.listenTo(this.vent, "delete-collection", this.deleteCollection);
                this.listenTo(this.vent, "create-collection", this.addNewRecordsCollection);
            },
            isEmpty: function () {
                return Object.keys(this.dataDictionary).length === 0;
            },
            initProject: function () {
                if (!this.model) {
                    this.model = new Project({ id: this.projectID });
                    this.model.fetch({ success: this.initCollections.bind(this) });
                } else {
                    this.initCollections();
                }
            },

            initTilesets: function () {
                this.tilesets = new TileSets();
                this.tilesets.fetch({reset: 'true'});
            },

            initCollections: function () {
                var opts, dataType, jsonData, collection;
                for (dataType in this.model.get("children")) {
                    opts = this.model.get("children")[dataType];
                    jsonData = opts.data;
                    delete opts.data;
                    _.extend(opts, {
                        title: opts.name,
                        overlayType: opts.overlay_type,
                        isSite: false,
                        isCustomType: false,
                        isMedia: false,
                        dataType: dataType,
                        projectID: this.model.id
                    });
                    collection = this.initCollection(opts, jsonData);
                    this.dataDictionary[dataType] = collection;
                }
                this.dataLoaded = true;
                this.vent.trigger('data-loaded');
            },
            initCollection: function (opts, jsonData) {
                var collection;
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
                    case "markers":
                        opts.isSite = true;
                        collection = new Markers(jsonData, opts);
                        break;
                    case "map_images":
                        opts.isMedia = true;
                        collection = new MapImages(jsonData, opts);
                        break;
                    default:
                        if (opts.dataType.includes("form_")) {
                            collection = this.createRecordsCollection(jsonData, opts);
                        } else {
                            throw new Error("case not handled");
                        }
                        break;
                }
                return collection;
            },

            attachFieldsToRecord: function (fields, record) {
                fields.each(function (field) {
                    field.set("val", record.get(field.get("col_name")));
                });
                record.set('fields', fields.toJSON());
            },

            attachFieldsToRecords:  function (fields, records) {
                // some extra post-processing for custom datatypes so that
                // it's easier to loop through fields and output corresponding
                // values
                records.each((record) => {
                    this.attachFieldsToRecord(fields, record);
                });
            },

            createRecordsCollection:  function (jsonData, opts) {
                var fieldsURL,
                    collection;
                opts.formID = parseInt(opts.dataType.split("_")[1]);
                opts.url = '/api/0/forms/' + opts.formID + '/data/';
                fieldsURL = '/api/0/forms/' + opts.formID + '/fields/';
                _.extend(opts, {
                    fillColor: this.getMarkerColor(),
                    fields: new Fields(opts.fields, { baseURL: fieldsURL }),
                    isCustomType: true,
                    isSite: true,
                    key: opts.dataType
                });
                collection = new Records(jsonData, opts);
                if (opts.fields.length == 0) {
                    opts.fields.fetch({ reset: true, success: () => {
                        this.attachFieldsToRecords(opts.fields, collection);
                    }});
                } else {
                    this.attachFieldsToRecords(opts.fields, collection);
                }
                return collection
            },

            getMarkerColor: function () {
                var index = this.colorCounter++ % this.formColors.length;
                return this.formColors[index];
            },

            deleteCollection: function (dataType) {
                delete this.dataDictionary[dataType];
                this.vent.trigger('datamanager-modified');
            },

            /*addNewRecordsCollection: function (dataType) {
                this.dataDictionary[dataType] = this.createRecordsCollection(dataType);
                this.vent.trigger('datamanager-modified');
            },*/

            each: function (f) {
                this.getLookup().forEach((obj) => {
                    f(this.getCollection(obj.id));
                });
            },

            getLookup: function () {
                /*
                Because order matters, returns a list of
                id / name pairs in the correct order. First
                sites, then custom data types, then media.
                */
                var collection,
                    dataType,
                    lookup = [
                        { id: "markers", name: "Sites", hasData: this.getCollection("markers").length > 0 }
                    ];
                for (dataType in this.dataDictionary) {
                    collection = this.dataDictionary[dataType];
                    if (collection.getIsCustomType()) {
                        lookup.push({
                            id: collection.getDataType(),
                            name: collection.getTitle(),
                            hasData: collection.length > 0
                        });
                    }
                };
                lookup.push.apply(lookup, [
                    { id: "photos", name: "Photos", hasData: this.getCollection("photos").length > 0 },
                    { id: "audio", name: "Audio", hasData: this.getCollection("audio").length > 0 },
                    { id: "videos", name: "Videos", hasData: this.getCollection("videos").length > 0 },
                    { id: "map_images", name: "Map Images", hasData: this.getCollection("map_images").length > 0 }
                ])
                return lookup;
            },

            getCollection: function (dataType) {
                if (!this.dataDictionary[dataType]) {
                    throw new Error("No collection found for " + dataType);
                }
                return this.dataDictionary[dataType];
            },

            getModel: function (dataType, id) {
                return this.dataDictionary[dataType].getModel(id);
            },

            getCollections: function () {
                return Object.entries(this.dataDictionary);
            }
        });
        return DataManager;
    });
