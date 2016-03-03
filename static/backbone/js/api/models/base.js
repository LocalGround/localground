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
            _generateSchema: function (metadata, edit_only) {
                if (!metadata) {
                    return null;
                }
                var schema = {}, key, val;
                //https://github.com/powmedia/backbone-forms#schema-definition
                for (key in metadata) {
                    val = metadata[key];
                    if (this.hiddenFields.indexOf(key) === -1) {
                        if (!edit_only || !val.read_only) {
                            schema[key] = {
                                type: this.dataTypes[val.type] || 'Text',
                                title: val.label || key,
                                help: val.help_text
                            };
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
            setGeometry: function (googleOverlay) {
                var geomHelper = new Geometry();
                this.set({
                    geometry: geomHelper.getGeoJSON(googleOverlay)
                });
            }
        });
        return Base;
    });
