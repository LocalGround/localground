define(
    [
        "backbone",
        "jquery",
        "lib/appUtilities",
        "collections/projects",
        "collections/photos",
        "collections/audio",
        "collections/mapimages",
        "collections/markers",
        "collections/records",
        "collections/prints",
        "models/project",
        "models/photo",
        "models/marker",
        "models/audio",
        "models/record",
        "models/mapimage",
        "models/print"
    ],
    function (Backbone, $, appUtilities, Projects, Photos, AudioFiles,
              MapImages, Markers, Records, Prints,
              Project, Photo, Marker, Audio, Record, MapImage, Print) {
        'use strict';
        beforeEach(function () {
            var $map_container = $('<div id="map_canvas"></div>');
            $(document.body).append($map_container);

            // SAFETY MEASURE: makes sure that nothing interacts w/database.
            spyOn($, 'ajax').and.callFake(function () {
                console.log("AJAX call intercepted.");
            });

            this.getModelByOverlayType = function (overlay_type) {
                var model;
                if (overlay_type == "map-image") {
                    model = this.map_images.at(0);
                } else if (overlay_type == "photo") {
                    model = this.photos.at(0);
                } else if (overlay_type == "audio") {
                    model = this.audio.at(0);
                } else if (overlay_type == "marker") {
                    model = this.markers.at(0);
                } else if (overlay_type == "record") {
                    model = this.records.at(0);
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
            this.photos = new Photos([
                new Photo({ id: 1, name: "Cat", tags: 'animal, cat, cute, tag1', project_id: 1, overlay_type: "photo", caption: "Caption1", owner: "Owner1", attribution: "Owner1", geometry: {"type": "Point", "coordinates": [-122.294, 37.864]}, path_small: '//:0', path_medium: "//:0", path_large: "//:0", path_medium_sm: '//:0', path_marker_sm: "//:0" }),
                new Photo({id: 2, name: "Dog", tags: 'animal, dog', project_id: 1, overlay_type: "photo", caption: "Caption1", owner: "Owner1", geometry: { type: "Point", coordinates: [-122.2943, 37.8645] }, path_medium_sm: '//:0', path_medium: '//:0', path_small: '//:0', path_marker_sm: "//:0" }),
                new Photo({id: 3, name: "Frog", tags: 'animal, amphibian, cute, frog', project_id: 2, overlay_type: "photo", caption: "Caption1", owner: "Owner1", geometry: { type: "Point", coordinates: [-122.2943, 37.8645] }, path_medium_sm: '//:0', path_small: '//:0', path_medium: "//:0", path_large: "//:0", path_marker_sm: '//:0' })
            ]);
            this.audio = new AudioFiles([
                new Audio({ id: 1, name: "Nirvana", tags: '90s, grunge', project_id: 1, overlay_type: "audio", caption: "Caption1", geometry: {"type": "Point", "coordinates": [-122.294, 37.864]} }),
                new Audio({id: 2, name: "Duran Duran", tags: '80s, amazing, tag1', project_id: 1, overlay_type: "audio" }),
                new Audio({id: 3, name: "Flo Rida", tags: 'florida, hip hop', project_id: 2, overlay_type: "audio" })
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
            this.records = new Records([
                new Record({ id: 1, team_name: "Blue team", display_name: "Blue team", tags: 'my house', worm_count: 4, project_id: 1, overlay_type: "record", geometry: {"type": "Point", "coordinates": [-122.294, 37.864]} }),
                new Record({id: 2, team_name: "Green team", tags: 'friend\'s house, tag1', worm_count: 8, project_id: 1, overlay_type: "record" }),
                new Record({id: 3, team_name: "Red team", tags: 'coffee shop', worm_count: 2, project_id: 2, overlay_type: "record" })
            ], { 'url': 'dummy/url' });

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
                        },
                        map_images: {
                            name: "Map-Images",
                            id: "map-images",
                            overlay_type: "map-image",
                            data: this.map_images.toJSON()
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
                            data: this.audio.toJSON()
                        },
                        map_images: {
                            name: "Map-Images",
                            id: "map-images",
                            overlay_type: "map-image",
                            data: this.map_images.toJSON()
                        }
                    }}),
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
            _.extend(this.app, {
                vent: _.extend({}, Backbone.Events),
                activeProjectID: this.projects.models[0].id,
                map: this.map, //a light stand-in for a Google Map, to speed it up; save our API calls.
                getMap: function () {
                    return this.map;
                }
            });

            //initialize this.app:
            this.profileOpts = {
                username: "tester",
                photoMetadata: {"url": {"type": "field", "required": false, "read_only": true, "label": "Url"}, "id": {"type": "integer", "required": false, "read_only": true, "label": "ID"}, "name": {"type": "string", "required": false, "read_only": false, "label": "name"}, "caption": {"type": "memo", "required": false, "read_only": false, "label": "caption"}, "overlay_type": {"type": "field", "required": false, "read_only": true, "label": "Overlay type"}, "tags": {"type": "field", "required": false, "read_only": false, "label": "tags", "help_text": "Tag your object here"}, "owner": {"type": "field", "required": false, "read_only": true, "label": "Owner"}, "project_id": {"type": "field", "required": false, "read_only": false, "label": "Project id", "choices": [{"display_name": "My First Project", "value": "2"}]}, "geometry": {"type": "geojson", "required": false, "read_only": false, "label": "Geometry", "help_text": "Assign a GeoJSON string"}, "extras": {"type": "json", "required": false, "read_only": false, "label": "Extras", "help_text": "Store arbitrary key / value pairs here in JSON form. Example: {\"key\": \"value\"}"}, "attribution": {"type": "string", "required": false, "read_only": false, "label": "Author / Creator", "help_text": "Name of the person who actually created the media file (text)", "max_length": 500}, "file_name": {"type": "string", "required": false, "read_only": true, "label": "File name"}, "media_file": {"type": "string", "required": false, "read_only": true, "label": "Media file"}, "file_path_orig": {"type": "field", "required": false, "read_only": true, "label": "File path orig"}, "path_large": {"type": "field", "required": false, "read_only": true, "label": "Path large"}, "path_medium": {"type": "field", "required": false, "read_only": true, "label": "Path medium"}, "path_medium_sm": {"type": "field", "required": false, "read_only": true, "label": "Path medium sm"}, "path_small": {"type": "field", "required": false, "read_only": true, "label": "Path small"}, "path_marker_lg": {"type": "field", "required": false, "read_only": true, "label": "Path marker lg"}, "path_marker_sm": {"type": "field", "required": false, "read_only": true, "label": "Path marker sm"}},
                audioMetadata: {"url": {"type": "field", "required": false, "read_only": true, "label": "Url"}, "id": {"type": "integer", "required": false, "read_only": true, "label": "ID"}, "name": {"type": "string", "required": false, "read_only": false, "label": "name"}, "caption": {"type": "memo", "required": false, "read_only": false, "label": "caption"}, "overlay_type": {"type": "field", "required": false, "read_only": true, "label": "Overlay type"}, "tags": {"type": "field", "required": false, "read_only": false, "label": "tags", "help_text": "Tag your object here"}, "owner": {"type": "field", "required": false, "read_only": true, "label": "Owner"}, "project_id": {"type": "field", "required": false, "read_only": false, "label": "Project id", "choices": [{"display_name": "My First Project", "value": "2"}]}, "geometry": {"type": "geojson", "required": false, "read_only": false, "label": "Geometry", "help_text": "Assign a GeoJSON string"}, "extras": {"type": "json", "required": false, "read_only": false, "label": "Extras", "help_text": "Store arbitrary key / value pairs here in JSON form. Example: {\"key\": \"value\"}"}, "attribution": {"type": "string", "required": false, "read_only": false, "label": "Author / Creator", "help_text": "Name of the person who actually created the media file (text)", "max_length": 500}, "file_name": {"type": "string", "required": false, "read_only": true, "label": "File name"}, "media_file": {"type": "string", "required": false, "read_only": true, "label": "Media file"}, "file_path_orig": {"type": "field", "required": false, "read_only": true, "label": "File path orig"}, "file_path": {"type": "field", "required": false, "read_only": true, "label": "File path"}},
                mapImageMetadata: {"url": {"type": "field", "required": false, "read_only": true, "label": "Url"}, "id": {"type": "integer", "required": false, "read_only": true, "label": "ID"}, "name": {"type": "string", "required": false, "read_only": false, "label": "name"}, "caption": {"type": "memo", "required": false, "read_only": false, "label": "caption"}, "overlay_type": {"type": "field", "required": false, "read_only": true, "label": "Overlay type"}, "tags": {"type": "field", "required": false, "read_only": false, "label": "tags", "help_text": "Tag your object here"}, "owner": {"type": "field", "required": false, "read_only": true, "label": "Owner"}, "source_print": {"type": "field", "required": false, "read_only": false, "label": "Source print", "choices": []}, "project_id": {"type": "field", "required": false, "read_only": false, "label": "Project id", "choices": [{"display_name": "My First Project", "value": "2"}]}, "north": {"type": "field", "required": false, "read_only": true, "label": "North"}, "south": {"type": "field", "required": false, "read_only": true, "label": "South"}, "east": {"type": "field", "required": false, "read_only": true, "label": "East"}, "west": {"type": "field", "required": false, "read_only": true, "label": "West"}, "zoom": {"type": "field", "required": false, "read_only": true, "label": "Zoom"}, "overlay_path": {"type": "field", "required": false, "read_only": true, "label": "Overlay path"}, "media_file": {"type": "string", "required": false, "read_only": true, "label": "Media file"}, "file_path": {"type": "field", "required": false, "read_only": true, "label": "File path"}},
                printMetadata: {"id": {"type": "integer", "required": false, "read_only": true, "label": "ID"}, "uuid": {"type": "field", "required": false, "read_only": true, "label": "Uuid"}, "project_id": {"type": "field", "required": false, "read_only": false, "label": "Project id", "choices": [{"display_name": "My First Project", "value": "1"}, {"display_name": "My First Project", "value": "2"}]}, "map_title": {"type": "string", "required": false, "read_only": false, "label": "map_title"}, "instructions": {"type": "memo", "required": false, "read_only": false, "label": "instructions"}, "tags": {"type": "field", "required": false, "read_only": false, "label": "tags", "help_text": "Tag your object here"}, "pdf": {"type": "field", "required": false, "read_only": true, "label": "Pdf"}, "thumb": {"type": "field", "required": false, "read_only": true, "label": "Thumb"}, "zoom": {"type": "integer", "required": false, "read_only": true, "label": "Zoom", "min_value": 1, "max_value": 20}, "map_provider": {"type": "field", "required": false, "read_only": true, "label": "Map provider"}, "map_provider_url": {"type": "field", "required": false, "read_only": true, "label": "Map provider url"}, "layout": {"type": "field", "required": false, "read_only": true, "label": "Layout"}, "layout_url": {"type": "field", "required": false, "read_only": true, "label": "Layout url"}, "center": {"type": "geojson", "required": false, "read_only": true, "label": "Center", "help_text": "Assign a GeoJSON center point"}, "overlay_type": {"type": "field", "required": false, "read_only": true, "label": "Overlay type"}},
                projectUpdateMetadata: {"url": {"type": "field", "required": false, "read_only": true, "label": "Url"}, "id": {"type": "integer", "required": false, "read_only": true, "label": "ID"}, "name": {"type": "string", "required": false, "read_only": false, "label": "name"}, "caption": {"type": "memo", "required": false, "read_only": false, "label": "caption"}, "overlay_type": {"type": "field", "required": false, "read_only": true, "label": "Overlay type"}, "tags": {"type": "field", "required": false, "read_only": false, "label": "tags", "help_text": "Tag your object here"}, "owner": {"type": "field", "required": false, "read_only": true, "label": "Owner"}, "slug": {"type": "slug", "required": false, "read_only": false, "label": "friendly url", "max_length": 100}, "access": {"type": "field", "required": false, "read_only": true, "label": "Access"}, "children": {"type": "field", "required": false, "read_only": true, "label": "Children"}},
                projectCreateMetadata: {"url": {"type": "field", "required": false, "read_only": true, "label": "Url"}, "id": {"type": "integer", "required": false, "read_only": true, "label": "ID"}, "name": {"type": "string", "required": false, "read_only": false, "label": "name"}, "caption": {"type": "memo", "required": false, "read_only": false, "label": "caption"}, "overlay_type": {"type": "field", "required": false, "read_only": true, "label": "Overlay type"}, "tags": {"type": "field", "required": false, "read_only": false, "label": "tags", "help_text": "Tag your object here"}, "owner": {"type": "field", "required": false, "read_only": true, "label": "Owner"}, "slug": {"type": "slug", "required": true, "read_only": false, "label": "friendly url", "max_length": 100}, "access": {"type": "field", "required": false, "read_only": true, "label": "Access"}}
            };

            this.spreadsheetApp = {
                router: null,
                activeTableID: null
            };

        });
    }
);
