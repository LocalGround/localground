var rootDir = "../../";
define([
    rootDir + "lib/audio/audio-player",
    "tests/spec-helper"
],
    function (AudioPlayer) {
        'use strict';
        var audioPlayer,
            fixture,
            initSpies = function () {
                spyOn(AudioPlayer.prototype, 'initialize').and.callThrough();
                spyOn(AudioPlayer.prototype, 'onRender').and.callThrough();
                spyOn(AudioPlayer.prototype, 'togglePlay').and.callThrough();
                spyOn(AudioPlayer.prototype, 'showPlayButton').and.callThrough();
                spyOn(AudioPlayer.prototype, 'showPauseButton').and.callThrough();
                spyOn(window, 'setTimeout').and.callThrough();
                spyOn(AudioPlayer.prototype, 'initDraggable');
            },
            initPlayer = function (that, mode) {
                audioPlayer = new AudioPlayer({
                    app: that.app,
                    projectID: that.projects.models[0].id,
                    model: that.audioFiles.models[0],
                    audioMode: mode //basic, simple, or detail
                });
            },
            genericTests = {
                initializesCorrectly: function (done) {
                    expect(audioPlayer.initDraggable).not.toHaveBeenCalled();
                    expect(audioPlayer).toEqual(jasmine.any(AudioPlayer));
                    expect(audioPlayer.initialize).toHaveBeenCalled();
                    expect(audioPlayer.onRender).toHaveBeenCalled();
                    expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 50);
                    setTimeout(function () {
                        expect(audioPlayer.initDraggable).toHaveBeenCalled();
                        done();
                    }, 51);
                },
                listensForPlayPauseClickEvents: function () {
                    expect(audioPlayer.togglePlay).not.toHaveBeenCalled();
                    expect(audioPlayer.showPlayButton).not.toHaveBeenCalled();
                    expect(audioPlayer.showPauseButton).not.toHaveBeenCalled();
                    fixture = setFixtures('<div></div>').append(audioPlayer.$el);
                    fixture.find('.play').trigger('click');
                    expect(audioPlayer.togglePlay).toHaveBeenCalledTimes(1);
                    expect(audioPlayer.showPlayButton).not.toHaveBeenCalled();
                    expect(audioPlayer.showPauseButton).toHaveBeenCalledTimes(1);
                    fixture.find('.play').trigger('click');
                    expect(audioPlayer.togglePlay).toHaveBeenCalledTimes(2);
                    expect(audioPlayer.showPlayButton).toHaveBeenCalledTimes(1);
                    expect(audioPlayer.showPauseButton).toHaveBeenCalledTimes(1);
                }
            };

        describe("Audio Player: Basic Tests", function () {
            beforeEach(function (done) {
                initSpies();
                initPlayer(this, "basic");
                loadStyleFixtures('../../../../css/audio-player.css');
                setTimeout(function () { done(); }, 10);
            });

            it("Initialization methods called successfully", function () {
                expect(audioPlayer).toEqual(jasmine.any(AudioPlayer));
                expect(audioPlayer.initialize).toHaveBeenCalled();
                expect(audioPlayer.onRender).toHaveBeenCalled();
            });

            it("Renders HTML successfully", function () {
                /*
                 * Documentation: https://github.com/velesin/jasmine-jquery
                 * NOTE: this setTimeout + done function is needed to give the 
                 * CSS a little extra time to load, since it's asynchronous
                 */
                fixture = setFixtures('<div></div>').append(audioPlayer.$el);
                expect(fixture).toContainElement("audio");
                expect(fixture).toContainElement(".play-ctrls");
                expect(fixture).toContainElement(".play");
                expect(fixture.find('source')).toHaveAttr('src', audioPlayer.model.get("file_path"));
                expect(fixture.find('.play').css('border-width')).toBe('15px 0px 15px 30px');
                expect(fixture.find('.play').css('border-color')).toBe('rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgb(104, 104, 104)');
            });

            it("Listens for play / pause click events", genericTests.listensForPlayPauseClickEvents);
        });

        describe("Audio Player: Simple Tests", function () {
            beforeEach(function () {
                initSpies();
                initPlayer(this, "simple");
            });

            it("Initialization methods called successfully", genericTests.initializesCorrectly);

            it("Listens for play / pause click events", genericTests.listensForPlayPauseClickEvents);
        });

        describe("Audio Player: Detail Tests", function () {
            beforeEach(function () {
                initSpies();
                initPlayer(this, "detail");
            });

            it("Initialization methods called successfully", genericTests.initializesCorrectly);

            it("Listens for play / pause click events", genericTests.listensForPlayPauseClickEvents);
        });
    });
