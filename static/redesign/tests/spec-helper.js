var google = {};
define(
    [
        "backbone",
        "jquery",
        "lib/appUtilities",
        "collections/projects",
        "collections/photos",
        "collections/audio",
        "collections/maps",
        "collections/mapimages",
        "collections/markers",
        "collections/records",
        "collections/prints",
        "models/project",
        "models/photo",
        "models/marker",
        "models/audio",
        "models/record",
        "models/map",
        "models/mapimage",
        "models/print",
        "models/form",
        "lib/data/dataManager"
    ],
    function (Backbone, $, appUtilities, Projects, Photos, AudioFiles, Maps,
              MapImages, Markers, Records, Prints, Project, Photo, Marker,
              Audio, Record, Map, MapImage, Print, Form, DataManager) {
        'use strict';
        beforeEach(function () {
            //spoof google maps API:
            google.maps = {
                event: { addListenerOnce: function () {} },
                LatLngBounds: function () {},
                LatLng: function(lat, lng) {}            
            };
            var $map_container = $('<div id="map_canvas"></div>');
            $(document.body).append($map_container);

            // SAFETY MEASURES: makes sure that nothing interacts w/database.
            spyOn(Backbone, 'sync').and.callFake(function (method, model, opts, error) {
                console.log("Backbone sync intercepted");
                if (opts && opts.success) {
                    opts.success({ foo: 'fake' });
                }
            });
            /*spyOn($, 'ajax').and.callFake(function () {
                console.log("AJAX call intercepted");
            });*/
            // END SAFETY MEASURES

            this.getModelByOverlayType = function (overlay_type) {
                var model;
                if (overlay_type == "map-image") {
                    model = this.map_images.at(0);
                } else if (overlay_type == "photo") {
                    model = this.photos.at(0);
                } else if (overlay_type == "audio") {
                    model = this.audioFiles.at(0);
                } else if (overlay_type == "marker") {
                    model = this.markers.at(0);
                } else if (overlay_type == "record") {
                    model = this.form_1.at(0);
                } else if (overlay_type == "print") {
                    model = this.prints.at(0);
                } else if (overlay_type == "project") {
                    model = this.projects.at(0);
                }
                return model;
            };

            /**
             * Adds some dummy data for testing convenience.
             * Availabe to all of the tests.
             */
             this.testMap = new Map({
                "url": "http://localhost:7777/api/0/maps/1/",
                "id": 1,
                "name": "Berkeley Public Art",
                "caption": "A map of public art around Berkeley",
                "overlay_type": "styled_map",
                "tags": [
                    "tag1",
                    "tag2",
                    "tag3"
                ],
                "owner": "riley2",
                "slug": "berkeley-art",
                "sharing_url": "berkeley-art",
                "center": {
                    "type": "Point",
                    "coordinates": [
                        -122.04732196997611,
                        37.75351445273666
                    ]
                },
                "basemap": 5,
                "zoom": 8,
                "panel_styles": {
                    "title": {
                        "color": "33ff52",
                        "font": "Lato",
                        "type": "title",
                        "size": 28,
                        "fw": "bold"
                    },
                    "paragraph": {
                        "color": "ffa84c",
                        "font": "bebas",
                        "type": "title",
                        "size": 21,
                        "fw": "bold"
                    },
                    "subtitle": {
                        "color": "33ff52",
                        "font": "Lato",
                        "type": "title",
                        "size": 15,
                        "fw": "bold"
                    },
                    "tags": {
                        "color": "33ff52",
                        "font": "Lato",
                        "type": "title",
                        "size": 15,
                        "fw": "bold"
                    }
                },
                "project_id": 3,
                "layers": [
                    {
                        "id": 3,
                        "title": "untitled",
                        "data_source": "form_1",
                        "symbol_shape": "fa-circle",
                        "layer_type": "categorical",
                        "filters": [
                            {
                                "tag": "nothing"
                            }
                        ],
                        "map_id": 1,
                        "symbols": [
                            {
                                "title": "1 - 5",
                                "strokeWeight": 1,
                                "rule": "worm_count > 0 and worm_count < 6",
                                "height": 32,
                                "width": 32,
                                "shape": "worm",
                                "strokeColor": "#FFF",
                                "color": "#d7b5d8"
                            },
                            {
                                "title": "6 - 10",
                                "strokeWeight": 1,
                                "rule": "worm_count > 5 and worm_count < 11",
                                "height": 32,
                                "width": 32,
                                "shape": "worm",
                                "strokeColor": "#FFF",
                                "color": "#df65b0",
                                "is_showing": true
                            },
                            {
                                "title": "11 or more",
                                "strokeWeight": 1,
                                "rule": "worm_count >= 11",
                                "height": 32,
                                "width": 32,
                                "shape": "worm",
                                "strokeColor": "#FFF",
                                "color": "#ce1256"
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "title": "Murals",
                        "data_source": "form_1",
                        "symbol_shape": "fa-circle",
                        "layer_type": "categorical",
                        "filters": [
                            {
                                "tag": "nothing"
                            }
                        ],
                        "map_id": 1,
                        "symbols": [
                            {
                                "color": "#7075FF",
                                "width": 30,
                                "rule": "sculptures > 0",
                                "title": "At least 1 sculpture"
                            }
                        ]
                    },
                    {
                        "id": 1,
                        "title": "Murals",
                        "data_source": "form_1",
                        "symbol_shape": "circle",
                        "layer_type": "continuous",
                        "filters": {
                            "tags": "nothing"
                        },
                        "map_id": 1,
                        "symbols": [
                            {
                                "color": "#7075FF",
                                "width": 30,
                                "rule": "murals > 0",
                                "title": "At least 1 mural"
                            },
                            {
                                "color": "#F011D9",
                                "width": 30,
                                "rule": "murals = 0",
                                "title": "No murals"
                            }
                        ]
                    }
                ],
                "layers_url": "http://localhost:7777/api/0/maps/1/layers/"
            });
            this.layer = this.testMap.get("layers").at(0);
            this.layers = this.testMap.get("layers");
            this.maps = new Maps([this.mapTest]);
            this.form = new Form({
                "url": "http://localhost:7777/api/0/forms/1/",
                "id": 1,
                "name": "Test Form",
                "caption": "",
                "overlay_type": "form",
                "tags": [],
                "owner": "MrJBRPG",
                "data_url": "http://localhost:7777/api/0/forms/1/data/",
                "fields_url": "http://localhost:7777/api/0/forms/1/fields/",
                "slug": "slug_64358",
                "project_ids": [
                    3
                ],
                "fields": [
                    {
                        "id": 1,
                        "form": 1,
                        "col_alias": "Test Text",
                        "col_name": "test_text",
                        "is_display_field": true,
                        "ordering": 1,
                        "data_type": "text",
                        "url": "http://localhost:7777/api/0/forms/1/fields/1"
                    },
                    {
                        "id": 19,
                        "form": 1,
                        "col_alias": "Test Integer",
                        "col_name": "test_integer",
                        "is_display_field": true,
                        "ordering": 2,
                        "data_type": "integer",
                        "url": "http://localhost:7777/api/0/forms/1/fields/19"
                    },
                    {
                        "id": 20,
                        "form": 1,
                        "col_alias": "Test Boolean",
                        "col_name": "test_boolean",
                        "is_display_field": true,
                        "ordering": 3,
                        "data_type": "boolean",
                        "url": "http://localhost:7777/api/0/forms/1/fields/20"
                    }
            ]});
            this.photos = new Photos([
                new Photo({ id: 1, name: "Cat", tags: 'animal, cat, cute, tag1', project_id: 1, overlay_type: "photo", caption: "Caption1", owner: "Owner1", attribution: "Owner1", geometry: {"type": "Point", "coordinates": [-122.294, 37.864]}, path_small: '//:0', path_medium: "//:0", path_large: "//:0", path_medium_sm: '//:0', path_marker_sm: "//:0" }),
                new Photo({id: 2, name: "Dog", tags: 'animal, dog', project_id: 1, overlay_type: "photo", caption: "Caption1", owner: "Owner1", geometry: { type: "Point", coordinates: [-122.2943, 37.8645] }, path_medium_sm: '//:0', path_medium: '//:0', path_small: '//:0', path_marker_sm: "//:0" }),
                new Photo({id: 3, name: "Frog", tags: 'animal, amphibian, cute, frog', project_id: 2, overlay_type: "photo", caption: "Caption1", owner: "Owner1", geometry: { type: "Point", coordinates: [-122.2943, 37.8645] }, path_medium_sm: '//:0', path_small: '//:0', path_medium: "//:0", path_large: "//:0", path_marker_sm: '//:0' })
            ]);
            this.audioFiles = new AudioFiles([
                new Audio({ id: 1, name: "Nirvana", tags: '90s, grunge', project_id: 1, overlay_type: "audio", caption: "Caption1", file_path: "/static/redesign/tests/spec/javascripts/fixtures/sample-audio.mp3", geometry: {"type": "Point", "coordinates": [-122.294, 37.864]} }),
                new Audio({id: 2, name: "Duran Duran", tags: '80s, amazing, tag1', project_id: 1, overlay_type: "audio", caption: "caption 2", file_path: "/static/redesign/tests/spec/javascripts/fixtures/sample-audio.mp3" }),
                new Audio({id: 3, name: "Flo Rida", tags: 'florida, hip hop', project_id: 2, overlay_type: "audio", caption: "caption 3", file_path: "/static/redesign/tests/spec/javascripts/fixtures/sample-audio.mp3" })
            ]);
            this.map_images = new MapImages([
                new MapImage({ id: 1, name: "Map 1", tags: 'parks, oakland', project_id: 1, caption: "Caption1", overlay_type: "map-image", geometry: { type: "Polygon", coordinates: [[[ -82.54, 35.62 ], [ -82.54, 35.62 ], [ -82.54, 35.62 ], [ -82.54, 35.62 ], [ -82.54, 35.62 ]]]} }),
                new MapImage({id: 2, name: "Map 2", tags: 'parks, berkeley, tag1', project_id: 1, overlay_type: "map-image" }),
                new MapImage({id: 3, name: "Map 3", tags: 'emeryville', project_id: 2, overlay_type: "map-image" })
            ]);
            this.prints = new Prints([
                new Print({ id: 1, name: "Print 1", tags: 'parks, oakland', project_id: 1, caption: "Caption1", overlay_type: "print", geometry: { type: "Polygon", coordinates: [[[ -82.54, 35.62 ], [ -82.54, 35.62 ], [ -82.54, 35.62 ], [ -82.54, 35.62 ], [ -82.54, 35.62 ]]]} }),
                new Print({id: 2, name: "Print 2", tags: 'parks, berkeley, tag1', project_id: 1, overlay_type: "print" }),
                new Print({id: 3, name: "Print 3", tags: 'emeryville', project_id: 2, overlay_type: "print" })
            ]);
            this.markers = new Markers([
                new Marker({ id: 1, name: "POI 1", tags: 'my house', project_id: 1, overlay_type: "marker", caption: "Caption1", color: "FF0000", geometry: {"type": "Point", "coordinates": [-122.294, 37.864]} }),
                new Marker({id: 2, name: "POI 2", tags: 'friend\'s house, tag1', project_id: 1, overlay_type: "marker" }),
                new Marker({id: 3, name: "POI 3", tags: 'coffee shop, tag1', project_id: 2, overlay_type: "marker" })
            ]);
            this.form_1 = new Records([
                new Record({ id: 1, team_name: "Blue team", display_name: "Blue team", tags: 'my house', worm_count: 4, project_id: 1, overlay_type: "form_1", geometry: {"type": "Point", "coordinates": [-122.294, 37.864]} }),
                new Record({id: 2, team_name: "Green team", tags: 'friend\'s house, tag1', worm_count: 8, project_id: 1, overlay_type: "form_1" }),
                new Record({id: 3, team_name: "Red team", tags: 'coffee shop', worm_count: 12, project_id: 2, overlay_type: "form_1" })
            ], { 'url': 'dummy/url' });

            this.dataDictionary = {
                photos: this.photos,
                audio: this.audioFiles,
                map_images: this.map_images,
                markers: this.markers,
                form_1: this.form_1
            };

            this.projectsLite = new Projects([
                new Project({ id: 1, name: "Project 1", overlay_type: "project" }),
                new Project({ id: 2, name: "Project 2", overlay_type: "project" }),
                new Project({ id: 3, name: "Project 3", overlay_type: "project" }),
                new Project({ id: 4, name: "Project 4", overlay_type: "project" }),
                new Project({ id: 5, name: "Project 5", overlay_type: "project" })
            ]);

            this.projects = new Projects([
                new Project({ id: 1, name: "Project 1", tags: 'tag1, tag2', overlay_type: "project",
                    children: {
                        photos: {
                            name: "Photos",
                            id: "photos",
                            overlay_type: "photo",
                            data: this.photos.toJSON()
                        },
                        audio: {
                            name: "Audio",
                            id: "audio",
                            overlay_type: "audio",
                            data: this.audioFiles.toJSON()
                        },
                        map_images: {
                            name: "Map-Images",
                            id: "map-images",
                            overlay_type: "map-image",
                            data: this.map_images.toJSON()
                        },
                        markers: {
                            name: "Markers",
                            id: "markers",
                            overlay_type: "marker",
                            data: this.markers.toJSON()
                        },
                        form_1: {
                            name: "Team Members",
                            id: "form_1",
                            overlay_type: "form_1",
                            data: this.form_1.toJSON()
                        }
                    }}),
                new Project({ id: 2, name: "Project 2", tags: 'tag3, tag2', overlay_type: "project",
                    children: {
                        form_1: {
                            name: "Soil Form",
                            id: "form_1",
                            overlay_type: "record",
                            data: this.form_1.toJSON()
                        },
                        markers: {
                            name: "Markers",
                            id: "markers",
                            overlay_type: "marker",
                            data: this.markers.toJSON()
                        }
                    }}),
                new Project({ id: 3, name: "Blah", tags: 'tag6, tag7', overlay_type: "project",
                    children: {
                        photos: {
                            name: "Photos",
                            id: "photos",
                            overlay_type: "photo",
                            data: this.photos.toJSON()
                        },
                        audio: {
                            name: "Audio",
                            id: "audio",
                            overlay_type: "audio",
                            data: this.audioFiles.toJSON()
                        },
                        map_images: {
                            name: "Map-Images",
                            id: "map-images",
                            overlay_type: "map-image",
                            data: this.map_images.toJSON()
                        }
                    }})
            ]);
            this.tilesets = [
                {"sourceName": "mapbox", "max": 19, "is_printable": true, "providerID": "lg.i1p5alka", "id": 1, "typeID": 1, "name": "Mapnik", "min": 1, "url": "", "sourceID": 1, "type": "Base Tileset"},
                {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "roadmap", "id": 2, "typeID": 1, "name": "Roadmap", "min": 1, "url": "//maps.google.com/maps/api/staticmap?sensor=false&maptype=roadmap&style=feature:poi.school|element:geometry|saturation:-79|lightness:75", "sourceID": 5, "type": "Base Tileset"},
                {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "hybrid", "id": 3, "typeID": 1, "name": "Hybrid", "min": 1, "url": "//maps.google.com/maps/api/staticmap?sensor=false&maptype=hybrid", "sourceID": 5, "type": "Base Tileset"},
                {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "terrain", "id": 4, "typeID": 1, "name": "Terrain", "min": 1, "url": "//maps.google.com/maps/api/staticmap?sensor=false&maptype=terrain", "sourceID": 5, "type": "Base Tileset"},
                {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "satellite", "id": 9, "typeID": 1, "name": "Satellite", "min": 1, "url": "//maps.google.com/maps/api/staticmap?sensor=false&maptype=satellite", "sourceID": 5, "type": "Base Tileset"},
                {"sourceName": "mapbox", "max": 19, "is_printable": true, "providerID": "lg.i1p2e2cf", "id": 12, "typeID": 1, "name": "Grayscale", "min": 1, "url": "", "sourceID": 1, "type": "Base Tileset"},
                {"sourceName": "stamen", "max": 20, "is_printable": false, "providerID": "watercolor", "id": 20, "typeID": 1, "name": "Watercolor", "min": 1, "url": "", "sourceID": 6, "type": "Base Tileset"}
            ];
            this.mapEditorInitializationParams = {
                defaultLocation: {
                    center: [21.698265, 14.765625],
                    zoom: 11
                },
                mapContainerID: "map_canvas",
				includeSearchControl: true,
				includeGeolocationControl: true,
                includeAudioControl: true,
				activeMapTypeID: 12,
				tilesets: this.tilesets
            };

            //initialize this.app:
            this.app = _.extend({}, appUtilities);
            this.map = {
                fitBounds: function () {},
                setCenter: function () {}
            };
            this.vent = _.extend({}, Backbone.Events);

            this.dataManager = new DataManager({
                vent: this.vent,
                projectID: this.projects.models[0].id,
                model: this.projects.models[0]
            });
            _.extend(this.app, {
                vent: this.vent,
                projectID: this.projects.models[0].id,
                dataManager: this.dataManager,
                map: this.map, //a light stand-in for a Google Map, to speed it up
                getProjectID: function () {
                    return this.projectID;
                },
                getMap: function () {
                    return this.map;
                }
            });

        });
    }
);
