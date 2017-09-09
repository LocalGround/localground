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
            var dataType = opts.dataType,
                projectID = opts.projectID,
                jsonData = opts.data,
                fieldData = opts.fieldData,
                overlayType = opts.overlay_type,
                fillColor = opts.fillColor,
                title = opts.name,
                isSite = false,
                isCustomType = false,
                isMedia = false,
                collection,
                fields;

            var initialize = function (opts) {
                switch (dataType) {
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
                        if (dataType.indexOf("form_") != -1) {
                            return createRecordsCollection();
                        }
                        throw new Error("case not handled");
                        break;
                }
            };

            

            /**************************************************/
            /* PUBLIC METHODS                                 */
            /**************************************************/

            this.getTitle = function () {
                return title;
            };
            this.getDataType = function () {
                return dataType;
            };
            this.getModelType = function () {
                return overlayType;
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
            this.getIsSite = function () {
                return isSite;
            };
            this.getIsCustomType = function () {
                return isCustomType;
            };
            this.getIsMedia = function () {
                return isMedia;
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
                model.set("overlay_type", overlayType);
                model.set("project_id", projectID);

                // If we get the form, pass in the custom field
                if (isCustomType) {
                    model.set("fields", fields.toJSON());
                }
                return model;
            };

            /* Call initialize function when object created */
            initialize(opts);
        };
        return DataEntry;
    });
