define(["underscore", "marionette", "models/project",
        "collections/photos", "collections/audio", "collections/videos",
        "collections/mapimages", "collections/markers",
        "collections/records", "collections/fields", "collections/tilesets"],
    function (_, Marionette, Project, Photos, Audio, Videos, MapImages, Markers, Records, Fields, TileSets) {
        'use strict';
        var DataEntry = function (opts) {
            /**************************************************/
            /* PRIVATE VARIABLES / METHODS                    */
            /**************************************************/
            var key = opts.key,
                projectID = opts.projectID,
                jsonData = opts.data,
                fieldData = opts.fieldData,
                overlayType = opts.overlay_type,
                title = opts.title,
                collection,
                fields,
                isSite = false,
                isCustomType = false,
                isMedia = false;

            var initialize = function (opts) {
                switch (key) {
                    case "photos":
                        isMedia = true;
                        collection = new Photos(jsonData);
                        break;
                    case "audio":
                        isMedia = true;
                        collection = new Audio(jsonData);
                        break;
                    case "videos":
                        isMedia = true;
                        collection = new Videos(jsonData);
                        break;
                    case "markers":
                        isSite = true;
                        collection = new Markers(jsonData);
                        break;
                    case "map_images":
                        isMedia = true;
                        collection = new MapImages(jsonData);
                        break;
                    default:
                        if (key.indexOf("form_") != -1) {
                            return createRecordsCollection();
                        }
                        throw new Error("case not handled");
                        break;
                }
            };

            var attachFieldsToRecord = function (record) {
                fields.each(function (field) {
                    field.set("val", record.get(field.get("col_name")));
                });
                record.set('fields', fields.toJSON());
            };

            var attachFieldsToRecords = function () {
                // some extra post-processing for custom datatypes so that
                // it's easier to loop through fields and output corresponding
                // values
                var that = this;
                collection.each(function (record) {
                    attachFieldsToRecord(record);
                });
            };

            var createRecordsCollection = function () {
                var that = this,
                    formID = key.split("_")[1],
                    recordsURL = '/api/0/forms/' + formID + '/data/',
                    fieldsURL = '/api/0/forms/' + formID + '/fields/';
                fields = new Fields(fieldData, {url: fieldsURL });
                collection = new Records(jsonData, {
                    url: recordsURL,
                    key: key,
                    overlay_type: overlayType
                });
                collection.fillColor = "#CCCCCC";//this.formColors[this.colorCounter++];
                if (fields.length == 0) {
                    fields.fetch({ reset: true, success: function () {
                        attachFieldsToRecords();
                    }});
                } else {
                    attachFieldsToRecords();
                }
            };

            /**************************************************/
            /* PUBLIC METHODS                                 */
            /**************************************************/

            this.getTitle = function () {
                return title;
            };
            this.getDataType = function () {
                return key;
            };
            this.getModelType = function () {
                return key;
            };
            this.getCollection = function () {
                return collection
            };
            this.getFields = function () {
                return fields
            };
            this.getIsCustomType = function () {
                return isCustomType;
            };
            this.getModel = function (id) {
                var model = collection.get(id);
                if (!model) {
                    model = this.createNewModel();
                }
                return model;
            };
            this.createNewModel = function () {
                var ModelClass = collection.model,
                model = new ModelClass();
                model.collection = collection;
                model.set("overlay_type", collection.key);
                model.set("project_id", projectID);

                // If we get the form, pass in the custom field
                if (collection.key.indexOf("form_") != -1) {
                    model.set("fields", fields.toJSON());
                }
                return model;
            };

            /* Call initialize function when object created */
            initialize(opts);
        };
        return DataEntry;
    });
