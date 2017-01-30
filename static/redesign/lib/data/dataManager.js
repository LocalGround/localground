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
                var that = this;
                _.each(this.model.get("children"), function (entry, key) {
                    that.dataDictionary[key] = entry;
                    that.dataDictionary[key].data = that.initCollection(key, entry.data);
                });
                this.app.vent.trigger('data-loaded');
                console.log(this.getDataSources());
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
            getCollection: function (key) {
                return this.dataDictionary[key].data;
            },
            initCollection: function (key, data) {
                switch (key) {
                case "photos":
                    return new Photos(data);
                case "audio":
                    return new Audio(data);
                case "markers":
                    return new Markers(data);
                case "map_images":
                    return new MapImages(data);
                default:
                    if (key.indexOf("form_") != -1) {
                        var url = '/api/0/forms/' + key.split("_")[1] + '/data/';
                        return new Records(data, { url: url });
                    }
                    alert("case not handled");
                    return null;
                }
            }
        });
        return DataManager;
    });
