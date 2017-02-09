define(["underscore", "jquery", "backbone", "form", "lib/maps/geometry/geometry", "lib/maps/geometry/point"],
    function (_, $, Backbone, Form, Geometry, Point) {
        "use strict";
        /**
         * An "abstract" Backbone Model; the root of all of the other
         * localground.model.* classes. Has some helper methods that help
         * the various models create forms to update models.
         * @class Base
         */
        var JSONFormatter = Form.JSONFormatter = function () {};
        var Base = Backbone.Model.extend({
            schema: {
                name: 'Text',
                caption: { type: 'TextArea'},
                tags: 'Text'
            },
            getNamePlural: function () {
                return this.get("overlay_type");
            },
            filterFields: [
                "name",
                "tags",
                "owner",
                "caption",
                "attribution"
            ],
            defaults: {
                name: "Untitled",
                isVisible: true
            },
            urlRoot: null, /* /api/0/forms/<form_id>/fields/.json */
            updateSchema: null,
            hiddenFields: [
                "geometry",
                "overlay_type",
                "project_id",
                "url",
                "num",
                "manually_reviewed"
            ],
            validatorFunction: function (value, formValues) {
                var err = {
                    type: 'json',
                    message: 'Value must be a JSON object'
                };
                try {
                    JSON.parse(value);
                    return null;
                } catch (e) {
                    if (value) { return err; }
                    return null;
                }
            },
            dataTypes: {
                'string': 'Text',
                'float': 'Number',
                'integer': 'Number',
                'boolean': 'Checkbox',
                'geojson': 'TextArea',
                'memo': 'TextArea',
                'json': 'TextArea'
            },
            initialize: function (data, opts) {
                opts = opts || {};
                this.generateUpdateSchema(opts.updateMetadata);
                //in case geometry comes in as stringified:
                var geom = this.get("geometry");
                if (!_.isUndefined(geom) && _.isString(geom)) {
                    this.set("geometry", JSON.parse(geom));
                }
            },
            setPointFromLatLng: function (lat, lng) {
                lat = lat || this.get("lat");
                lng = lng || this.get("lng");
                var geoJSON = this.get("geometry");
                if (geoJSON && geoJSON.type === "Point") {
                    if (lat) { geoJSON.coordinates[1] = lat; }
                    if (lng) { geoJSON.coordinates[0] = lng; }
                } else if (!geoJSON && lat && lng) {
                    geoJSON = {
                        type: 'Point',
                        coordinates: [lng, lat]
                    };
                } else {
                    geoJSON = null;
                }
                return geoJSON;
            },
            set: function (attributes, options) {
                // overriding set method so that whenever geoJSON gets set,
                // and geoJSON is a Point, then lat and lng also get set:
                if (attributes.hasOwnProperty("geometry") || attributes === "geometry") {
                    var geoJSON = attributes.geometry;
                    if (geoJSON && geoJSON.type === "Point") {
                        attributes.lat = geoJSON.coordinates[1];
                        attributes.lng = geoJSON.coordinates[0];
                    }
                }
                return Backbone.Model.prototype.set.call(this, attributes, options);
            },
            toJSON: function () {
                // ensure that the geometry object is serialized before it
                // gets sent to the server:
                var json = Backbone.Model.prototype.toJSON.call(this);
                if (json.geometry != null) {
                    json.geometry = JSON.stringify(json.geometry);
                }
                if (json.extras != null) {
                    json.extras = JSON.stringify(json.extras);
                }
                return json;
            },
            toTemplateJSON: function () {
                var json = Backbone.Model.prototype.toJSON.call(this);
                json.key = this.getKey();
                return json;
            },
            getKey: function () {
                return this.collection.key;
            },
            getCenter: function () {
                var geoJSON = this.get("geometry"),
                    point = new Point();
                if (!geoJSON) {
                    return null;
                }
                return point.getGoogleLatLng(geoJSON);
            },
            printLatLng: function (places) {
                var point = new Point();
                return point.printLatLng(this.get("geometry"), places);
            },
            setExtras: function (extras) {
                try {
                    extras = JSON.parse(extras);
                    this.set({ extras: extras }, { silent: true });
                } catch (e) {
                    this.set({ extras: null }, { silent: true });
                }
            },
            fetchCreateMetadata: function () {
                var that = this;
                if (!this.urlRoot) {
                    this.urlRoot = this.collection.url;
                }
                $.ajax({
                    url: this.urlRoot + '.json',
                    type: 'OPTIONS',
                    data: { _method: 'OPTIONS' },
                    success: function (data) {
                        that.createMetadata = data.actions.POST;
                    }
                });
            },
            fetchUpdateMetadata: function (callback) {
                var that = this;
                if (this.urlRoot == null) {
                    this.urlRoot = this.collection.url;
                }
                $.ajax({
                    url: this.urlRoot + this.id + '/.json',
                    type: 'OPTIONS',
                    data: { _method: 'OPTIONS' },
                    success: function (data) {
                        that.updateMetadata = data.actions.PUT;
                        callback();
                    }
                });
            },

            generateUpdateSchema: function (metadata) {
                this.updateSchema = this._generateSchema(metadata, true);
            },
            generateCreateSchema: function (metadata) {
                this.createSchema = this._generateSchema(metadata, true);
            },
            _generateSchema: function (metadata, edit_only) {
                //todo: eventually move this to its own class.
                if (!metadata) {
                    return null;
                }
                var schema = {}, key, val;
                //https://github.com/powmedia/backbone-forms#schema-definition
                for (key in metadata) {
                    val = metadata[key];
                    if (this.hiddenFields.indexOf(key) === -1) {
                        if (!edit_only || !val.read_only) {
                            //console.log(key);
                            schema[key] = {
                                type: this.dataTypes[val.type] || 'Text',
                                title: val.label || key,
                                help: val.help_text
                            };
                            if (val.choices) {
                                schema[key].type = 'Select';
                                schema[key].options = [];
                                _.each(val.choices, function (choice) {
                                    schema[key].options.push({
                                        val: choice.value,
                                        label: choice.display_name
                                    });
                                });
                            }
                            // TAP: Best way to do this?
                            if (schema[key].title == "tags") {
                                //schema[key].type = "List";

                            }
                            if (val.type.indexOf("json") != -1) {
                                schema[key].validators = [ this.validatorFunction ];
                            }
                        }
                    }

                }

                return schema;

            },
            setGeometryFromOverlay: function (googleOverlay) {
                var geomHelper = new Geometry(),
                    geoJSON = geomHelper.getGeoJSON(googleOverlay);
                this.set({
                    geometry: geoJSON
                });
                if (geoJSON.type === "Point") {
                    this.set({
                        lat: geoJSON.coordinates[1],
                        lng: geoJSON.coordinates[0]
                    });
                }
            }
        });
        return Base;
    });
