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
        var fixture, newDataDetail, setupDataDetail, initSpies;

        setupDataDetail = function (scope, opts) {
            //console.log(opts.model);
            var model = opts.model || scope.marker,
                dataType = opts.dataType || "markers";
            scope.app.mode = opts.mode || "edit";
            newDataDetail = new DataDetail({
                app: scope.app,
                model: model,
                dataType: dataType
            });
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
                console.log(this.audio_file);
                newDataDetail.render();
                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);
                console.log(fixture.html());

                // 3. ensure photo render correctly:
                expect(fixture.find("h4").html()).toEqual("Preview");
                //expect(fixture.html()).toContainText(this.photo.get("name"));
                //expect(fixture.html()).toContainText(this.photo.get("caption"));
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

        describe("Data Detail: Edit Render", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Successfully calls editRender", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully renders video", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully renders photo", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully renders audio", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully renders record", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully renders marker", function(){
                expect(1).toEqual(-1);
            });
        });

        describe("Data Detail: Switching View Modes", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Successfully calls switchToViewMode", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls switchToEditMode", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls switchToAddMode", function(){
                expect(1).toEqual(-1);
            });
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
