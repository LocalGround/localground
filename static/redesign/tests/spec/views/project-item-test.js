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
        var fixture, newProjectItemView, newProject, newShareForm, initSpies;

        initSpies = function () {
            // Project Item View
            spyOn(ProjectItemView.prototype, 'render').and.callThrough();
            spyOn(ProjectItemView.prototype, 'linkToProject').and.callThrough();
            spyOn(ProjectItemView.prototype, 'shareModal').and.callThrough();
            spyOn(ProjectItemView.prototype, 'deleteProject').and.callThrough();
            spyOn(ProjectItemView.prototype, 'lastEdited').and.callThrough();

            // Project
            spyOn(Project.prototype,'shareWithUser').and.callThrough();
            spyOn(Project.prototype,'getProjectUsers').and.callThrough();
            spyOn(Project.prototype,'getProjectUserCount').and.callThrough();
            spyOn(Project.prototype,'getProjectUserByUsername').and.callThrough();

            // Share Form
            spyOn(ShareForm.prototype,'saveProjectSettings').and.callThrough();
            spyOn(ShareForm.prototype,'createNewProjectUsers').and.callThrough();
            spyOn(ShareForm.prototype,'addUserButton').and.callThrough();
            spyOn(ShareForm.prototype,'blankInputs').and.callThrough();
            spyOn(ShareForm.prototype,'deleteProject').and.callThrough();

        };

        describe("Project Item View - Making a project:", function(){
            it("Successfully creates a project", function(){
                // Rough draft for creating a project
                newProject = new Project();

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

        describe("Project Item View - Test the time difference since last edited", function(){
            beforeEach(function(){
                initSpies();
                newProjectItemView = new ProjectItemView({
                    model: new Project({
                        id: 8,
                        time_stamp: new Date(),
                        date_created: new Date()
                    })
                });
            });

            it ("Last edited on new project: Today", function(){

                var lastEditedString = newProjectItemView.lastEdited();
                expect(lastEditedString).toEqual("Today");

            });

            it ("Last edited on new project: 1 day ago", function(){
                var prevDay = newProjectItemView.timeStamp.getDate() - 1;
                newProjectItemView.setTimeStamp(prevDay);
                var lastEditedString = newProjectItemView.lastEdited();
                expect(lastEditedString).toEqual("1 Day ago");

            });

            it ("Last edited on new project: 1 month ago", function(){
                var prevMonth = newProjectItemView.timeStamp.getMonth() - 1;
                newProjectItemView.setTimeStamp(prevMonth);
                var lastEditedString = newProjectItemView.lastEdited();
                expect(lastEditedString).toEqual("1 Month ago");

            });

            it ("Last edited on new project: 1 year ago", function(){
                var prevYear = newProjectItemView.timeStamp.getYear() - 1;
                newProjectItemView.setTimeStamp();
                var lastEditedString = newProjectItemView.lastEdited();
                expect(lastEditedString).toEqual("1 Year ago");

            });
        });
    }
);
