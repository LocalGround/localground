define(["underscore", "marionette", "models/project", "collections/photos",
        "collections/audio", "collections/mapimages", "collections/markers",
        "collections/records", "collections/fields"],
    function (_, Marionette, Project, Photos, Audio, MapImages, Markers, Records, Fields) {
        'use strict';
        var DataManager = Marionette.ItemView.extend({
            dataDictionary: {},
            template: false,
            initialize: function (opts) {
                _.extend(this, opts);
                this.model = new Project({ id: this.app.getProjectID() });
                this.model.fetch({ success: this.setCollections.bind(this) });
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
                this.app.vent.trigger('data-loaded');
            },
            getDataSources: function () {
                var dataSources = [];
                _.each(this.dataDictionary, function (entry, key) {
                    dataSources.push({
                        value: key,
                        name: entry.name
                    });
                });
                return dataSources;
            },
            getData: function (key) {
                return this.dataDictionary[key];
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
                            fields = new Fields(null, {url: fieldsURL });
                        fields.fetch();
                        return {
                            collection: new Records(data, { url: recordsURL }),
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
