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
                //spyOn(AudioPlayer.prototype, 'initialize').and.callThrough();
                audioPlayer = new AudioPlayer({
                    app: that.app.vent,
                    projectID: that.projects.models[0].id,
                    model: that.audioFiles.models[0]
                });
            };

        describe("Audio Player: Initialization Tests", function () {
            beforeEach(function () {
                init(this);
            });

            it("Initialization methods called successfully w/o model", function () {
                expect(audioPlayer).toEqual(jasmine.any(AudioPlayer));
            });
        });

        describe("Audio Player: Method Tests", function () {
            beforeEach(function () {
                init(this);
            });
        });
    });
