var google = {};
define(
    [
        "backbone",
        "marionette",
        "jquery",
        "lib/appUtilities",
        "collections/projects",
        "collections/photos",
        "collections/audio",
        "collections/videos",
        "collections/maps",
        "collections/mapimages",
        "collections/records",
        "collections/prints",
        "collections/forms",
        "collections/fields",
        "models/project",
        "models/projectUser",
        "models/photo",
        "models/audio",
        "models/video",
        "models/record",
        "models/map",
        "models/mapimage",
        "models/print",
        "models/layer",
        "models/form",
        "models/field",
        "lib/data/dataManager",
        "apps/style/router"
    ],

    function (Backbone, Marionette, $, appUtilities, Projects, Photos, AudioFiles, Videos, Maps,
              MapImages, Records, Prints, Forms, Fields, Project, ProjectUser, Photo,
              Audio, Video, Record, Map, MapImage, Print, Layer, Form, Field, DataManager, Router) {
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
            // END SAFETY MEASURES

            this.getModelByOverlayType = function (overlay_type) {
                var model;
                if (overlay_type == "map-image") {
                    model = this.map_images.at(0);
                } else if (overlay_type == "photo") {
                    model = this.photos.at(0);
                } else if (overlay_type == "audio") {
                    model = this.audioFiles.at(0);
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
                    "display_legend": false,
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
                        "id": 1,
                        "title": "layer 1",
                        "data_source": "form_1",
                        "symbol_shape": "fa-circle",
                        "layer_type": "continuous",
                        "newLayer": true,
                        "group_by": "test_integer",
                        "metadata": {
                            "fillColor": "#4e70d4",
                            "strokeWeight": 1,
                            "buckets": 3,
                            "strokeOpacity": 1,
                            "width": "20",
                            "shape": "circle",
                            "fillOpacity": 1,
                            "strokeColor": "#ffffff",
                            "paletteId": 2,
                            "isShowing": false
                        },
                        "filters": [
                            {
                                "tag": "nothing"
                            }
                        ],
                        "map_id": 1,
                        "symbols": [
                            {
                                "rule": "test_integer >= 4 and test_integer <= 7",
                                "title":"between 4 and 7",
                                "fillOpacity":1,
                                "strokeWeight":1,
                                "strokeOpacity":1,
                                "width":20,
                                "shape":"circle",
                                "fillColor":"#f0f0f0",
                                "strokeColor":"#ffffff",
                                "id":1,
                                "height":20,
                                "isShowing": false
                            },
                            {
                                "rule": "test_integer >= 7 and test_integer <= 9",
                                "title":"between 7 and 9",
                                "fillOpacity":1,
                                "strokeWeight":1,
                                "strokeOpacity":1,
                                "width":20,
                                "shape":"circle",
                                "fillColor":"#bdbdbd",
                                "strokeColor":"#ffffff",
                                "id":2,
                                "height":20,
                                "isShowing": false
                            },
                            {
                                "rule": "test_integer >= 9 and test_integer <= 12",
                                "title":"between 9 and 12",
                                "fillOpacity":1,
                                "strokeWeight":1,
                                "strokeOpacity":1,
                                "width":20,
                                "shape":"circle",
                                "fillColor":"#636363",
                                "strokeColor":"#ffffff",
                                "id":3,
                                "height":20,
                                "isShowing": false
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "title": "Murals",
                        "data_source": "form_1",
                        "symbol_shape": "fa-circle",
                        "layer_type": "continuous",
                        "filters": [
                            {
                                "tag": "nothing"
                            }
                        ],
                        "map_id": 1,
                        "symbols": [
                            {
                                "fillColor": "#7075FF",
                                "width": 30,
                                "rule": "test_integer > 0",
                                "title": "At least 1 sculpture",
                                "isShowing": false
                            }
                        ]
                    },
                    {
                        "id": 3,
                        "title": "Murals",
                        "data_source": "form_1",
                        "symbol_shape": "circle",
                        "layer_type": "categorical",
                        "newLayer": true,
                        "group_by": "test_text",
                        "metadata": {
                            "newKey": 6,
                            "fillColor": "#4e70d4",
                            "strokeWeight": 1,
                            "buckets": 3,
                            "strokeOpacity": "1",
                            "width": "30",
                            "shape": "circle",
                            "fillOpacity": 1,
                            "strokeColor": "#FFFFFF",
                            "paletteId": 3,
                            "isShowing": false
                        },
                        "filters": {
                            "tags": "nothing"
                        },
                        "map_id": 1,
                        "symbols": [
                            {
                                "fillColor": "#7075FF",
                                "width": 30,
                                "rule": "test_text = 'Blue team'",
                                "title": "Blue Team",
                                "isShowing": false
                            },
                            {
                                "fillColor": "#F011D9",
                                "width": 30,
                                "rule": "test_text = 'Green team'",
                                "title": "Green Team",
                                "isShowing": false
                            },
                            {
                                "fillColor": "#FF0000",
                                "width": 30,
                                "rule": "test_text = 'Red team'",
                                "title": "Red Team",
                                "isShowing": false
                            }
                        ]
                    }
                ],
                "layers_url": "http://localhost:7777/api/0/maps/1/layers/"
            });
            this.layer = this.testMap.get("layers").at(0);
            this.layers = this.testMap.get("layers");
            this.maps = new Maps([this.mapTest],{ projectID: 3 });
            this.form = new Form({
                "url": "http://localhost:7777/api/0/datasets/1/",
                "id": 1,
                "name": "Test Form",
                "caption": "Test Caption",
                "overlay_type": "form",
                "tags": [],
                "owner": "MrJBRPG",
                "data_url": "http://localhost:7777/api/0/datasets/1/data/",
                "fields_url": "http://localhost:7777/api/0/datasets/1/fields/",
                "slug": "slug_64358",
                "project_id": 3,
                "fields": [
                    {
                        "id": 1,
                        "form": 1,
                        "col_alias": "Test Text",
                        "col_name": "test_text",
                        "is_display_field": true,
                        "ordering": 1,
                        "data_type": "text",
                        "url": "http://localhost:7777/api/0/datasets/1/fields/1"
                    },
                    {
                        "id": 2,
                        "form": 1,
                        "col_alias": "Test Integer",
                        "col_name": "test_integer",
                        "is_display_field": false,
                        "ordering": 2,
                        "data_type": "integer",
                        "url": "http://localhost:7777/api/0/datasets/1/fields/19"
                    },
                    {
                        "id": 3,
                        "form": 1,
                        "col_alias": "Test Boolean",
                        "col_name": "test_boolean",
                        "is_display_field": false,
                        "ordering": 3,
                        "data_type": "boolean",
                        "url": "http://localhost:7777/api/0/datasets/1/fields/20"
                    },
                    {
                        "id": 4,
                        "form": 1,
                        "col_alias": "Test Rating",
                        "col_name": "test_rating",
                        "is_display_field": false,
                        "ordering": 4,
                        "extras": [
                            {
                                "name": "Positive",
                                "value": 1
                            },
                            {
                                "name": "Neutral",
                                "value": 2
                            },
                            {
                                "name": "Negative",
                                "value": 3
                            }
                        ],
                        "data_type": "rating"
                    },
                    {
                        "id": 5,
                        "form": 1,
                        "col_alias": "Test Choice",
                        "col_name": "test_choice",
                        "is_display_field": false,
                        "ordering": 5,
                        "extras": [
                            {
                                "name": "Red"
                            },
                            {
                                "name": "Green"
                            },
                            {
                                "name": "Blue"
                            }
                        ],
                        "data_type": "choice"
                    }]
            });
            this.form2 = new Form({
                "url": "http://localhost:7777/api/0/datasets/2/",
                "id": 2,
                "name": "Animals",
                "caption": "Test Caption",
                "overlay_type": "form",
                "tags": [],
                "owner": "MrJBRPG",
                "data_url": "http://localhost:7777/api/0/datasets/2/data/",
                "fields_url": "http://localhost:7777/api/0/datasets/2/fields/",
                "slug": "slug_64358",
                "project_id": 3,
                "fields": [{
                    "id": 15,
                    "form": 2,
                    "col_alias": "Name",
                    "col_name": "name",
                    "is_display_field": true,
                    "ordering": 1,
                    "data_type": "text",
                    "url": "http://localhost:7777/api/0/datasets/2/fields/15"
                }]
            });
            this.forms = new Forms([this.form, this.form2], { projectID: 1});
            this.photos = new Photos([
                new Photo({ id: 1, name: "Cat", tags: ['animal', 'cat', 'cute', 'tag1'], project_id: 1, overlay_type: "photo", caption: "Caption1", owner: "Owner1", attribution: "Owner1", geometry: {"type": "Point", "coordinates": [-122.294, 37.864]}, path_small: '//:0', path_medium: "//:0", path_large: "//:0", path_medium_sm: '//:0', path_marker_sm: "//:0" }),
                new Photo({id: 2, name: "Dog", tags: ['animal', 'dog'], project_id: 1, overlay_type: "photo", caption: "Caption1", owner: "Owner1", geometry: { type: "Point", coordinates: [-122.2943, 37.8645] }, path_medium_sm: '//:0', path_medium: '//:0', path_small: '//:0', path_marker_sm: "//:0" }),
                new Photo({id: 3, name: "Frog", tags: ['animal', 'amphibian', 'cute', 'frog'], project_id: 2, overlay_type: "photo", caption: "Caption1", owner: "Owner1", geometry: { type: "Point", coordinates: [-122.2943, 37.8645] }, path_medium_sm: '//:0', path_small: '//:0', path_medium: "//:0", path_large: "//:0", path_marker_sm: '//:0' })
            ], {
                title: "Photos",
                overlayType: "photo",
                isSite: false,
                isCustomType: false,
                isMedia: true,
                dataType: "photos",
                projectID: 1,
                key: "photos"
            });
            this.audioFiles = new AudioFiles([
                new Audio({ id: 1, name: "Nirvana", tags: ['90s', 'grunge'], project_id: 1, overlay_type: "audio", caption: "Caption1", file_path: "/static/tests/spec/javascripts/fixtures/sample-audio.mp3", geometry: {"type": "Point", "coordinates": [-122.294, 37.864]} }),
                new Audio({id: 2, name: "Duran Duran", tags: ['80s', 'amazing', 'tag1'], project_id: 1, overlay_type: "audio", caption: "caption 2", file_path: "/static/tests/spec/javascripts/fixtures/sample-audio.mp3" }),
                new Audio({id: 3, name: "Flo Rida", tags: ['florida', 'hip hop'], project_id: 2, overlay_type: "audio", caption: "caption 3", file_path: "/static/tests/spec/javascripts/fixtures/sample-audio.mp3" })
            ], {
                title: "Audio",
                overlayType: "audio",
                isSite: false,
                isCustomType: false,
                isMedia: true,
                dataType: "audio",
                projectID: 1,
                key: "audio"
            });
            this.videos = new Videos([
                new Video({id: 1, name: "Rihanna Gibbons", caption: "caption 1", tags: [], video_id: "DVrTf5yOW5s", video_provider: "youtube", geometry: { type: "Point", coordinates: [-122.298, 37.897]}, project_id: 7, owner: "tester", overlay_type: "video"}),
                new Video({id: 2, name: "Silver Lining", caption: "caption 2", tags: [], video_id: "DKL4X0PZz7M", video_provider: "youtube", geometry: { type: "Point", coordinates: [-121.298, 37.897]}, project_id: 7, owner: "tester", overlay_type: "video"}),
                new Video({id: 3, name: "How to recount your dreams", caption: "caption 1", tags: [], video_id: "225222634", video_provider: "vimeo", geometry: { type: "Point", coordinates: [-120.298, 37.897]}, project_id: 7, owner: "tester", overlay_type: "video"})
            ], {
                title: "Videos",
                overlayType: "video",
                isSite: false,
                isCustomType: false,
                isMedia: true,
                dataType: "videos",
                projectID: 1,
                key: "videos"
            });
            this.map_images = new MapImages([
                new MapImage({ id: 1, name: "Map 1", tags: ['parks', 'oakland'], project_id: 1, caption: "Caption1", overlay_type: "map-image", geometry: { type: "Polygon", coordinates: [[[ -82.54, 35.62 ], [ -82.54, 35.62 ], [ -82.54, 35.62 ], [ -82.54, 35.62 ], [ -82.54, 35.62 ]]]} }),
                new MapImage({id: 2, name: "Map 2", tags: ['parks', 'berkeley', 'tag1'], project_id: 1, overlay_type: "map-image" }),
                new MapImage({id: 3, name: "Map 3", tags: ['emeryville'], project_id: 2, overlay_type: "map-image" })
            ], {
                title: "Map Images",
                overlayType: "map_image",
                isSite: false,
                isCustomType: false,
                isMedia: true,
                dataType: "map_images",
                projectID: 1,
                key: "map_images"
            });
            this.prints = new Prints([
                new Print({ id: 1, name: "Print 1", tags: ['parks', 'oakland'], project_id: 1, caption: "Caption1", overlay_type: "print", geometry: { type: "Polygon", coordinates: [[[ -82.54, 35.62 ], [ -82.54, 35.62 ], [ -82.54, 35.62 ], [ -82.54, 35.62 ], [ -82.54, 35.62 ]]]} }),
                new Print({id: 2, name: "Print 2", tags: ['parks', 'berkeley', 'tag1'], project_id: 1, overlay_type: "print" }),
                new Print({id: 3, name: "Print 3", tags: ['emeryville'], project_id: 2, overlay_type: "print" })
            ]);

            this.form_1 = new Records([
                new Record({id: 1, name: "Blue Team", caption: "Blue Team Caption", test_text: "Blue team", test_integer: 4, test_rating: 3, test_choice: "Red", test_boolean: true, fields: this.form.fields.toJSON(), display_name: "Blue team", tags: ['my house'], project_id: 1, overlay_type: "form_1", geometry: {"type": "Point", "coordinates": [-122.294, 37.864]}, photo_count: 3, audio_count: 1, video_count: 2 }),
                new Record({id: 2, name: "Green Team", caption: "Green Team Caption", test_text: "Green team", fields: this.form.fields.toJSON(), tags: ['friend\'s house', 'tag1'], test_integer: 8, project_id: 1, overlay_type: "form_1", photo_count: 1, audio_count: 2, video_count: 2 }),
                new Record({id: 3, name: "Red Team", caption: "Red Team Caption",  test_text: "Red team", fields: this.form.fields.toJSON(), tags: ['coffee shop'], test_integer: 12, project_id: 2, overlay_type: "form_1", photo_count: 2, audio_count: 3, video_count: 2 })
            ], {
                title: "Test Form",
                overlayType: "record",
                isSite: true,
                isCustomType: true,
                isMedia: false,
                dataType: "form_1",
                projectID: 1,
                url: 'dummy/url',
                fillColor: "#CCCCCC",
                fields: new Fields(this.form.fields.toJSON(), { baseURL: 'dummy/url' }),
                key: "form_1"
            });
            this.form_2 = new Records([
                new Record({ id: 2,
                    overlay_type: "form_2",
                    geometry: null,
                    project_id: 1,
                    rating_1: 1,
                    choice_1: "Beta",
                    choice_2: "Delta",
                    new_rating: 2,
                    new_choice: "Hello",
                    photo_count: 0,
                    audio_count: 0
                }),
                new Record({ id: 3,
                    overlay_type: "form_2",
                    geometry: null,
                    project_id: 1,
                    rating_1: 2,
                    choice_1: "Alpha",
                    choice_2: "Charlie",
                    new_rating: 1,
                    new_choice: "World",
                    photo_count: 0,
                    audio_count: 0
                }),
            ], {
                title: "Test Form 2",
                overlayType: "record",
                isSite: true,
                isCustomType: true,
                isMedia: false,
                dataType: "form_2",
                projectID: 1,
                url: 'dummy/url',
                fillColor: "#CCCCCC",
                fields: new Fields(this.form2.fields.toJSON(), { baseURL: 'dummy/url' }),
                key: "form_2"
            });

            this.fields = this.form.fields;

            this.dataDictionary = {
                photos: this.photos,
                videos: this.videos,
                audio: this.audioFiles,
                map_images: this.map_images,
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
                new Project({
                    id: 1,
                    name: "Project 1",
                    caption: '',
                    owner: "MrJBRPG",
                    access_authority: '1',
                    tags: 'tag1, tag2',
                    overlay_type: "project",
                    time_stamp: "2017-02-17T21:17:33",
                    date_created: "2017-02-17T21:17:33",
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
                            name: "Map Images",
                            id: "map_images",
                            overlay_type: "map_image",
                            data: this.map_images.toJSON()
                        },
                        videos: {
                            name: "Videos",
                            id: "videos",
                            overlay_type: "video",
                            data: this.videos.toJSON()
                        },
                        form_1: {
                            name: "Team Members",
                            id: "form_1",
                            overlay_type: "form_1",
                            data: this.form_1.toJSON(),
                            fields: this.fields.toJSON()
                        }
                    }}),
                new Project({
                    id: 2,
                    name: "Project 2",
                    tags: 'tag3, tag2',
                    overlay_type: "project",
                    time_stamp: "2017-04-02T21:17:33",
                    date_created: "2017-04-02T21:17:33",
                    children: {
                        form_1: {
                            name: "Soil Form",
                            id: "form_1",
                            overlay_type: "record",
                            data: this.form_1.toJSON()
                        }
                    }}),
                new Project({
                    id: 3,
                    name: "Blah",
                    tags: 'tag6, tag7',
                    overlay_type: "project",
                    time_stamp: "2016-02-17T21:17:33",
                    date_created: "2016-02-17T21:17:33",
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

            this.project = this.projects.at(0);
            this.form_1.at(0).set("children", {
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
                videos: {
                    name: "Videos",
                    id: "videos",
                    overlay_type: "video",
                    data: this.videos.toJSON()
                }
            });

            this.print = this.prints.at(0);

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
            this.app.username = "Tester";

            this.projectUser = new ProjectUser({
                user: "Tester",
                authority: "1"
            }, {id: this.project.id});
            this.map = new google.maps.Map();
            this.vent = _.extend({}, Backbone.Events);

            this.dataManager = new DataManager({
                projectJSON,
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
                },
                start: function (options) {
                    // declares any important global functionality;
                    // kicks off any objects and processes that need to run

                    this.router = new Router({ app: this });
                    Backbone.history.start();
                }
            });

            this.continuousSymbols = [
                {
                    "rule": "test_integer >= 4 and test_integer <= 7",
                    "title":"between 4 and 7",
                    "fillOpacity":1,
                    "strokeWeight":1,
                    "strokeOpacity":1,
                    "width":20,
                    "shape":"circle",
                    "fillColor":"#f0f0f0",
                    "strokeColor":"#ffffff",
                    "id":1,
                    "height":20,
                    "isShowing": false
                },
                {
                    "rule": "test_integer >= 7 and test_integer <= 9",
                    "title":"between 7 and 9",
                    "fillOpacity":1,
                    "strokeWeight":1,
                    "strokeOpacity":1,
                    "width":20,
                    "shape":"circle",
                    "fillColor":"#bdbdbd",
                    "strokeColor":"#ffffff",
                    "id":2,
                    "height":20,
                    "isShowing": false
                },
                {
                    "rule": "test_integer >= 9 and test_integer <= 12",
                    "title":"between 9 and 12",
                    "fillOpacity":1,
                    "strokeWeight":1,
                    "strokeOpacity":1,
                    "width":20,
                    "shape":"circle",
                    "fillColor":"#636363",
                    "strokeColor":"#ffffff",
                    "id":3,
                    "height":20,
                    "isShowing": false
                }
            ],

            this.categoricalSymbols = [
                {
                    "fillColor": "#fbb4ae",
                    "fillOpacity": 1,
                    "height": 20,
                    "id": 1,
                    "instanceCount": 1,
                    "rule": "test_text = Blue team",
                    "shape": "circle",
                    "strokeColor": "#FFFFFF",
                    "strokeOpacity": 1,
                    "strokeWeight": 1,
                    "title": "Blue team",
                    "width": 30,
                    "isShowing": false
                },
                {
                    "fillColor": "#b3cde3",
                    "fillOpacity": 1,
                    "height": 20,
                    "id": 2,
                    "instanceCount": 1,
                    "rule": "test_text = Green team",
                    "shape": "circle",
                    "strokeColor": "#FFFFFF",
                    "strokeOpacity": 1,
                    "strokeWeight": 1,
                    "title": "Green team",
                    "width": 30,
                    "isShowing": false
                },
                {
                    "fillColor": "#ccebc5",
                    "fillOpacity": 1,
                    "height": 20,
                    "id": 3,
                    "instanceCount": 1,
                    "rule": "test_text = Red team",
                    "shape": "circle",
                    "strokeColor": "#FFFFFF",
                    "strokeOpacity": 1,
                    "strokeWeight": 1,
                    "title": "Red team",
                    "width": 30,
                    "isShowing": false
                }
            ]
        });
    }
);
