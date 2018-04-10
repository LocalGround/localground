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
                return new Layers([{
                    "id": 55,
                    "overlay_type": "layer",
                    "owner": "vanwars",
                    "title": "Flower Layer",
                    "dataset": 23,
                    "data_source": "form_2",
                    "group_by": "uniform",
                    "display_field": "name",
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
                    "map_id": 48,
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
                            "fillColor": "#4e70d4"
                        },
                        {
                            "fillOpacity": 1,
                            "title": "Uncategorized",
                            "strokeWeight": 1,
                            "isShowing": true,
                            "rule": "¯\\_(ツ)_/¯",
                            "height": 20,
                            "width": 20,
                            "shape": "circle",
                            "strokeOpacity": 1,
                            "strokeColor": "#FFFFFF",
                            "fillColor": "#4e70d4"
                        }
                    ]
                }], { projectID: projectJSON.id, mapID: mapID });
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
            console.log(this.map.getLayers());

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
            console.log(this.app);

        });
});
