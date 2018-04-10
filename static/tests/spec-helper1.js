var google = {};
define([
        "jquery",
        "underscore",
        "backbone",
        "marionette",
        "lib/data/dataManager",
        "lib/appUtilities",
        "apps/main/router",
        "lib/modals/modal"
    ], function ($, _, Backbone, Marionette, DataManager, appUtilities, Router,
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

            this.dataManager = new DataManager({
                projectJSON: this.getProjectJSON(),
                vent: this.vent
            });

            this.photos = this.dataManager.getCollection('photos');
            this.photo = this.photos.at(0);
            this.photos = this.dataManager.getCollection('audio');
            this.form_2 = this.dataManager.getCollection('form_2');
            this.form_3 = this.dataManager.getCollection('form_3');
            this.map = this.dataManager.maps.get(3);
            console.log(this.map);
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
                }

                router: new Router({ app: this }),
                start: function (options) {
                    Backbone.history.start();
                }
            });
            console.log(this.app);

        });
});
