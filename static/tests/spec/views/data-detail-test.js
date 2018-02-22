/*
  Data Detail Test goes here
*/

var rootDir = "../../";
define([
    "handlebars",
    rootDir + "apps/dataviewer/spreadsheet/views/main",
    rootDir + "models/form",
    rootDir + "collections/photos",
    rootDir + "collections/audio",
    rootDir + "collections/markers",
    rootDir + "collections/records",
    rootDir + "lib/carousel/carousel",
    rootDir + "views/data-detail",
    rootDir + "lib/audio/audio-player",
    rootDir + "lib/maps/overlays/icon",
    "tests/spec-helper"
],
    function (Handlebars, Spreadsheet, Form, Photos, Audio,
              Markers, Records, Carousel, DataDetail, AudioPlayer, Icon) {

        'use strict';
        var fixture, newDataDetail, setupDataDetail, initSpies, lat, lng;

        setupDataDetail = function (scope, opts) {
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
            spyOn(scope.app.vent, "trigger").and.callThrough();

            spyOn(DataDetail.prototype, "initialize").and.callThrough();
            spyOn(DataDetail.prototype, "render").and.callThrough();
            spyOn(DataDetail.prototype, "bindFields").and.callThrough();
            //
            spyOn(DataDetail.prototype, "viewRender").and.callThrough();
            spyOn(DataDetail.prototype, "editRender").and.callThrough();
            spyOn(DataDetail.prototype, "onRender").and.callThrough();
            //
            spyOn(DataDetail.prototype, "saveModel").and.callThrough();
            spyOn(DataDetail.prototype, "deleteModel").and.callThrough();
            spyOn(DataDetail.prototype, "activateMarkerTrigger").and.callThrough();
            spyOn(DataDetail.prototype, "deleteMarker").and.callThrough();
            spyOn(DataDetail.prototype, "commitForm").and.callThrough();
            //
            spyOn(DataDetail.prototype, "showMapPanel").and.callThrough();
            spyOn(DataDetail.prototype, "hideMapPanel").and.callThrough();
            spyOn(DataDetail.prototype, "doNotDisplay").and.callThrough();
            //
            spyOn(DataDetail.prototype, "rotatePhoto").and.callThrough();
            spyOn(DataDetail.prototype, "getFeaturedImage").and.callThrough();
            spyOn(DataDetail.prototype, "templateHelpers").and.callThrough();

            spyOn(DataDetail.prototype, "setVideoAttribute").and.callThrough();
            //
            spyOn(DataDetail.prototype, "switchToEditMode").and.callThrough();
            spyOn(DataDetail.prototype, "switchToViewMode").and.callThrough();
            spyOn(DataDetail.prototype, "switchToAddMode").and.callThrough();

            spyOn(AudioPlayer.prototype, "initialize").and.callThrough();
            spyOn(Carousel.prototype, "initialize").and.callThrough();

            spyOn($, 'ajax').and.callFake(function (response) {
                if (response.success) {
                    response.success({ foo: 'bar' });
                }
            });

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

            it("Successfully calls bindFields", function(){
                newDataDetail = new DataDetail({
                    app: this.app,
                    model: this.marker,
                    mode: "view"
                });
                expect(DataDetail.prototype.bindFields).toHaveBeenCalledTimes(1);
            });
        });

        describe("Data Detail: Featured Image", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Successfully calls Get Featured Image", function(){
                newDataDetail = new DataDetail({
                    app: this.app,
                    model: this.marker,
                    mode: "view"
                });
                expect(DataDetail.prototype.getFeaturedImage).toHaveBeenCalledTimes(0);
                newDataDetail.render();
                expect(DataDetail.prototype.getFeaturedImage).toHaveBeenCalledTimes(7);

            });

            it("Calls Get Featured Image with Wrong ID and returns null", function(){
                newDataDetail = new DataDetail({
                    app: this.app,
                    model: this.marker_1,
                    mode: "view"
                });
                expect(newDataDetail.getFeaturedImage()).toEqual(null);
            });


            it("Calls Get Featured Image without extras and returns null", function(){
                newDataDetail = new DataDetail({
                    app: this.app,
                    model: this.markers.at(2),
                    mode: "view"
                });
                expect(newDataDetail.getFeaturedImage()).toEqual(null);
            });


        });

        describe("Data Detail: Do Not Display", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Makes sure the fixture.$el is empty when called", function(){
                setupDataDetail(this, {
                    model: this.marker,
                    mode: "edit",
                    dataType: "markers"
                });
                newDataDetail.render();
                fixture.append(newDataDetail.$el);
                newDataDetail.doNotDisplay();
                console.log(newDataDetail.$el.html());
                expect(newDataDetail.$el.html()).toEqual("");
            });
        });

        describe("Data Detail: Model Functions", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Successfully calls saveModel", function(){
                setupDataDetail(this, {
                    model: this.marker,
                    mode: "edit",
                    dataType: "markers"
                });
                newDataDetail.render();
                fixture.append(newDataDetail.$el);
                fixture.find(".save-model").trigger('click');
                expect(DataDetail.prototype.saveModel).toHaveBeenCalledTimes(1);
            });

            it("Successfully calls deleteModel", function(){
                spyOn(this.marker, 'destroy').and.callFake(function(opts){
                    if (opts.success){
                        opts.success();
                    }
                });
                setupDataDetail(this, {
                    model: this.marker,
                    mode: "edit",
                    dataType: "markers"
                });
                newDataDetail.render();
                fixture.append(newDataDetail.$el);
                expect(this.marker.destroy).toHaveBeenCalledTimes(0);
                spyOn(window, "confirm").and.returnValue(true);
                fixture.find(".delete-model").trigger('click');
                expect(DataDetail.prototype.deleteModel).toHaveBeenCalledTimes(1);
                expect(this.marker.destroy).toHaveBeenCalledTimes(1);
                expect(this.app.vent.trigger).toHaveBeenCalledWith('hide-detail');
            });
        });

        describe("Data Detail: View Render", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Successfully calls viewRender", function() {
                setupDataDetail(this, {
                    model: this.markers.at(0),
                    mode: "view",
                    dataType: "markers"
                });
                expect(Carousel.prototype.initialize).toHaveBeenCalledTimes(0);
                expect(DataDetail.prototype.viewRender).toHaveBeenCalledTimes(0);
                newDataDetail.render();
                expect(DataDetail.prototype.viewRender).toHaveBeenCalledTimes(1);

                // only 1 carousel, combined photo/video
                expect(Carousel.prototype.initialize).toHaveBeenCalledTimes(1);
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
                //expect(fixture.find("h4").html()).toContainText("Preview");
                expect(fixture.find("h4").html().includes("Preview")).toBeTruthy();
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
                expect(fixture.find("h4").html().includes("Preview")).toBeTruthy();
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
                expect(fixture.find("h4").html().includes("Preview")).toBeTruthy();
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
                expect(fixture.find("h4").html().includes("Preview")).toBeTruthy();
                expect(fixture.html()).toContain("player-container");
                expect(fixture.html()).toContain("audio-detail");
                expect(fixture).toContainElement("audio");
                expect(fixture).toContainElement("source");
                expect(fixture.find("source").attr("src")).toEqual(this.audio_file.get("file_path"));

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
                setupDataDetail(this, {
                    model: this.markers.at(0),
                    mode: "edit",
                    dataType: "markers"
                });
                expect(DataDetail.prototype.editRender).toHaveBeenCalledTimes(0);
                newDataDetail.render();
                expect(DataDetail.prototype.editRender).toHaveBeenCalledTimes(1);
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
                expect(fixture.find("h4").html().includes("Edit")).toBeTruthy();
                expect(fixture).toContainElement("iframe");
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
                expect(fixture.find("h4").html().includes("Edit")).toBeTruthy();
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
                expect(fixture.find("button.delete-marker-button").html()).toEqual("Remove Location Marker");
                expect(fixture.find(".latlong").html()).toContain("(" + lat + ", " + lng + ")");
                expect(fixture.find("img").attr("src")).toEqual(this.photo.get("path_medium"));

                // ensure that form is rendering correctly:
                expect(fixture.find("textarea[name='name']").val()).toEqual(this.photo.get("name") || '');
                expect(fixture.find("textarea[name='caption']").val()).toEqual(this.photo.get("caption") || '');
                expect(fixture.find("textarea[name='attribution']").val()).toEqual(this.photo.get("attribution") || '');
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
                expect(fixture.find("h4").html().includes("Edit")).toBeTruthy();
                expect(fixture.html()).toContain("player-container");
                expect(fixture.html()).toContain("audio-detail");
                expect(fixture.find("button.delete-marker-button").html()).toEqual("Remove Location Marker");
                expect(fixture.find(".latlong").html()).toContain("(" + lat + ", " + lng + ")");
                expect(fixture).toContainElement("audio");
                expect(fixture).toContainElement("source");
                expect(fixture.find("source").attr("src")).toEqual(this.audio_file.get("file_path"));

                // ensure that form is rendering correctly:
                expect(fixture.find("textarea[name='name']").val()).toEqual(this.audio_file.get("name") || '');
                expect(fixture.find("textarea[name='caption']").val()).toEqual(this.audio_file.get("caption") || '');
                expect(fixture.find("textarea[name='attribution']").val()).toEqual(this.audio_file.get("attribution") || '');

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
                expect(fixture.find("h4").html().includes("Edit")).toBeTruthy();
                expect(fixture.find("button.delete-marker-button").html()).toEqual("Remove Location Marker");
                expect(fixture.find(".latlong").html()).toContain("(" + lat + ", " + lng + ")");

                // Since the schema has to be extracted,
                // How can that can be done since records have custom schemas?
                /*

                */
                var fields = this.record_test.get("fields"),
                    col_name,
                    data_type,
                    isOn,
                    i = 0;
                for (i = 0; i < fields.length; i++) {
                    col_name = fields[i].col_name;
                    data_type = fields[i].data_type;
                    switch (data_type) {
                        case "integer":
                            expect(fixture.find("input[name='" + col_name + "']").val()).toEqual(this.record_test.get(col_name).toString());
                            break;
                        case "boolean":
                            isOn = this.record_test.get(col_name) ? 'on' : 'off';
                            expect(fixture.find("input[name='" + col_name + "']").val()).toEqual(isOn);
                            break;
                        case "rating":
                        case "choice":
                            expect(fixture.find("select[name='" + col_name + "']").val()).toEqual(this.record_test.get(col_name).toString());
                            break;
                        default:
                            expect(fixture.find("textarea[name='" + col_name + "']").val()).toEqual(this.record_test.get(col_name).toString());
                    }
                }
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
                expect(fixture.find("h4").html().includes("Edit")).toBeTruthy();
                expect(fixture.find("button.delete-marker-button").html()).toEqual("Remove Location Marker");
                expect(fixture.find(".latlong").html()).toContain("(" + lat + ", " + lng + ")");

                // ensure that form is rendering correctly:
                expect(fixture.find("textarea[name='name']").val()).toEqual(this.marker.get("name") || '');
                expect(fixture.find("textarea[name='caption']").val()).toEqual(this.marker.get("caption") || '');
                expect(fixture.find("textarea[name='attribution']").val()).toEqual(this.marker.get("attribution") || '');
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

            it("Successfully calls hideMapPanel and showPanel", function(){
                // 1. initialize the dataDetail view:
                setupDataDetail(this, {
                    model: this.marker,
                    mode: "view",
                    screenType: "map"
                });
                newDataDetail.render();
                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);
                // 3. First click on the show-hide and it should hide the map panel
                expect(DataDetail.prototype.hideMapPanel).toHaveBeenCalledTimes(0);
                fixture.find(".show-hide").trigger('click');
                expect(this.app.vent.trigger).toHaveBeenCalledWith("hide-detail");
                expect(DataDetail.prototype.hideMapPanel).toHaveBeenCalledTimes(1);

                // 4. Then click on show-hide again to show the map panel
                expect(DataDetail.prototype.showMapPanel).toHaveBeenCalledTimes(0);
                fixture.find(".show-hide").trigger('click');
                expect(this.app.vent.trigger).toHaveBeenCalledWith("unhide-detail");
                expect(DataDetail.prototype.showMapPanel).toHaveBeenCalledTimes(1);

            });
        });

        describe("Data Detail: Video Functions", function(){
            beforeEach(function(){
                initSpies(this);
            });
            it("Successfully assigns provider and ID from link for Youtube", function(){
                setupDataDetail(this, {
                    model: this.videos.at(0),
                    mode: "edit",
                    dataType: "videos",
                    screenType: "map"
                });
                newDataDetail.render();
                fixture.append(newDataDetail.$el);
                // Make sure the forms are empty
                console.log(fixture);
                // Dummy test designed to fail
                // must make use of the mouseleave and input[name="video_link"]
                // to properly call the set video attributes
                var vidLink = fixture.find('input[name="video_link"]');
                var vidID = fixture.find('input[name="video_id"]');
                var vidProvider = fixture.find('select[name="video_provider"]');
                console.log(vidLink);
                console.log(vidProvider);
                console.log(vidID);
                var $vidLink = $(vidLink);
                var $vidProvider = $(vidProvider);
                var $vidID = $(vidID);
                expect($vidLink.val()).toEqual("");
                expect(newDataDetail.setVideoAttribute).toHaveBeenCalledTimes(0);

                vidLink.trigger('mouseenter');
                vidLink.trigger('click');
                // Making a test link for youtube
                $vidLink.val('https://www.youtube.com/watch?v=jNQXAC9IVRw');
                vidLink.trigger('mouseleave');
                expect(newDataDetail.setVideoAttribute).toHaveBeenCalledTimes(1);
                expect($vidProvider.val()).toEqual('youtube')
                expect($vidID.val()).toEqual('jNQXAC9IVRw')
            });
            it("Successfully assigns provider and ID from link for Vimeo", function(){
                setupDataDetail(this, {
                    model: this.videos.at(0),
                    mode: "edit",
                    dataType: "videos",
                    screenType: "map"
                });
                newDataDetail.render();
                fixture.append(newDataDetail.$el);
                // Make sure the forms are empty
                console.log(fixture);
                // Dummy test designed to fail
                // must make use of the mouseleave and input[name="video_link"]
                // to properly call the set video attributes
                var vidLink = fixture.find('input[name="video_link"]');
                var vidID = fixture.find('input[name="video_id"]');
                var vidProvider = fixture.find('select[name="video_provider"]');
                console.log(vidLink);
                console.log(vidProvider);
                console.log(vidID);
                var $vidLink = $(vidLink);
                var $vidProvider = $(vidProvider);
                var $vidID = $(vidID);
                expect($vidLink.val()).toEqual("");
                expect(newDataDetail.setVideoAttribute).toHaveBeenCalledTimes(0);

                vidLink.trigger('mouseenter');
                vidLink.trigger('click');
                // Making a test link for youtube
                $vidLink.val('https://vimeo.com/108679294');
                vidLink.trigger('mouseleave');
                expect(newDataDetail.setVideoAttribute).toHaveBeenCalledTimes(1);
                expect($vidProvider.val()).toEqual('vimeo')
                expect($vidID.val()).toEqual('108679294')
            });
        });

        describe("Data Detail: Other Trigger Events", function(){
            beforeEach(function(){
                initSpies(this);
            });

            afterEach(function () {
                $('body').find('#follower').remove();
            });

            it("successfully rotates photo both ways", function(){
                // 1. initialize the dataDetail view
                setupDataDetail(this, {
                    model: this.photos.at(0),
                    mode: "edit",
                    screenType: "map",
                    dataType: "photos"
                });
                newDataDetail.render();
                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);
                // 3. First click on the rotate photo on the right
                expect(DataDetail.prototype.rotatePhoto).toHaveBeenCalledTimes(0);
                expect(DataDetail.prototype.render).toHaveBeenCalledTimes(1);
                fixture.find(".rotate-right").trigger('click');
                expect(DataDetail.prototype.rotatePhoto).toHaveBeenCalledTimes(1);
                expect(DataDetail.prototype.render).toHaveBeenCalledTimes(2);
                // 4. First click on the rotate photo on the left
                fixture.find(".rotate-left").trigger('click');
                expect(DataDetail.prototype.rotatePhoto).toHaveBeenCalledTimes(2);
                expect(DataDetail.prototype.render).toHaveBeenCalledTimes(3);
            });

            it("Successfully deletes existing marker through deleteMarker", function(){
                // 1. initialize the dataDetail view:
                setupDataDetail(this, {
                    model: this.marker,
                    mode: "edit",
                    screenType: "map"
                });
                newDataDetail.render();

                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);

                // 3. Check that delete button is present
                expect(DataDetail.prototype.deleteMarker).toHaveBeenCalledTimes(0);
                expect(DataDetail.prototype.commitForm).toHaveBeenCalledTimes(0);
                expect(fixture.find("h4").html().includes("Edit")).toBeTruthy();
                expect(fixture.find("button.button-secondary").html()).toEqual("Remove Location Marker");
                expect(fixture.find(".latlong").html()).toContain("(" + lat + ", " + lng + ")");

                // 4. Trigger click delete button:
                fixture.find("#delete-geometry").trigger("click");

                // 5. Check that geometry no longer exists:
                expect(DataDetail.prototype.deleteMarker).toHaveBeenCalledTimes(1);
                expect(DataDetail.prototype.commitForm).toHaveBeenCalledTimes(1);
                expect(fixture.find("button.button-secondary").html()).not.toEqual("Remove Location Marker");

            });

            it("Successfully calls activateMarkerTrigger", function(){
                // 1. initialize the dataDetail view:
                setupDataDetail(this, {
                    model: this.marker,
                    mode: "edit",
                    screenType: "map"
                });
                newDataDetail.render();

                // 2. append the element to the fixture:
                fixture.append(newDataDetail.$el);

                // 3. Check that delete button is present
                expect(DataDetail.prototype.activateMarkerTrigger).toHaveBeenCalledTimes(0);
                expect(fixture.find("h4").html().includes("Edit")).toBeTruthy();
                expect(fixture.find("button.button-secondary").html()).toEqual("Remove Location Marker");
                expect(fixture.find("button.button-secondary").html()).not.toEqual("Add Location Marker");
                expect(fixture.find(".add-lat-lng").html()).not.toEqual("click on the map to add location");


                // 4. Trigger click delete button:
                fixture.find("#delete-geometry").trigger("click");

                // 5. Trigger click add geometry button:
                fixture.find("#add-geometry").trigger("click");

                $(window).trigger("mousemove"); // Needed for the inner HTML to appear

                expect(fixture.find("button.button-secondary").html()).toEqual("Add Location Marker");
                expect(fixture.find("button.button-secondary").html()).not.toEqual("Remove Location Marker");
                expect(DataDetail.prototype.activateMarkerTrigger).toHaveBeenCalledTimes(1);
                expect(fixture.find("p#drop-marker-message").html()).toEqual("click on the map to add location");

                expect($('body').find('#follower')).toContainElement('svg');

                var $svg = $('body').find('svg');
                var $path = $svg.find('path');
                var testIcon = newDataDetail.icon;



                expect($svg[0].getAttribute("viewBox")).toEqual(testIcon.viewBox);
                expect($svg.attr("width")).toEqual(testIcon.width.toString());
                expect($svg.attr("height")).toEqual(testIcon.height.toString());
                expect($path.attr("fill")).toEqual(testIcon.fillColor);
                expect($path.attr("stroke")).toEqual("#ed867d");
                expect($path.attr("stroke-width")).toEqual("6");
                expect($path.attr("stroke-opacity")).toEqual("0.5");
                expect($path.attr("d")).toEqual(testIcon.path);
                expect($path.attr("paint-order")).toEqual("stroke");

            });

        });

    });
