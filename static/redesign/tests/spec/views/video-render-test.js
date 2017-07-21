var rootDir = "../../";
define([
    "jquery",
    rootDir + "models/video",
    "tests/spec-helper"
],
    function ($, Video) {
        'use strict';
        var fixture,
            initSpies;

        initSpies = function () {

        };

        describe("Test Stub", function(){
            beforeEach(function() {
                initSpies();
            });

            it("Tests for failure", function(){
                expect(1).toEqual(-1);
            });
        });

    });
