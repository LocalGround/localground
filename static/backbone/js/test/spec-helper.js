define(
    [
        "backbone",
        "jquery",
        "lib/appUtilities",
        "lib/maps/data/dataManager",
        "collections/projects",
        "collections/photos",
        "collections/audio",
        "collections/mapimages",
        "collections/markers",
        "collections/records",
        "collections/forms",
        "collections/layers",
        "collections/dataTypes",
        "models/project",
        "models/photo",
        "models/marker",
        "models/audio",
        "models/record",
        "models/form",
        "models/mapimage",
        "models/layer",
        "models/dataType"
    ],
    function (Backbone, $, appUtilities, DataManager,
              Projects, Photos, AudioFiles, MapImages, Markers,
              Records, Forms, Layers, DataTypes,
              Project, Photo, Marker, Audio, Record, Form,
              MapImage, Layer, DataType) {
        'use strict';

        var initAjaxSpies = function (scope) {
            /* Suggestion taken from:
             * http://blog.ricca509.me/jasmine-mock-ajax-for-backbone-requests
             */
            spyOn($, 'ajax').and.callFake(function (options) {
                var d = $.Deferred(),
                    response = {};
                switch (options.type) {
                case "OPTIONS":
                    response = scope.recordSchema;
                    break;
                case "GET":
                    if ("/api/0/forms/" == options.url) {
                        response = { results: scope.forms.toJSON() };
                    } else if ("/api/0/layers/" == options.url) {
                        response = { results: scope.layers.toJSON() };
                    } else if ("/api/0/photos/" == options.url) {
                        response = { results: scope.photos.toJSON() };
                    } else if ("/api/0/map-images/" == options.url) {
                        response = { results: scope.map_images.toJSON() };
                    } else if ("/api/0/markers/" == options.url) {
                        response = { results: scope.markers.toJSON() };
                    } else if ("/api/0/audio/" == options.url) {
                        response = { results: scope.audio.toJSON() };
                    } else if ("/api/0/data-types/" == options.url) {
                        response = { results: scope.dataTypes.toJSON() };
                    } else if (/\/api\/0\/forms\/\d+\/data\//.test(options.url)) {
                        response = { results: scope.records.toJSON() };
                    } else {
                        alert("No match. Please see the spec-helper.js \"initAjaxSpies\" function and add code to intercept the \"" + options.url + "\" AJAX request.");
                    }
                    break;
                }
                d.resolve(response);
                options.success(response);
                return d.promise();
            });
        };
        beforeEach(function () {
            var $map_container = $('<div id="map_canvas"></div>');
               // $grid_container = $('<div id="grid"></div>');
            $(document.body).append($map_container);
            //$(document.body).append($grid_container);

            /**
             * Adds some dummy data for testing convenience.
             * Availabe to all of the tests.
             */
            this.photos = new Photos([
                new Photo({ id: 1, name: "Cat", tags: 'animal, cat, cute, tag1', project_id: 1, overlay_type: "photo",
                          geometry: {"type": "Point", "coordinates": [-122.294, 37.864]},
                          path_small: '//:0', path_medium: "//:0", path_large: "//:0" }),
                new Photo({id: 2, name: "Dog", tags: 'animal, dog', project_id: 1, overlay_type: "photo", geometry: { type: "Point", coordinates: [-122.2943, 37.8645] } }),
                new Photo({id: 3, name: "Frog", tags: 'animal, amphibian, cute, frog', project_id: 1, overlay_type: "photo", geometry: { type: "Point", coordinates: [-122.2943, 37.8645] } })
            ]);
            this.audio = new AudioFiles([
                new Audio({ id: 1, name: "Nirvana", tags: '90s, grunge', project_id: 1, overlay_type: "audio" }),
                new Audio({id: 2, name: "Duran Duran", tags: '80s, amazing, tag1', project_id: 1, overlay_type: "audio" }),
                new Audio({id: 3, name: "Flo Rida", tags: 'florida, hip hop', project_id: 1, overlay_type: "audio" })
            ]);
            this.map_images = new MapImages([
                new MapImage({ id: 1, name: "Map 1", tags: 'parks, oakland', project_id: 3, overlay_type: "map-image" }),
                new MapImage({id: 2, name: "Map 2", tags: 'parks, berkeley, tag1', project_id: 3, overlay_type: "map-image" }),
                new MapImage({id: 3, name: "Map 3", tags: 'emeryville', project_id: 3, overlay_type: "map-image" })
            ]);
            this.markers = new Markers([
                new Marker({ id: 1, name: "POI 1", tags: 'my house', project_id: 2, overlay_type: "marker" }),
                new Marker({id: 2, name: "POI 2", tags: 'friend\'s house, tag1', project_id: 2, overlay_type: "marker" }),
                new Marker({id: 3, name: "POI 3", tags: 'coffee shop, tag1', project_id: 2, overlay_type: "marker" })
            ]);
            this.forms = new Forms([
                new Form({ "id": 2, "name": "Nature form", "description": "teams & worm counts", "overlay_type": "form", "tags": "", "owner": "tester", "slug": "worms-form", "project_ids": [ 1 ], fields: [/*todo: populate if needed*/] })
            ]);
            this.dataTypes = new DataTypes([
                new DataType({id: 8, name: "audio"}),
                new DataType({id: 7, name: "photo"}),
                new DataType({id: 6, name: "rating"}),
                new DataType({id: 5, name: "decimal"}),
                new DataType({id: 4, name: "boolean"}),
                new DataType({id: 3, name: "date-time"}),
                new DataType({id: 2, name: "integer"}),
                new DataType({id: 1, name: "text"})
            ]);
            this.records = new Records([
                new Record({ id: 1, team_name: "Blue team", tags: 'my house', worm_count: 4, project_id: 2, overlay_type: "record", team_photo: 1, audio_clip: 1 }),
                new Record({id: 2, team_name: "Green team", tags: 'friend\'s house, tag1', worm_count: 8, project_id: 2, overlay_type: "record", team_photo: 2, audio_clip: 2 }),
                new Record({id: 3, team_name: "Red team", tags: 'coffee shop', worm_count: 2, project_id: 2, overlay_type: "record", team_photo: 3, audio_clip: 3 })
            ], { 'url': 'dummy/url' });
            this.recordSchema = {
                name: "Form Data List",
                description: "",
                "actions": {"POST": {
                    "id": {"type": "integer", "required": false, "read_only": true, "label": "ID"},
                    "team_name": {type: "string", required: false, read_only: false, label: "Team Name"},
                    "geometry": {type: "geojson", required: false, read_only: false, label: "Geometry"},
                    "display_name": {type: "string", required: false, read_only: true, label: "Display Name"},
                    "tags": {type: "string", required: false, read_only: false, label: "Tags", max_length: 1000},
                    "worm_count": {type: "integer", required: false, read_only: false, label: "Worm Count"},
                    "project_id": {type: "field", required: false, read_only: false, label: "Project ID"},
                    "overlay_type": {type: "field", required: false, read_only: true, label: "Overlay Type"},
                    "team_photo": {type: "photo", required: false, read_only: false, label: "Team photo"},
                    "audio_clip": {type: "audio", required: false, read_only: false, label: "Audio Clip"}
                }}
            };
            this.layers = new Layers([
                new Layer({id: 1, name: "worms", overlay_type: "layer", symbols: [
                    { color: "#7075FF", width: 30, rule: "worms > 0", title: "At least 1 worm" },
                    { color: "#F011D9", width: 30, rule: "worms = 0", title: "No worms" }
                ]}),
                new Layer({id: 2, name: "pets", overlay_type: "layer", symbols: [
                    { color: "#F00", width: 20, rule: "tags contains cat", title: "Cats" },
                    { color: "#0F0", width: 20, rule: "tags contains dog", title: "Dogs" }
                ]}),
                new Layer({id: 3, name: "frogs", overlay_type: "layer", symbols: [
                    { color: "#00F", width: 20, rule: "tags contains frog", title: "Frogs" }
                ]})
            ]);

            this.dataDictionary = {
                records: this.records,
                photos: this.photos,
                audio: this.audio,
                map_images: this.map_images,
                markers: this.markers
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
                            data: this.audio.toJSON()
                        }
                    }}),
                new Project({ id: 2, name: "Project 2", tags: 'tag3, tag2', overlay_type: "project",
                    children: {
                        form_1: {
                            name: "Soil Form",
                            id: "form_1",
                            overlay_type: "record",
                            data: this.records.toJSON()
                        },
                        markers: {
                            name: "Markers",
                            id: "markers",
                            overlay_type: "marker",
                            data: this.markers.toJSON()
                        }
                    }})
            ]);
            this.tilesets = [
                {"sourceName": "mapbox", "max": 19, "is_printable": true, "providerID": "lg.i1p5alka", "id": 1, "typeID": 1, "name": "Mapnik", "min": 1, "url": "", "sourceID": 1, "type": "Base Tileset"},
                {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "roadmap", "id": 2, "typeID": 1, "name": "Roadmap", "min": 1, "url": "http://maps.google.com/maps/api/staticmap?sensor=false&maptype=roadmap&style=feature:poi.school|element:geometry|saturation:-79|lightness:75", "sourceID": 5, "type": "Base Tileset"},
                {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "hybrid", "id": 3, "typeID": 1, "name": "Hybrid", "min": 1, "url": "http://maps.google.com/maps/api/staticmap?sensor=false&maptype=hybrid", "sourceID": 5, "type": "Base Tileset"},
                {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "terrain", "id": 4, "typeID": 1, "name": "Terrain", "min": 1, "url": "http://maps.google.com/maps/api/staticmap?sensor=false&maptype=terrain", "sourceID": 5, "type": "Base Tileset"},
                {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "satellite", "id": 9, "typeID": 1, "name": "Satellite", "min": 1, "url": "http://maps.google.com/maps/api/staticmap?sensor=false&maptype=satellite", "sourceID": 5, "type": "Base Tileset"},
                {"sourceName": "mapbox", "max": 19, "is_printable": true, "providerID": "lg.i1p2e2cf", "id": 12, "typeID": 1, "name": "Grayscale", "min": 1, "url": "", "sourceID": 1, "type": "Base Tileset"},
                {"sourceName": "stamen", "max": 20, "is_printable": false, "providerID": "watercolor", "id": 20, "typeID": 1, "name": "Watercolor", "min": 1, "url": "", "sourceID": 6, "type": "Base Tileset"}
            ];
            this.mapEditorInitializationParams = {
                defaultLocation: {
                    center: new google.maps.LatLng(21.698265, 14.765625),
                    zoom: 11
                },
                mapContainerID: "map_canvas",
				includeSearchControl: true,
				includeGeolocationControl: true,
                includeAudioControl: true,
				activeMapTypeID: 12,
				tilesets: this.tilesets
            };

            this.snapshot = {
                access: "Public (everyone)",
                basemap: 12,
                center: { type: "Point", coordinates: [-122, 37] },
                description: "This is a cool description for cool, humble people",
                entities: [ { ids: [ 19 ], overlay_type: "photo" } ],
                children: {
                    photos: {
                        overlay_type: "photo",
                        data: [
                            {
                                id: 19,
                                name: "Tree with Bird",
                                description: "",
                                overlay_type: "photo",
                                tags: "tree, napali coast",
                                project_id: 1,
                                geometry: { type: "Point", coordinates: [-122, 37] }
                            }
                        ],
                        id: "photos",
                        name: "Photos"
                    }
                },
                id: 3,
                name: "Napali Coast",
                overlay_type: "view",
                owner: "vanwars",
                slug: "Njk3OTQyNTI3LjI0Mzg2NzU-",
                tags: "",
                url: "/api/0/views/1/",
                zoom: 18
            };

            //initialize this.app:
            this.app = _.extend({}, appUtilities);
            _.extend(this.app, {
                vent: _.extend({}, Backbone.Events),
                activeProjectID: this.projects.models[0].id,
                map: {
                    fitBounds: function () {}
                } //a light stand-in for a Google Map, to speed it up; save our API calls.
            });

            this.spreadsheetApp = {
                router: null,
                activeTableID: null
            };

            //initialize dataManager:
            this.dataManager = new DataManager({
                app: this.app,
                availableProjects: this.projectsLite
            });
            //give the app a reference to the dataManager (for convenience);
            _.extend(this.app, { dataManager: this.dataManager });

            //intercepts all fetch calls and returns dummy data (as defined above):
            initAjaxSpies(this);
        });

        afterEach(function () {
            //clean up:
            $("#map_canvas").remove();
            $(".modal").remove();
            $(".modal-backdrop").remove();
        });
    }
);