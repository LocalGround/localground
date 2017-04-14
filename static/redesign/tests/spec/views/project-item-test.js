var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/home/views/projectItemView",
    rootDir + "apps/home/views/shareForm",
    rootDir + "models/project",
    rootDir + "models/projectUser",
    rootDir + "collections/projects",
    rootDir + "collections/projectUsers",
    "tests/spec-helper"
],
    function ($, ProjectItemView, ShareForm, Project, ProjectUser, Projects, ProjectUsers) {
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
                        time_stamp: new Date().toISOString().replace("Z", ""),
                        date_created: new Date().toISOString().replace("Z", "")
                    })
                });
            });

            it ("Last edited on new project: Today", function(){

                var lastEditedString = newProjectItemView.lastEdited();
                expect(lastEditedString).toEqual("Today");

            });

            it ("Last edited on new project: 1 day ago", function(){
                console.log(newProjectItemView.timeStamp);
                var prevDay = newProjectItemView.timeStamp.getDate() - 1;
                newProjectItemView.timeStamp.setDate(prevDay);
                var lastEditedString = newProjectItemView.lastEdited();
                expect(lastEditedString).toEqual("1 Day ago");

            });

            it ("Last edited on new project: 1 month ago", function(){
                var prevMonth = newProjectItemView.timeStamp.getMonth() - 1;
                newProjectItemView.timeStamp.setMonth(prevMonth);
                var lastEditedString = newProjectItemView.lastEdited();
                expect(lastEditedString).toEqual("1 Month ago");

            });

            it ("Last edited on new project: 1 year ago", function(){
                var prevYear = newProjectItemView.timeStamp.getFullYear() - 1;
                newProjectItemView.timeStamp.setFullYear(prevYear);
                var lastEditedString = newProjectItemView.lastEdited();
                expect(lastEditedString).toEqual("1 Year ago");

            });
        });

        describe("Project Item View: Project Modal Window", function(){

            beforeEach(function(){
                initSpies();

            });

            it("Opens a new project modal", function(){
                expect(1).toEqual(1);
                // Make a new shareForm, the one that holds the modal for projects
                // then create a new empty Project
                // Add that shareForm to the empty div space for access to buttons
            });

            it("Opens an edit project modal", function(){
                expect(1).toEqual(1);
            });

        });
    }
);
