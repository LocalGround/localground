var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/home/views/projectItemView",
    rootDir + "apps/home/views/shareForm",
    rootDir + "models/project",
    "tests/spec-helper"
],
    function ($, ProjectItemView, ShareForm, Project) {
        'use strict';
        var fixture, newCreateForm, initSpies;

        initSpies = function () {

        };

        describe("Making a project:", function(){
            it("Successfully creates a project", function(
                // Rough draft for creating a project
                expect(1).toEqual(1);
            ));
        });
    }
);
