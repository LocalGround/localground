define(["underscore", "marionette", "models/project", "collections/photos",
        "collections/audio", "collections/videos", "collections/mapimages", "collections/markers",
        "collections/records", "collections/fields", "collections/tilesets"],
    function (_, Marionette, Project, Photos, Audio, Videos, MapImages, Markers, Records, Fields, TileSets) {
        'use strict';
        var DataManager = Marionette.ItemView.extend({
            dataDictionary: {},
            formColors: ['#60C7CC', '#CF2045', '#A3A737', '#F27CA5'],
            colorCounter: 0,
            dataLoaded: false,
            template: false,
            isEmpty: function () {
                return Object.keys(this.dataDictionary).length === 0;
            },
            initialize: function (opts) {
                //todo: remove app dependency and pass in projectID and vent
                _.extend(this, opts);
                if (typeof this.projectID === 'undefined') {
                    window.location = '/';
                    return false;
                }
                if (!this.model) {
                    this.model = new Project({ id: this.projectID });
                    this.model.fetch({ success: this.setCollections.bind(this) });
                } else {
                    this.setCollections();
                }
                this.tilesets = new TileSets();
                this.tilesets.fetch({reset: 'true'});
            },
            setCollections: function () {
                var that = this,
                    extras;
                _.each(this.model.get("children"), function (entry, key) {
                    that.dataDictionary[key] = entry;
                    extras = that.initCollection(key, entry.data, entry.fields, entry.overlay_type);
                    _.extend(that.dataDictionary[key], extras);
                    delete entry.data;
                });
                this.dataLoaded = true;
                this.vent.trigger('data-loaded');
            },
            getDataSources: function () {
                var dataSources = [
                    { value: "markers", name: "Sites" }
                ];
                _.each(this.dataDictionary, function (entry, key) {
                    if (key.includes("form_")) {
                        dataSources.push({
                            value: key,
                            name: entry.name
                        });
                    }
                });
                dataSources = dataSources.concat([
                    { value: "photos", name: "Photos" },
                    { value: "audio", name: "Audio" },
                    { value: "videos", name: "Videos" },
                    { value: "map_images", name: "Map Images" }
                ]);
                return dataSources;
            },
            getData: function (key) {
                console.log("getting data...", key);
                var entry = this.dataDictionary[key];
                if (entry) {
                    return entry;
                }
                throw new Error("No entry found for " + key);
            },
            getCollection: function (key) {
                var entry = this.dataDictionary[key];
                console.log(this.dataDictionary);
                if (entry) {
                    return entry.collection;
                }
                throw new Error("No entry found for " + key);
            },
            initCollection: function (key, data, fieldCollection, overlay_type) {
                switch (key) {
                case "photos":
                    return { collection: new Photos(data) };
                case "audio":
                    return { collection: new Audio(data) };
                case "videos":
                    return { collection: new Videos(data) };
                case "markers":
                    return {
                        collection: new Markers(data),
                        isSite: true
                    };
                case "map_images":
                    return { collection: new MapImages(data) };
                default:
                    // in addition to defining the collection, also define the fields:
                    if (key.indexOf("form_") != -1) {
                        var formID = key.split("_")[1],
                            recordsURL = '/api/0/forms/' + formID + '/data/',
                            fieldsURL = '/api/0/forms/' + formID + '/fields/',
                            records = new Records(data, {
                                url: recordsURL,
                                key: 'form_' + formID,
                                overlay_type: overlay_type
                            }),
                            fields = fieldCollection || new Fields(null, {url: fieldsURL }),
                            that = this;
                        records.fillColor = this.formColors[this.colorCounter++];
                        if (fields.length == 0) {
                            fields.fetch({ reset: true, success: function () {
                                that.attachFieldsToRecords(records, fields);
                            }});
                        } else {
                            this.attachFieldsToRecords(records, fields);
                        }
                        return {
                            collection: records,
                            fields: fields,
                            isCustomType: true,
                            isSite: true
                        };
                    }
                    throw new Error("case not handled");
                    return null;
                }
            },
            getModel: function (dataType, id) {
                var entry = this.getData(dataType),
                    collection = entry.collection,
                    fields = entry.fields,
                    model,
                    ModelClass;
                if (id) {
                    return collection.get(id);
                }
                ModelClass = collection.model,
                model = new ModelClass();
                model.collection = collection;
                model.set("overlay_type", collection.key);
                model.set("project_id", this.projectID);

                // If we get the form, pass in the custom field
                if (collection.key.indexOf("form_") != -1) {
                    model.set("fields", fields.toJSON());
                }
                return model;
            },
            attachFieldsToRecord: function (record, fields) {
                fields.each(function (field) {
                    field.set("val", record.get(field.get("col_name")));
                });
                record.set('fields', fields.toJSON());
            },
            attachFieldsToRecords: function (records, fields) {
                // some extra post-processing for custom datatypes so that
                // it's easier to loop through fields and output corresponding
                // values
                var that = this;
                records.each(function (record) {
                    that.attachFieldsToRecord(record, fields);
                });
            }
        });
        return DataManager;
    });
