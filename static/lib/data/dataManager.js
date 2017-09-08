define(["underscore", "marionette", "models/project", "collections/tilesets", "lib/data/dataEntry"],
    function (_, Marionette, Project, TileSets, DataEntry) {
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
                this.initProject();
                this.initTilesets();
                this.listenTo(this.vent, "delete-collection", this.deleteCollection);
                this.listenTo(this.vent, "create-collection", this.addNewRecordsCollection);
            },
            initProject: function () {
                if (!this.model) {
                    this.model = new Project({ id: this.projectID });
                    this.model.fetch({ success: this.setCollections.bind(this) });
                } else {
                    this.setCollections();
                }
            },
            initTilesets: function () {
                this.tilesets = new TileSets();
                this.tilesets.fetch({reset: 'true'});
            },
            setCollections: function () {
                var that = this,
                    extras;
                _.each(this.model.get("children"), function (entry, key) {
                    entry.key = key;
                    entry.projectID = that.projectID;
                    that.dataDictionary[key] = new DataEntry(entry);
                    delete entry.data;
                });
                this.dataLoaded = true;
                this.vent.trigger('data-loaded');
            },

            deleteCollection: function (key) {
                delete this.dataDictionary[key];
                this.vent.trigger('datamanager-modified');
            },

            addNewRecordsCollection: function (key) {
                this.dataDictionary[key] = this.createRecordsCollection(key);
                this.vent.trigger('datamanager-modified');
            },

            each: function (f) {
                var key;
                for (key in this.dataDictionary) {
                    f(this.dataDictionary[key]);
                };
            },

            getLookup: function () {
                var lookup = [];
                this.each(function (entry) {
                    lookup.push({
                        id: entry.getDataType(),
                        name: entry.getTitle()
                    });
                });
                return lookup;
            },

            getData: function (key) {
                var entry = this.dataDictionary[key];
                if (entry) {
                    return entry;
                }
                throw new Error("No entry found for " + key);
            },

            getCollection: function (key) {
                return this.getData(key).getCollection();
            },

            getModel: function (key, id) {
                return this.dataDictionary[key].getModel(id);
            }
        });
        return DataManager;
    });
