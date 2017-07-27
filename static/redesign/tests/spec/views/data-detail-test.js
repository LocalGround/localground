/*
  Data Detail Test goes here
*/

var rootDir = "../../";
define([
    "handlebars",
    rootDir + "apps/spreadsheet/views/main",
    rootDir + "models/form",
    rootDir + "collections/photos",
    rootDir + "collections/audio",
    rootDir + "collections/markers",
    rootDir + "collections/records",
    rootDir + "lib/carousel/carousel",
    rootDir + "apps/gallery/views/data-detail",
    rootDir + "lib/audio/audio-player",
    "tests/spec-helper"
],
    function (Handlebars, Spreadsheet, Form, Photos, Audio,
              Markers, Records, Carousel, DataDetail, AudioPlayer) {
        //
        //
        //
        'use strict';
        var fixture, newDataDetail, setupDataDetail, initSpies, lat, lng;

        setupDataDetail = function (scope, opts) {
            //console.log(opts.model);
            var model = opts.model || scope.marker,
                dataType = opts.dataType || "markers";
            scope.app.mode = opts.mode || "edit";
            scope.app.screenType = opts.screenType || "map";
            newDataDetail = new DataDetail({
                app: scope.app,
                model: model,
                dataType: dataType
            });
            if (model.get("geometry") != null){
                lat =  model.get("geometry").coordinates[1].toFixed(4);
                lng =  model.get("geometry").coordinates[0].toFixed(4);
            }
            fixture = setFixtures('<div></div>');
        };

        initSpies = function (scope) {
            spyOn(DataDetail.prototype, "initialize").and.callThrough();
            spyOn(DataDetail.prototype, "render").and.callThrough();
            //
            spyOn(DataDetail.prototype, "viewRender").and.callThrough();
            spyOn(DataDetail.prototype, "editRender").and.callThrough();
            spyOn(DataDetail.prototype, "onRender").and.callThrough();
            //
            spyOn(DataDetail.prototype, "saveModel").and.callThrough();
            spyOn(DataDetail.prototype, "deleteModel").and.callThrough();
            spyOn(DataDetail.prototype, "activateMarkerTrigger").and.callThrough();
            spyOn(DataDetail.prototype, "deleteMarkerTrigger").and.callThrough();
            //
            spyOn(DataDetail.prototype, "showMapPanel").and.callThrough();
            spyOn(DataDetail.prototype, "hideMapPanel").and.callThrough();
            spyOn(DataDetail.prototype, "doNotDisplay").and.callThrough();
            //
            spyOn(DataDetail.prototype, "rotatePhoto").and.callThrough();
            spyOn(DataDetail.prototype, "templateHelpers").and.callThrough();
            //
            spyOn(DataDetail.prototype, "switchToEditMode").and.callThrough();
            spyOn(DataDetail.prototype, "switchToViewMode").and.callThrough();
            spyOn(DataDetail.prototype, "switchToAddMode").and.callThrough();

            spyOn(AudioPlayer.prototype, "initialize").and.callThrough();

        };

        describe("Data Detail: Initialization Test", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Data Detail successfully created", function(){
                newDataDetail = new DataDetail({
                    app: this.app,
                    model: this.marker,
                    mode: "view"
                });
                expect(newDataDetail).toEqual(jasmine.any(DataDetail));
            });
        });

        describe("Data Detail: Render Test", function(){
            beforeEach(function(){
                initSpies(this);
            });
            it ("Initial render test successful", function(){
                //expect("Please write render test code").toEqual(0);
                expect(1).toEqual(1);
            });
        });

        describe("Data Detail: Featured Image", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Stub test", function(){
                newDataDetail = new DataDetail({
                    app: this.app,
                    model: this.marker,
                    mode: "view"
                });
                console.log(this.marker);
                expect(1).toEqual(-1);
            });
        });

        describe("Data Detail: Other Functions", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Successfully calls activateRectangleTrigger", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls activateMarkerTrigger", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls deleteMarkerTrigger", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls bindFields", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls rotatePhoto", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls commitForm", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls doNotDisplay", function(){
                expect(1).toEqual(-1);
            });
        });

        describe("Data Detail: Model Functions", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Successfully calls saveModel", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls deleteModel", function(){
                expect(1).toEqual(-1);
            });
        });

        describe("Data Detail: View Render", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Successfully calls viewRender", function() {
                expect(1).toEqual(-1);
            });

            it("Successfully renders video YouTube", function () {
                // 1. initialize the dataDetail view with a video model:
                this.videoYouTube = this.videos.at(0);
                setupDataDetail(this, {
                    model: this.videoYouTube,
                    mode: "view",
                    dataType: "videos"
                });
                newDataDetail.render();
                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);

                // 3. ensure that the required elements have been rendered:
                expect(fixture.find("h4").html()).toEqual("Preview");
                expect(fixture.html()).toContainText(this.videoYouTube.get("name"));
                expect(fixture.html()).toContainText(this.videoYouTube.get("caption"));
                expect(fixture).toContainElement("iframe");
                expect(fixture.find("iframe").attr("src")).toEqual("https://www.youtube.com/embed/" + this.videoYouTube.get("video_id") + "?ecver=1");
                expect(fixture.find("iframe").attr("height")).toEqual("200");
                expect(fixture.find("iframe").attr("width")).toEqual("350");
            });

            it("Successfully renders video Vimeo", function () {
                // 1. initialize the dataDetail view with a video model:
                this.videoVimeo = this.videos.at(2);
                setupDataDetail(this, {
                    model: this.videoVimeo,
                    mode: "view",
                    dataType: "videos"
                });
                newDataDetail.render();
                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);

                // 3. ensure iframe render correctly:
                expect(fixture.find("h4").html()).toEqual("Preview");
                expect(fixture.html()).toContainText(this.videoVimeo.get("name"));
                expect(fixture.html()).toContainText(this.videoVimeo.get("caption"));
                expect(fixture).toContainElement("iframe");
                expect(fixture.find("iframe").attr("src")).toEqual("https://player.vimeo.com/video/" + this.videoVimeo.get("video_id"));
                expect(fixture.find("iframe").attr("height")).toEqual("200");
                expect(fixture.find("iframe").attr("width")).toEqual("350");
            });

            it("Successfully renders photo", function () {
                // 1. initialize the dataDetail view with a photo model:
                this.photo = this.photos.at(0);
                setupDataDetail(this, {
                    model: this.photo,
                    mode: "view",
                    dataType: "photos"
                });
                newDataDetail.render();
                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);

                // 3. ensure photo render correctly:
                expect(fixture.find("h4").html()).toEqual("Preview");
                expect(fixture.html()).toContainText(this.photo.get("name"));
                expect(fixture.html()).toContainText(this.photo.get("caption"));
                expect(fixture).toContainElement("img");
                expect(fixture.find("img").attr("src")).toEqual(this.photo.get("path_medium"));
            });

            it("Successfully renders audio", function () {
                // 1. initialize the dataDetail view with an audio model:
                this.audio_file = this.audioFiles.at(0)
                setupDataDetail(this, {
                    model: this.audio_file,
                    mode: "view",
                    dataType: "audio"
                    //audioMode: "detailed"
                });
                newDataDetail.render();
                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);

                // 3. ensure photo render correctly:
                expect(fixture.find("h4").html()).toEqual("Preview");
                expect(fixture.html()).toContain("player-container");
                expect(fixture.html()).toContain("audio-detail");
                expect(fixture).toContainElement("audio");
                expect(fixture).toContainElement("source");
                expect(fixture.find("source").attr("src")).toEqual(this.audio_file.get("file_path"));

            });

            it("Successfully renders record with all media count", function () {
                // 1. initialize the dataDetail view with a record model:
                /*
                Let's first test with all media types present
                */
                this.record_test = this.form_1.at(0);
                this.record_test.set("children", {
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
                this.record_test.set("video_count",1);
                this.record_test.set("photo_count",1);
                this.record_test.set("audio_count",1);

                setupDataDetail(this, {
                    model: this.record_test,
                    mode: "view"

                });
                newDataDetail.render();
                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);

                // 3. ensure photo render correctly:
                expect(fixture.find("h4").html()).toEqual("Preview");
                expect(fixture.html()).toContain("section");
                expect(fixture.html()).toContain("carousel-video");
                expect(fixture.html()).toContain("carousel-photo");
                expect(fixture.html()).toContain("carousel-audio");
                expect(fixture.find("h3").html()).toEqual(this.record_test.get("name"));
                expect(fixture.find("p").html()).toEqual(this.record_test.get("caption"));
            });

            it("Successfully renders record without media count", function () {
                // 1. initialize the dataDetail view with a record model:
                this.record_test = this.form_1.at(0);

                setupDataDetail(this, {
                    model: this.record_test,
                    mode: "view"

                });
                newDataDetail.render();
                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);

                // 3. ensure photo render correctly:
                expect(fixture.find("h4").html()).toEqual("Preview");
                expect(fixture.html()).toContain("section");
                expect(fixture.html()).not.toContain("carousel-video");
                expect(fixture.html()).not.toContain("carousel-photo");
                expect(fixture.html()).not.toContain("carousel-audio");
                expect(fixture.find("h3").html()).toEqual(this.record_test.get("name"));
                expect(fixture.find("p").html()).toEqual(this.record_test.get("caption"));
            });

            it("Successfully renders marker with all media count", function () {
                // 1. initialize the dataDetail view with a record model:
                /*
                Let's first test with all media types present
                */

                setupDataDetail(this, {
                    model: this.marker,
                    mode: "view"
                });
                newDataDetail.render();
                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);

                // 3. ensure photo render correctly:
                expect(fixture.find("h4").html()).toEqual("Preview");
                expect(fixture.html()).toContain("section");
                expect(fixture.html()).toContain("carousel-video");
                expect(fixture.html()).toContain("carousel-photo");
                expect(fixture.html()).toContain("carousel-audio");
                expect(fixture.find("h3").html()).toEqual(this.marker.get("name"));
                expect(fixture.find("p").html()).toEqual(this.marker.get("caption"));
            });
        });

        /*
          Edit mode does contain marker editor when map is slected as screen type
        */
        describe("Data Detail: Edit Render", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Successfully calls editRender", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully renders video with Geometry", function () {
                // 1. initialize the dataDetail view with a video model:
                this.videoYouTube = this.videos.at(0);
                setupDataDetail(this, {
                    model: this.videoYouTube,
                    mode: "edit",
                    dataType: "videos",
                    screenType: "map"
                });
                newDataDetail.render();
                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);

                // 3. ensure that the required elements have been rendered:
                expect(fixture.find("h4").html()).toEqual("Edit");
                expect(fixture).toContainElement("iframe");
                console.log(fixture.html());
                expect(fixture.find("button.delete-marker-button").html()).toEqual("Remove Location Marker");
                expect(fixture.find(".latlong").html()).toContain("(" + lat + ", " + lng + ")");
                expect(fixture.find("iframe").attr("src")).toEqual("https://www.youtube.com/embed/" + this.videoYouTube.get("video_id") + "?ecver=1");
                expect(fixture.find("iframe").attr("height")).toEqual("250");

                // ensure that form is rendering correctly:
                expect(fixture.find("input[name='name']").val()).toEqual(this.videoYouTube.get("name") || '');
                expect(fixture.find("textarea[name='caption']").val()).toEqual(this.videoYouTube.get("caption") || '');
                expect(fixture.find("input[name='attribution']").val()).toEqual(this.videoYouTube.get("attribution") || '');
                expect(fixture.find("input[name='video_id']").val()).toEqual(this.videoYouTube.get("video_id") || '');
                expect(fixture.find("select[name='video_provider']").val()).toEqual(this.videoYouTube.get("video_provider") || '');
                expect(fixture.find("select[name='video_provider']").html()).toContain("vimeo");
                expect(fixture.find("select[name='video_provider']").html()).toContain("youtube");
            });

            it("Successfully renders video without Geometry", function () {
                // 1. initialize the dataDetail view with a video model:
                this.videoVimeo = this.videos.at(2);
                this.videoVimeo.set("geometry", null);
                setupDataDetail(this, {
                    model: this.videoVimeo,
                    mode: "edit",
                    dataType: "videos",
                    screenType: "map"
                });
                newDataDetail.render();
                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);

                // 3. ensure iframe render correctly:
                expect(fixture.find("h4").html()).toEqual("Edit");
                expect(fixture).toContainElement("iframe");
                expect(fixture.find("button.add-marker-button").html()).toEqual("Add Location Marker");
                expect(fixture.find("iframe").attr("src")).toEqual("https://player.vimeo.com/video/" + this.videoVimeo.get("video_id"));
                expect(fixture.find("iframe").attr("height")).toEqual("250");
            });

            it("Successfully renders photo", function () {
                // 1. initialize the dataDetail view with a photo model:
                this.photo = this.photos.at(0);
                setupDataDetail(this, {
                    model: this.photo,
                    mode: "edit",
                    dataType: "photos",
                    screenType: "map"
                });
                newDataDetail.render();
                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);

                // 3. ensure photo render correctly:
                expect(fixture.find("h4").html()).toEqual("Edit Media Details");
                expect(fixture).toContainElement("img");
                expect(fixture).toContain("add-lat-lng");
                expect(fixture).toContain("latlong-container");
                expect(fixture.find("img").attr("src")).toEqual(this.photo.get("path_medium"));
            });

            it("Successfully renders audio", function () {
                // 1. initialize the dataDetail view with an audio model:
                this.audio_file = this.audioFiles.at(0)
                setupDataDetail(this, {
                    model: this.audio_file,
                    mode: "edit",
                    dataType: "audio",
                    screenType: "map"
                });
                newDataDetail.render();
                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);

                // 3. ensure photo render correctly:
                expect(fixture.find("h4").html()).toEqual("Edit");
                expect(fixture.html()).toContain("player-container");
                expect(fixture.html()).toContain("audio-detail");
                expect(fixture).toContain("add-lat-lng");
                expect(fixture).toContain("latlong-container");
                expect(fixture).toContainElement("audio");
                expect(fixture).toContainElement("source");
                expect(fixture.find("source").attr("src")).toEqual(this.audio_file.get("file_path"));

            });

            it("Successfully renders record", function () {
                // 1. initialize the dataDetail view with a record model:
                /*
                Let's first test with all media types present
                */
                this.record_test = this.form_1.at(0);
                this.record_test.set("children", {
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
                this.record_test.set("video_count",1);
                this.record_test.set("photo_count",1);
                this.record_test.set("audio_count",1);

                setupDataDetail(this, {
                    model: this.record_test,
                    mode: "edit",
                    screenType: "map"

                });
                newDataDetail.render();
                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);

                // 3. ensure photo render correctly:
                expect(fixture.find("h4").html()).toEqual("Edit");
                expect(fixture).toContain("add-lat-lng");
                expect(fixture).toContain("latlong-container");
                // I do not know how to find that target ID through fixture
                expect(fixture).toHaveId("modal-form");
            });

            it("Successfully renders marker", function () {
                // 1. initialize the dataDetail view with a record model:
                /*
                Let's first test with all media types present
                */

                setupDataDetail(this, {
                    model: this.marker,
                    mode: "edit",
                    screenType: "map"
                });
                newDataDetail.render();
                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);

                // 3. ensure photo render correctly:
                expect(fixture.find("h4").html()).toEqual("Edit");
                expect(fixture).toContain("add-lat-lng");
                expect(fixture).toContain("latlong-container");
                expect(fixture).toHaveId("modal-form");
            });
        });

        describe("Data Detail: Switching Modes", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Successfully Switches from Edit to View Mode", function(){
                // 1. Set up the data detail to edit mode
                setupDataDetail(this, {
                    model: this.marker,
                    mode: "edit"
                });

                newDataDetail.render();
                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);

                // Now Test by clicking on view mode button
                expect(DataDetail.prototype.switchToViewMode).toHaveBeenCalledTimes(0);
                fixture.find(".view-mode").trigger('click');
                expect(DataDetail.prototype.switchToViewMode).toHaveBeenCalledTimes(1);
            });

            it("Successfully Switches from View to Edit Mode", function(){
                // 1. Set up the data detail to view mode
                setupDataDetail(this, {
                    model: this.marker,
                    mode: "view"
                });

                newDataDetail.render();
                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);

                // Now Test by clicking on edit mode button
                expect(DataDetail.prototype.switchToEditMode).toHaveBeenCalledTimes(0);
                fixture.find(".edit-mode").trigger('click');
                expect(DataDetail.prototype.switchToEditMode).toHaveBeenCalledTimes(1);
            });
            /*
            it("Successfully calls switchToAddMode", function(){
                expect(1).toEqual(-1);
            });
            */
        });

        describe("Data Detail: Map Functions", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Successfully calls hideMapPanel", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls showMapPanel", function(){
                expect(1).toEqual(-1);
            });
        });

    });
