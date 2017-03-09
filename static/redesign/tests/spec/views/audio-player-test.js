var rootDir = "../../";
define([
    rootDir + "lib/audio/audio-player",
    "tests/spec-helper"
],
    function (AudioPlayer) {
        'use strict';
        var audioPlayer,
            init = function (that) {
                // add spies for all relevant objects and initialize dataManager:
                spyOn(AudioPlayer.prototype, 'initialize').and.callThrough();
                spyOn(AudioPlayer.prototype, 'onRender').and.callThrough();
                spyOn(window, 'setTimeout');
                audioPlayer = new AudioPlayer({
                    app: that.app,
                    projectID: that.projects.models[0].id,
                    model: that.audioFiles.models[0],
                    audioMode: "detail" //basic, simple, or detail
                });
            };

        describe("Audio Player: Initialization Tests", function () {
            beforeEach(function () {
                init(this);
            });

            it("Initialization methods called successfully w/o model", function () {
                expect(audioPlayer).toEqual(jasmine.any(AudioPlayer));
            });

            it("Initialization methods calls render", function () {
                expect(audioPlayer.initialize).toHaveBeenCalled();
                expect(audioPlayer.onRender).toHaveBeenCalled();
                expect(window.setTimeout).toHaveBeenCalled();
            });
        });

        describe("Audio Player: Method Tests", function () {
            beforeEach(function () {
                init(this);
            });
        });
    });
