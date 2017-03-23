define(["models/base", "collections/layers"], function (Base, Layers) {
    "use strict";
    var Map = Base.extend({
        getNamePlural: function () {
            return "maps";
        },
        getMapBySlug: function (opts) {
            this.urlRoot = "/api/0/maps/" + opts.slug + "/";
            this.fetch({
                success: function () {
                    opts.successCallback();
                },
                error: function () {
                    console.error("map not found for url:", opts.slug);
                    if (opts.errorCallback) {
                        opts.errorCallback();
                    }
                }
            });
        },
        urlRoot: "/api/0/maps/",
        initialize: function (data, opts) {
            Base.prototype.initialize.apply(this, arguments);
            var panelStyles = this.get("panel_styles");
            if (!_.isUndefined(panelStyles) && _.isString(panelStyles)) {
                console.log("serialize");
                this.set("panel_styles", JSON.parse(panelStyles));
            }
            if (data.layers) {
                this.set("layers", new Layers(data.layers, {mapID: this.id}));
            }
		},
        defaults: function () {
            return _.extend({}, Base.prototype.defaults, {
                checked: false,
                panel_styles: {
                    title: {type: "title", font: "Lato", fw: "bold", color: "33ff52", size: "15"},
                    subtitle: {type: "subtitle", font: "Lato", fw: "regular", color: "gray", size: "12"},
                    paragraph: {type: "paragraph", font: "Lato", fw: "regular", color: "black", size: "12"},
                    tags: {type: "tags", font: "Lato", fw: "regular", color: "black", size: "10"}
                }
            });
        },

        getDefaultLocation: function () {
            return {
                zoom: this.get("zoom"),
                center: {
                    lat: this.get("center").coordinates[1],
                    lng: this.get("center").coordinates[0]
                }
            };
        },

        getDefaultSkin: function () {
            return {
                basemap: this.get("basemap")
            };
        },

        toJSON: function () {
            // ensure that the geometry object is serialized before it
            // gets sent to the server:
            var json = Base.prototype.toJSON.call(this);

            if (json.panel_styles != null) {
                json.panel_styles = JSON.stringify(json.panel_styles);
            }
            if (json.center != null) {
                json.center = JSON.stringify(json.center);
            }
            return json;
        }
    });
    return Map;
});
