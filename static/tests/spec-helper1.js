var google = {};
define([
        "jquery",
        "underscore",
        "backbone",
        "marionette",
        "lib/data/dataManager",
        "collections/layers",
        "lib/appUtilities",
        "apps/main/router",
        "lib/modals/modal"
    ], function ($, _, Backbone, Marionette, DataManager, Layers, appUtilities, Router,
            Modal) {
        'use strict';
        afterEach(function () {
            $('body').find('.colorpicker, .modal, #map_canvas').remove();
            $('body').find('.success-message, .warning-message, .failure-message').remove();
        });
        beforeEach(function () {
            //spoof google maps API:
            google.maps = {
                event: {
                    addListenerOnce: function () {},
                    addListener: function () {},
                    trigger: function () {},
                    clearListeners: function () {}
                },
                LatLngBounds: function () {},
                LatLng: function (lat, lng) {
                    return [lat, lng];
                },
                MapTypeControlStyle: {
                    DROPDOWN_MENU: 'DROPDOWN_MENU'
                },
                ControlPosition: {
                    TOP_LEFT: 'DROPDOWN_MENU'
                },
                ZoomControlStyle: {
                    SMALL: "small"
                },
                Map: function (elem, opts) {
                    this.elem = elem;
                    this.opts = opts;
                    this.fitBounds = function () {};
                    this.setCenter = function () {};
                    this.getCenter = function () {
                        return {
                            lat: function () { return 84; },
                            lng: function () { return -122; }
                        };
                    };
                    this.getZoom = function () {
                        return 18;
                    };
                    this.getMapTypeId = function () {
                        return 5;
                    };
                },
                Marker: function () {
                    return {
                        setOptions: function () {},
                        setMap: function () {}
                    };
                },
                Point: function () {
                    return;
                }
            };
            var $map_container = $('<div id="map_canvas"></div>');
            $(document.body).append($map_container);

            // SAFETY MEASURES: makes sure that nothing interacts w/database.
            spyOn(Backbone, 'sync').and.callFake(function (method, model, opts, error) {
                //console.log("Backbone sync intercepted")
                //console.log(method, model, opts, error);
                if (opts && opts.success) {
                    opts.success({ foo: 'fake' });
                }
            });

            this.vent = _.extend({}, Backbone.Events);

            this.getProjectJSON = () => {
                return JSON.parse(JSON.stringify(projectJSON));
            };
            this.getLayers = (mapID) => {
                return new Layers([ {
                    "id": 62,
                    "overlay_type": "layer",
                    "owner": "riley",
                    "title": "Buildings Layer",
                    "dataset": 3,
                    "data_source": "form_3",
                    "group_by": "uniform",
                    "display_field": "col_11",
                    "ordering": 1,
                    "metadata": {
                        "strokeWeight": 1,
                        "buckets": 4,
                        "isShowing": true,
                        "strokeOpacity": 1,
                        "width": 20,
                        "shape": "circle",
                        "fillOpacity": 1,
                        "strokeColor": "#ffffff",
                        "paletteId": 0,
                        "fillColor": "#4e70d4"
                    },
                    "map_id": 22,
                    "symbols": [
                        {
                            "fillOpacity": 1,
                            "title": "Untitled Symbol",
                            "strokeWeight": 1,
                            "isShowing": true,
                            "strokeOpacity": 1,
                            "height": 20,
                            "width": 20,
                            "shape": "circle",
                            "rule": "*",
                            "strokeColor": "#ffffff",
                            "id": 1,
                            "fillColor": "#ffdd33"
                        },
                        {
                            "fillOpacity": 1,
                            "title": "Uncategorized",
                            "strokeWeight": 1,
                            "isShowing": false,
                            "rule": "¯\\_(ツ)_/¯",
                            "height": 20,
                            "width": 20,
                            "shape": "circle",
                            "strokeOpacity": 1,
                            "strokeColor": "#FFFFFF",
                            "fillColor": "#4e70d4"
                        }
                    ]
                },
                {
                    "id": 63,
                    "overlay_type": "layer",
                    "owner": "riley",
                    "title": "Trees Layer",
                    "dataset": 2,
                    "data_source": "form_2",
                    "group_by": "height",
                    "display_field": "height",
                    "ordering": 2,
                    "metadata": {
                        "fillOpacity": 1,
                        "currentProp": "height",
                        "strokeWeight": 1,
                        "buckets": 4,
                        "isShowing": true,
                        "strokeOpacity": 1,
                        "width": 20,
                        "shape": "circle",
                        "isContinuous": true,
                        "strokeColor": "#ffffff",
                        "paletteId": 0,
                        "fillColor": "#4e70d4"
                    },
                    "map_id": 22,
                    "symbols": [
                        {
                            "fillOpacity": 1,
                            "title": "between 0 and 21",
                            "strokeWeight": 1,
                            "rule": "height >= 0 and height < 21",
                            "isShowing": true,
                            "strokeOpacity": 1,
                            "height": 20,
                            "width": 20,
                            "shape": "circle",
                            "fillColor": "#eff3ff",
                            "strokeColor": "#ffffff",
                            "id": 1,
                            "paletteId": 0
                        },
                        {
                            "fillOpacity": 1,
                            "title": "between 21 and 43",
                            "strokeWeight": 1,
                            "rule": "height >= 21 and height < 43",
                            "isShowing": true,
                            "strokeOpacity": 1,
                            "height": 20,
                            "width": 20,
                            "shape": "circle",
                            "fillColor": "#bdd7e7",
                            "strokeColor": "#ffffff",
                            "id": 2,
                            "paletteId": 0
                        },
                        {
                            "fillOpacity": 1,
                            "title": "between 43 and 64",
                            "strokeWeight": 1,
                            "rule": "height >= 43 and height < 64",
                            "isShowing": true,
                            "strokeOpacity": 1,
                            "height": 20,
                            "width": 20,
                            "shape": "circle",
                            "fillColor": "#6baed6",
                            "strokeColor": "#ffffff",
                            "id": 3,
                            "paletteId": 0
                        },
                        {
                            "fillOpacity": 1,
                            "title": "between 64 and 85",
                            "strokeWeight": 1,
                            "rule": "height >= 64 and height < 85",
                            "isShowing": true,
                            "strokeOpacity": 1,
                            "height": 20,
                            "width": 20,
                            "shape": "circle",
                            "fillColor": "#2171b5",
                            "strokeColor": "#ffffff",
                            "id": 4,
                            "paletteId": 0
                        },
                        {
                            "fillOpacity": 1,
                            "title": "Uncategorized",
                            "strokeWeight": 1,
                            "isShowing": false,
                            "rule": "¯\\_(ツ)_/¯",
                            "height": 20,
                            "width": 20,
                            "shape": "circle",
                            "strokeOpacity": 1,
                            "strokeColor": "#FFFFFF",
                            "paletteId": 0,
                            "id": 5,
                            "fillColor": "#undefined"
                        }
                    ]
                }
        ], { projectID: projectJSON.id, mapID: mapID });
            };

            this.dataManager = new DataManager({
                projectJSON: this.getProjectJSON(),
                vent: this.vent
            });

            this.photos = this.dataManager.getCollection('photos');
            this.photo = this.photos.at(0);
            this.photos = this.dataManager.getCollection('audio');
            this.form_2 = this.dataManager.getCollection('form_2');
            this.form_3 = this.dataManager.getCollection('form_3');
            this.map = this.dataManager.getMaps().get(3);
            this.map.set('layers', this.getLayers(this.map.id));
            //console.log(this.map);

            //spoof the main-app for child view testing
            this.app = _.extend({}, appUtilities);
            _.extend(this.app, {
                username: "Tester",
                vent: this.vent,
                dataManager: this.dataManager,
                modal: new Modal(),
                basemapView: {
                    getCenter: function () {
                        return {
                            lat: function () { return 84; },
                            lng: function () { return -122; }
                        };
                    },
                    getMapTypeId:  function () {
                        return 5;
                    },
                    getZoom: function () {
                        return 18;
                    }
                },
                router: new Router({ app: this }),
                start: function (options) {
                    Backbone.history.start();
                }
            });

        });
});
