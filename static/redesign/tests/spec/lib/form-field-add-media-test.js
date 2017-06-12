/* GOAL OF THIS TEST WILL BE TO TEST THE
 * Backbone.Form.editors.MediaEditor FORM FIELD,
 * LOCATED IN lib/forms/backbone-form-editor.
 *
 * NEEDED TESTS:
 *   - MAKE SURE THAT IT RENDERES A PLUS BUTTON
 *   - IF USER CLICKS PLUS BUTTON, IT TRIGGERS
 *     THE MEDIA BROWSER
 *   - IF USER SELECTS MEDIA, IT SHOULD
 *     RENDER MEDIA THUMBNAILS NEXT TO PLUS BUTTON
 *   - IF USER CLICKS THE 'DELETE MEDIA BUTTON', IT
 *     REMOVES MEDIA FILE
 *   - IF THE MARKER ALREADY HAS MEDIA, IT SHOULD
 *     RENDER MEDIA THUMBNAILS NEXT TO PLUS BUTTON
 *
 */
var rootDir = "../../";
define([
    "backbone",
    "models/marker",
    rootDir + "lib/forms/backbone-form",
    "tests/spec-helper"
],
    function (Backbone, Marker, DataForm) {
        'use strict';
        var fixture,
            initForm,
            initMarkers,
            markerPlain,
            markerPhotos,
            markerAudio,
            form,
            initSpies,
            MediaEditor = Backbone.Form.editors.MediaEditor;

        initSpies = function () {
            spyOn(MediaEditor.prototype, "initialize").and.callThrough();
            spyOn(MediaEditor.prototype, "attachModels").and.callThrough();
        };

        initMarkers = function () {
            markerPlain = new Marker({
                "name": "No media",
                "caption": "",
                "overlay_type": "marker",
                "children": {},
                "photo_count": 0,
                "audio_count": 0
            });
            markerPhotos = new Marker({
                "name": "No media",
                "caption": "",
                "overlay_type": "marker",
                "photo_count": 2,
                "audio_count": 0,
                "children": {
                    "photos": {
                        "overlay_type": "photo",
                        "data": [
                            {
                                "id": 30,
                                "name": "Screen Shot 2017-06-11 at 3.35.03 PM.png",
                                "path_medium": "http://localhost:7777/profile/photos/L3VzZXJkYXRhL21lZGlhL3ZhbndhcnMvcGhvdG9zL3NjcmVlbnNob3QyMDE3MDYxMWF0MzM1MDNwbV81MDAucG5nIzE0OTcyOTc3MzE=/"
                            },
                            {
                                "id": 29,
                                "name": "Screen Shot 2017-06-11 at 3.31.59 PM.png",
                                "path_medium": "http://localhost:7777/profile/photos/L3VzZXJkYXRhL21lZGlhL3ZhbndhcnMvcGhvdG9zL3NjcmVlbnNob3QyMDE3MDYxMWF0MzMxNTlwbV81MDAucG5nIzE0OTcyOTc3MzE=/"
                            }
                        ],
                        "id": "photos",
                        "name": "Photos"
                    }
                }
            });
            markerAudio = new Marker({
                "name": "No media",
                "caption": "",
                "overlay_type": "marker",
                "photo_count": 0,
                "audio_count": 2,
                "children": {
                    "audio": {
                        "overlay_type": "audio",
                        "data": [
                            {
                                "id": 9,
                                "name": "tmpleq1fx.mp3",
                                "file_path": "http://localhost:7777/profile/audio/L3VzZXJkYXRhL21lZGlhL3ZhbndhcnMvYXVkaW8vdG1wbGVxMWZ4XzE0OTcyOTc5MzMubXAzIzE0OTcyOTc5NDc=/"
                            },
                            {
                                "id": 8,
                                "name": "tmpio4flf.mp3",
                                "file_path": "http://localhost:7777/profile/audio/L3VzZXJkYXRhL21lZGlhL3ZhbndhcnMvYXVkaW8vdG1waW80ZmxmXzE0OTcyOTc5MzMubXAzIzE0OTcyOTc5NDc=/"
                            }
                        ],
                        "id": "audio"
                    }
                }
            });
        };

        initForm = function (scope, marker) {
            form = new DataForm({
                model: marker,
                schema: marker.getFormSchema(),
                app: scope.app
            });
            form.render();
            fixture = setFixtures("<div></div>").append(form.$el);
        };

        describe("Form: Add Media Field Test: Initializes and Renders Correctly", function () {

            beforeEach(function () {
                initSpies();
                initMarkers();
            });

            it("Initializes correctly", function () {
                expect(MediaEditor.prototype.initialize).toHaveBeenCalledTimes(0);
                initForm(this, markerPlain);
                expect(form.app).toEqual(this.app);
                expect(MediaEditor.prototype.initialize).toHaveBeenCalledTimes(1);
            });

            it("Listens for 'add-models-to-marker' event", function () {
                initForm(this, markerPlain);
                expect(MediaEditor.prototype.attachModels).toHaveBeenCalledTimes(0);
                this.app.vent.trigger('add-models-to-marker', [this.photos.at(0), this.photos.at(1)]);
                expect(MediaEditor.prototype.attachModels).toHaveBeenCalledTimes(1);
            });
        });
        
        describe("Form: Add Media Field Test: Renders correctly", function () {

            beforeEach(function () {
                initSpies();
            });

            it("Only renders a plus button if no children exist", function () {
                initForm(this, markerPlain);
                expect(1).toEqual(-1);
            });

            it("Renders 2 photos if there are 2 child photos", function () {
                initForm(this, markerPhotos);
                expect(1).toEqual(-1);
            });

            it("Renders 2 audio files if there are 2 child audio files", function () {
                initForm(this, markerAudio);
                expect(1).toEqual(-1);
            });

        });

    });
