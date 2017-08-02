/* GOAL OF THIS TEST WILL BE TO TEST THE
 * Backbone.Form.editors.MediaEditor FORM FIELD,
 * LOCATED IN lib/forms/backbone-form-editor.
 *
 * NEEDED TESTS:
 *   - IF USER SELECTS MEDIA, IT SHOULD
 *     RENDER MEDIA THUMBNAILS NEXT TO PLUS BUTTON
 *   - IF USER CLICKS THE 'DELETE MEDIA BUTTON', IT
 *     REMOVES MEDIA FILE
 *   - IF THE MARKER ALREADY HAS MEDIA, IT SHOULD
 *     RENDER MEDIA THUMBNAILS NEXT TO PLUS BUTTON // Covered in the render tests (?)
 *
 */
var rootDir = "../../";
define([
    "backbone",
    "models/marker",
    "apps/gallery/views/add-media",
    rootDir + "lib/forms/backbone-form",
    "tests/spec-helper"
],
    function (Backbone, Marker, AddMedia, DataForm) {
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

        initSpies = function (scope) {
            spyOn(MediaEditor.prototype, "initialize").and.callThrough();
            spyOn(MediaEditor.prototype, "render").and.callThrough();
            spyOn(MediaEditor.prototype, "renderAudioPlayers").and.callThrough();
            spyOn(MediaEditor.prototype, "enableMediaReordering").and.callThrough();
            spyOn(MediaEditor.prototype, "attachModels").and.callThrough();
            spyOn(MediaEditor.prototype, "showMediaBrowser").and.callThrough();
            spyOn(MediaEditor.prototype, "attachMedia").and.callThrough();
            spyOn(MediaEditor.prototype, "detachModel").and.callThrough();

            spyOn(scope.app.vent, 'trigger').and.callThrough();
            spyOn(AddMedia.prototype, "initialize").and.callThrough();
        };

        initMarkers = function () {
            markerPlain = new Marker({
                "name": "No media",
                "caption": "",
                "project_id": 1,
                "overlay_type": "marker",
                "children": {},
                "photo_count": 0,
                "audio_count": 0
            });
            markerPhotos = new Marker({
                "name": "Photo media",
                "caption": "",
                "project_id": 2,
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
                "name": "Audio media",
                "caption": "",
                "project_id": 3,
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
                initSpies(this);
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
                markerPlain.trigger('add-models-to-marker', [this.photos.at(0), this.photos.at(1)]);
                expect(MediaEditor.prototype.attachModels).toHaveBeenCalledTimes(1);
            });
        });

        describe("Form: Add Media Field Test: Renders correctly", function () {

            beforeEach(function () {
                initSpies(this);
                initMarkers();
            });

            it("Only renders a plus button if no children exist", function () {
                initForm(this, markerPlain);
                var mediaContainer = fixture.find(".attached-media-container");
                expect(mediaContainer[0].children.length).toEqual(1); // The one child should only be the add media with plus

                var addMediaButton = fixture.find("#add-media-button");
                expect(mediaContainer[0]).toContainElement(addMediaButton[0]);
            });

            it("Renders 2 photos if there are 2 child photos", function () {
                initForm(this, markerPhotos);
                var mediaContainer = fixture.find(".attached-media-container");
                var photos = fixture.find(".photo-attached");
                var mediaAttached = fixture.find(".attached-media");
                expect(mediaContainer[0].children.length).toEqual(3);
                expect(photos.length).toEqual(2);
                // Now inspect the two individual photos
                // The simeple way
                expect(photos[0]).toContainElement(mediaAttached[0]);
                expect(photos[1]).toContainElement(mediaAttached[1]);
                // The more detailed way
                expect($(mediaAttached[0]).attr("style")).toEqual(
                    'background: url(\'http://localhost:7777/profile/photos/L3VzZXJkYXRhL21lZGlhL3ZhbndhcnMvcGhvdG9zL3NjcmVlbnNob3QyMDE3MDYxMWF0MzM1MDNwbV81MDAucG5nIzE0OTcyOTc3MzE=/\');'
                );
                expect($(mediaAttached[1]).attr("style")).toEqual(
                    'background: url(\'http://localhost:7777/profile/photos/L3VzZXJkYXRhL21lZGlhL3ZhbndhcnMvcGhvdG9zL3NjcmVlbnNob3QyMDE3MDYxMWF0MzMxNTlwbV81MDAucG5nIzE0OTcyOTc3MzE=/\');'
                );
                
            });

            it("Renders 2 audio files if there are 2 child audio files", function () {
                initForm(this, markerAudio);
                var mediaContainer = fixture.find(".attached-media-container");
                var audio_files = fixture.find(".audio-attached");
                var audioBasic = fixture.find(".audio-basic");
                var audioSource = fixture.find("source");
                expect(mediaContainer[0].children.length).toEqual(3);
                expect(audio_files.length).toEqual(2);
                // Now inspect the two individual audio_files
                // The simeple way
                expect(audio_files[0]).toContainElement(audioBasic[0]);
                expect(audio_files[1]).toContainElement(audioBasic[1]);
                // The more detailed way
                expect(audioSource[0]).toHaveAttr("src", "http://localhost:7777/profile/audio/L3VzZXJkYXRhL21lZGlhL3ZhbndhcnMvYXVkaW8vdG1wbGVxMWZ4XzE0OTcyOTc5MzMubXAzIzE0OTcyOTc5NDc=/");
                expect(audioSource[1]).toHaveAttr("src", "http://localhost:7777/profile/audio/L3VzZXJkYXRhL21lZGlhL3ZhbndhcnMvYXVkaW8vdG1waW80ZmxmXzE0OTcyOTc5MzMubXAzIzE0OTcyOTc5NDc=/");
            });

            it("Render AudioPlayer gets executed", function () {
                expect(MediaEditor.prototype.renderAudioPlayers).toHaveBeenCalledTimes(0);
                initForm(this, markerAudio);
                expect(MediaEditor.prototype.renderAudioPlayers).toHaveBeenCalledTimes(1);
                var audioPlayCtrls = fixture.find(".play-ctrls");
                var audioPlay = fixture.find(".play");
                expect(audioPlayCtrls[0]).not.toContainElement("div.pause");
                $(audioPlay[0]).trigger('click');
                expect(audioPlayCtrls[0]).toContainElement("div.fa-pause");
            });

            it("Enable Media Reordering gets executed", function(){
                initForm(this, markerPhotos);
                //
                //
                var mediaContainer = fixture.find(".attached-media-container");
                var uiSortableHandles = fixture.find(".ui-sortable-handle");
                expect(mediaContainer).toContainElement(uiSortableHandles);
                expect(mediaContainer.children.length).toEqual(2);
                expect(uiSortableHandles.children.length).toEqual(2);
                expect(mediaContainer.children.length).toEqual(uiSortableHandles.children.length);
            });
        });

        describe("Form: Add Media Field Test: Testing that All Interactions Work Properly", function(){

            beforeEach(function(){
                initSpies(this);
                initMarkers();
            });

            it("Calls the showMediaBrowser method when plus button clicked", function () {
                initForm(this, markerPlain);
                //expect(modalWindow[0].css('display')).toEqual('none');
                expect(MediaEditor.prototype.showMediaBrowser).toHaveBeenCalledTimes(0);
                fixture.find("#add-media-button").trigger('click');
                expect(MediaEditor.prototype.showMediaBrowser).toHaveBeenCalledTimes(1);
            });

            it("showMediaBrowser triggers the opening of the modal window correctly", function () {
                initForm(this, markerPlain);
                expect(AddMedia.prototype.initialize).toHaveBeenCalledTimes(0);
                expect(this.app.vent.trigger).not.toHaveBeenCalledWith('show-modal', {
                    title: 'Media Browser',
                    width: 1100,
                    height: 400,
                    view: jasmine.any(Object),
                    saveButtonText: "Add",
                    showSaveButton: true,
                    saveFunction: jasmine.any(Function)
                });
                fixture.find("#add-media-button").trigger('click');
                expect(AddMedia.prototype.initialize).toHaveBeenCalledTimes(1);
                expect(this.app.vent.trigger).toHaveBeenCalledWith('show-modal', {
                    title: 'Media Browser',
                    width: 1100,
                    height: 400,
                    view: jasmine.any(Object),
                    saveButtonText: "Add",
                    showSaveButton: true,
                    saveFunction: jasmine.any(Function)
                });
            });
            
        });
    
        describe("Form: Attach and Detach media / models", function(){
            beforeEach(function(){
                initSpies(this);
                initMarkers();
            });

            it("Executes attachModels successfully", function(){
                /*
                 * Assume that the add button is clicked and a few models will be added from the helper file

                 form.attachModels (the two models provided);

                 then check the following:
                 new length is two more than previous
                 form re-renders with two more
                */
                initForm(this, markerPlain);
                expect(MediaEditor.prototype.render).toHaveBeenCalledTimes(1);
                expect(this.app.vent.trigger).not.toHaveBeenCalledWith('hide-modal');
                markerPlain.trigger('add-models-to-marker', [this.photos.at(0), this.photos.at(1)]);
                expect(this.app.vent.trigger).toHaveBeenCalledWith('hide-modal');
                expect(MediaEditor.prototype.render).toHaveBeenCalledTimes(1);
            });

            it("Executes detachModel successfully", function(){
                /*
                * Search for the one existing media to detach,
                * then check that detach model has been called
                *
                */
                initForm(this, markerPhotos);
                spyOn(markerPhotos, 'detach').and.callThrough();
                var mediaContainer = fixture.find(".attached-media-container");
                var photos = fixture.find(".photo-attached");
                var detachMediaFixutre = fixture.find(".detach_media")
                //
                // Let's pick one of the photos to delete
                //
                expect(photos[0]).toContainElement(detachMediaFixutre[0]);
                expect(photos[1]).toContainElement(detachMediaFixutre[1]);
                expect(MediaEditor.prototype.detachModel).toHaveBeenCalledTimes(0);
                expect(markerPhotos.detach).toHaveBeenCalledTimes(0);
                $(detachMediaFixutre[0]).trigger('click');
                expect(MediaEditor.prototype.detachModel).toHaveBeenCalledTimes(1);
                expect(markerPhotos.detach).toHaveBeenCalledTimes(1);
            });

        });

    });
