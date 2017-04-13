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
        var fixture, newProjectItemView, newShareForm, initSpies;

        initSpies = function () {
            // Project Item View
            spyOn(ProjectItemView.prototype, 'render').and.callThrough();

        };

        describe("Project Item View - Making a project:", function(){
            it("Successfully creates a project", function(){
                // Rough draft for creating a project
                var newProject = new Project();

                expect (newProject).not.toEqual(null);
            });

            it("Successfully creates a project item view", function(){

                expect (newProjectItemView).toEqual(undefined);
                newProjectItemView = new ProjectItemView({
                    model: this.projects.at(0)
                });
                console.log(newProjectItemView.model);
                expect (newProjectItemView).not.toEqual(undefined);
            });
        });

        describe("Project: Inspecting attributes", function(){

        });
    }
);
