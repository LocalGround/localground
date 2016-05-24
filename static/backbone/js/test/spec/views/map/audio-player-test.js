/**
 * Created by zmmachar on 2/18/15.
 */
/**
 * Created by zmmachar on 2/18/15.
 */
define(["underscore",
        "lib/maps/controls/audioPlayer",
        "../../../../test/spec-helper"],
    function (_, AudioPlayer) {
        'use strict';
        var audioPlayer, that;
        var container = 'map-canvas';

        describe("Audio Player: Test that it initializes correctly", function () {

            it("Loads correctly", function () {
                that = this;
                expect(function () {
                    audioPlayer = new AudioPlayer({
                        container: container,
                        app: that.app
                    });
                }).not.toThrow();
            });

        });

        describe("Audio Player: Test that it renders when called", function () {


            it("Starts player when told", function () {

                spyOn(AudioPlayer.prototype, 'playAudio').and.callThrough();

                audioPlayer = new AudioPlayer({
                    container: container,
                    app: that.app
                });

                this.app.vent.trigger('playAudio');

                expect(audioPlayer.playAudio).toHaveBeenCalled();
            });

            it('Stops the player when told', function () {

                spyOn(AudioPlayer.prototype, 'stopAudio').and.callThrough();

                audioPlayer = new AudioPlayer({
                    container: container,
                    app: that.app
                });

                this.app.vent.trigger('stopAudio');

                expect(audioPlayer.stopAudio).toHaveBeenCalled();
            });
        });


    });