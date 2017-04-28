var rootDir = "../../";
define([
    rootDir + "lib/audio/audio-player",
    "tests/spec-helper"
],
    function (AudioPlayer) {
        'use strict';
        var fixture,
            audioPlayer,
            initPlayer = function (that, mode) {
                audioPlayer = new AudioPlayer({
                    app: that.app,
                    projectID: that.projects.models[0].id,
                    model: that.audioFiles.models[0],
                    audioMode: mode //basic, simple, or detail
                });
            },
            initSpies = function () {
                spyOn(AudioPlayer.prototype, 'initialize').and.callThrough();
                spyOn(AudioPlayer.prototype, 'render').and.callThrough();
                spyOn(AudioPlayer.prototype, 'onRender').and.callThrough();
                spyOn(AudioPlayer.prototype, 'togglePlay').and.callThrough();
                spyOn(AudioPlayer.prototype, 'jumpToTime').and.callThrough();
                spyOn(AudioPlayer.prototype, 'showPlayButton').and.callThrough();
                spyOn(AudioPlayer.prototype, 'showPauseButton').and.callThrough();
                spyOn(window, 'setTimeout').and.callThrough();
                spyOn(AudioPlayer.prototype, 'initDraggable');
            }, 
            dragTest = function () {
                var event = jQuery.Event( "click", {
                    pageX: 300,
                    pageY: 300
                });
                expect(audioPlayer.jumpToTime).toHaveBeenCalledTimes(0);
                fixture.find('.progress-container').trigger(event);
                expect(audioPlayer.jumpToTime).toHaveBeenCalledTimes(1);
            };

        describe("Audio Player: Basic Initialization Tests", function () {
            beforeEach(function () {
                initSpies(); 
               
            });

            it("Initialization methods called successfully", function () {
                expect(AudioPlayer.prototype.initialize).toHaveBeenCalledTimes(0);
                expect(AudioPlayer.prototype.render).toHaveBeenCalledTimes(0);
                initPlayer(this, "basic");
                expect(audioPlayer).toEqual(jasmine.any(AudioPlayer));
                expect(AudioPlayer.prototype.initialize).toHaveBeenCalledTimes(1);
                expect(AudioPlayer.prototype.render).toHaveBeenCalledTimes(1);
            });

            it("Sets initial properties from opts", function () {
                initPlayer(this, "basic");
                expect(audioPlayer.app).toEqual(this.app);
                expect(audioPlayer.projectID).toEqual(this.projects.models[0].id);
                expect(audioPlayer.model).toEqual(this.audioFiles.models[0]);
                expect(audioPlayer.audioMode).toEqual("basic");
            });
        });

        describe("Audio Player: Basic HTML Tests", function () {
            beforeEach(function () {
                initSpies();
                initPlayer(this, "basic");
                fixture = setFixtures('<div></div>').append(audioPlayer.$el);
            });

            it("Initialization methods called successfully", function () {
                expect(fixture).toContainElement("audio");
                expect(fixture).toContainElement(".play-ctrls");
                expect(fixture).toContainElement(".play");
                expect(fixture.find('source')).toHaveAttr('src', audioPlayer.model.get("file_path"));
            });

            it("Listens for the play / pause click event", function () {
                expect(audioPlayer.togglePlay).toHaveBeenCalledTimes(0);
                expect(audioPlayer.showPlayButton).toHaveBeenCalledTimes(0);
                expect(audioPlayer.showPauseButton).toHaveBeenCalledTimes(0);
                fixture.find('.play').trigger('click');
                expect(audioPlayer.togglePlay).toHaveBeenCalledTimes(1);
                expect(audioPlayer.showPauseButton).toHaveBeenCalledTimes(1);
                expect(fixture).toContainElement(".pause");
                expect(audioPlayer.showPlayButton).not.toHaveBeenCalled();
                fixture.find('.pause').trigger('click');
                expect(fixture).not.toContainElement(".pause");
                expect(audioPlayer.showPlayButton).toHaveBeenCalledTimes(1);
            });

        });

        describe("Audio Player: Testing Simple Mode", function () {
            beforeEach(function(done) {
                initSpies();
                initPlayer(this, "simple");
                loadStyleFixtures('../../../../css/main.css');
                setTimeout(function () { done(); }, 100);
                fixture = setFixtures('<div></div>').append(audioPlayer.$el);
            });

            it("Drag function works", dragTest);
            
            it("Is in the correct mode", function () {
                expect(audioPlayer.audioMode).toEqual("simple");
            });

            it("Has correct html", function () {
                expect(fixture).toContainElement("audio");
                expect(fixture).toContainElement("source");
                
                var actual = fixture.find("source").attr("src");
                var expected = audioPlayer.model.get("file_path");
                expect(expected).toEqual(actual);
                expect(fixture).toContainElement(".audio-progress-circle");
            });

            it("Listens for the play / pause click event", function () {
                expect(audioPlayer.togglePlay).toHaveBeenCalledTimes(0);
                fixture.find('.play').trigger('click');
                expect(audioPlayer.togglePlay).toHaveBeenCalledTimes(1);
                
                

            });
        });
    });