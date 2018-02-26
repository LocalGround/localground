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
            spyOn(ProjectItemView.prototype, 'shareModal').and.callThrough();
            spyOn(ProjectItemView.prototype, 'deleteProjectView').and.callThrough();
            spyOn(ProjectItemView.prototype, 'lastEdited').and.callThrough();

            // Project
            spyOn(Project.prototype,'shareWithUser').and.callThrough();
            spyOn(Project.prototype,'getProjectUsers').and.callThrough();
            spyOn(Project.prototype,'getProjectUserCount').and.callThrough();
            spyOn(Project.prototype,'getProjectUserByUsername').and.callThrough();
            spyOn(Project.prototype,'destroy').and.callThrough();

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
                var prevDay = newProjectItemView.timeStamp.getDate() - 1;
                newProjectItemView.timeStamp.setDate(prevDay);
                var lastEditedString = newProjectItemView.lastEdited();
                expect(lastEditedString).toEqual("1 Day ago");

            });

            it ("Last edited on new project: 1 month ago", function(){
                var prevMonth = (newProjectItemView.timeStamp.getMonth() - 1) % 12;
                // In case the current month is January, also set back one full year
                if (prevMonth < 0){
                    prevMonth += 12;
                    newProjectItemView.timeStamp.setFullYear(
                        newProjectItemView.timeStamp.getFullYear() - 1);
                }
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

        describe("Project Item View: Helper Functions Working Correctly", function(){

            beforeEach(function(){
                initSpies();
                newProjectItemView = new ProjectItemView({
                    model: new Project({
                        id: 8,
                        time_stamp: new Date().toISOString().replace("Z", ""),
                        date_created: new Date().toISOString().replace("Z", "")
                    }),
                    app: this.app
                });
                newProjectItemView.render();
            });

            it("Calls shareModal function when user clicks the share button", function () {
                fixture = setFixtures("<div></div>").append(newProjectItemView.$el);
                expect(ProjectItemView.prototype.shareModal).toHaveBeenCalledTimes(0);
                newProjectItemView.$el.find('.action').trigger('click');
                expect(ProjectItemView.prototype.shareModal).toHaveBeenCalledTimes(2);
            });

            it("shareModal function opens a new modal window with the right form inside", function(){
                spyOn(this.app.vent, 'trigger');
                newProjectItemView.shareModal();
                expect(this.app.vent.trigger).toHaveBeenCalledWith('share-project', { model: newProjectItemView.model });
            });

            it("delete function works", function(){

                spyOn(window, 'confirm').and.returnValue(true);

                fixture = setFixtures("<div></div>").append(newProjectItemView.$el);
                expect(ProjectItemView.prototype.shareModal).toHaveBeenCalledTimes(0);
                newProjectItemView.$el.find('.action').trigger('click');
                expect(ProjectItemView.prototype.shareModal).toHaveBeenCalledTimes(2);
                expect(ProjectItemView.prototype.deleteProjectView).toHaveBeenCalledTimes(0);
                newProjectItemView.deleteProjectView();
                expect(ProjectItemView.prototype.deleteProjectView).toHaveBeenCalledTimes(1);
                expect(Project.prototype.destroy).toHaveBeenCalledTimes(1);
            });

        });

        describe("Project Item View: Renders Correctly", function(){

            beforeEach(function(){
                initSpies();
                newProjectItemView = new ProjectItemView({
                    model: new Project({
                        id: 8,
                        time_stamp: new Date().toISOString().replace("Z", ""),
                        date_created: new Date().toISOString().replace("Z", ""),
                        access_authority: 1, // Private
                        owner: "MrJBRPG"
                    }),
                    app: this.app
                });
                newProjectItemView.render();
            });

            it("Renders the HTML Correctly", function () {
                // Here is the documentation for the renderer helpers:
                // https://github.com/velesin/jasmine-jquery

                fixture = setFixtures("<div></div>").append(newProjectItemView.$el);
                //check that all elements exist in the DOM:
                expect(fixture).toContainElement('.project-overview');
                // Fix the render test
                expect(fixture).toContainElement('.map-title');
                expect(fixture).toContainElement('.owner');
                expect(fixture).toContainElement('.project-detail');
                expect(fixture).toContainElement('.action');
                expect(fixture).toContainElement('.fa.fa-clock-o');
                expect(fixture).toContainElement('.tag');

                //check that values have been set correctly from variables:
                expect(fixture.find('a')).toHaveAttr('href', '/data/' + newProjectItemView.model.id + '/#/map');
                expect(fixture.find('.project-overview')).toContainText(newProjectItemView.model.get("name"));
                expect(fixture.find('.tag')).toContainText("Private");
                expect(fixture.find('.owner')).toContainText("Owner: " + newProjectItemView.model.get("owner"));
                var lastEditedString = newProjectItemView.lastEdited();
                expect(fixture.find('.time-stamp')).toContainText(lastEditedString);
            });

        });
    }
);
