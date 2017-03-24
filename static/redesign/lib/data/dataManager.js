define(["underscore", "marionette", "models/project", "collections/photos",
        "collections/audio", "collections/mapimages", "collections/markers",
        "collections/records", "collections/fields"],
    function (_, Marionette, Project, Photos, Audio, MapImages, Markers, Records, Fields) {
        'use strict';
        var DataManager = Marionette.ItemView.extend({
            dataDictionary: {},
            template: false,
            isEmpty: function () {
                return Object.keys(this.dataDictionary).length === 0;
            },
            initialize: function (opts) {
                //todo: remove app dependency and pass in projectID and vent
                _.extend(this, opts);
                if (!this.model) {
                    this.model = new Project({ id: this.projectID });
                    this.model.fetch({ success: this.setCollections.bind(this) });
                } else {
                    this.setCollections();
                }
            },
            setCollections: function () {
                var that = this,
                    extras;
                _.each(this.model.get("children"), function (entry, key) {
                    that.dataDictionary[key] = entry;
                    extras = that.initCollection(key, entry.data);
                    _.extend(that.dataDictionary[key], extras);
                    delete entry.data;
                });
                this.vent.trigger('data-loaded');
            },
            getDataSources: function () {
                var dataSources = [
                    { value: "markers", name: "Markers" }
                ];
                _.each(this.dataDictionary, function (entry, key) {
                    if (key.indexOf("form_") != -1) {
                        dataSources.push({
                            value: key,
                            name: entry.name
                        });
                    }
                });
                dataSources = dataSources.concat([
                    { value: "photos", name: "Photos" },
                    { value: "audio", name: "Audio" },
                    { value: "map_images", name: "Map Images" }
                ]);
                return dataSources;
            },
            getData: function (key) {
                var entry = this.dataDictionary[key];
                if (entry) {
                    return entry;
                }
                alert("No entry found for " + key);
                return null;
            },
            getCollection: function (key) {
                var entry = this.dataDictionary[key];
                if (entry) {
                    return entry.collection;
                }
                alert("No entry found for " + key);
                return null;
            },
            initCollection: function (key, data) {
                switch (key) {
                case "photos":
                    return { collection: new Photos(data) };
                case "audio":
                    return { collection: new Audio(data) };
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
                            records = new Records(data, { url: recordsURL }),
                            fields = new Fields(null, {url: fieldsURL });
                        fields.fetch({ reset: true, success: function () {
                            // some extra post-processing for custom datatypes so that
                            // it's easier to loop through fields and output corresponding
                            // values
                            records.each(function (record) {
                                fields.each(function (field) {
                                    field.set("val", record.get(field.get("col_name")));
                                });
                                record.set('fields', fields.toJSON());
                            });
                        }});
                        return {
                            collection: records,
                            fields: fields,
                            isCustomType: true,
                            isSite: true
                        };
                    }
                    alert("case not handled");
                    return null;
                }
            }
        });
        return DataManager;
    });
