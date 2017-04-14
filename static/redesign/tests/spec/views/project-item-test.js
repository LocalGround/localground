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
                expect(ProjectItemView.prototype.shareModal).toHaveBeenCalledTimes(1);
            });

            it("shareModel function opens a new modal window with the right form inside", function(){
                spyOn(this.app.vent, 'trigger');
                newProjectItemView.shareModal();
                expect(this.app.vent.trigger).toHaveBeenCalledWith('share-project', { model: newProjectItemView.model });
            });

            it("delete function works", function(){
                //JOHN TODO:
                expect(1).toBe(1);
            });

            it("link to project function works", function(){
                //JOHN TODO:
                expect(1).toBe(1);
            });
        });
        
        
        describe("Project Item View: Renders Correctly", function(){

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

            it("Renders the HTML Correctly", function () {
                // Here is the documentation for the renderer helpers:
                // https://github.com/velesin/jasmine-jquery
                /*
                <div class="project-overview" data-url="/map/?project_id={{ id }}">
                    <div>
                        <h2 class="map-title">{{ name }}</h2>
                        <span class = "owner">Owner: {{ owner }}</span>
                        <p>{{ caption }}</p>
                    </div>
                    <div class = "project-detail">
                        <a class="tag">
                        {{#ifequal access_authority 1}}
                            Private
                        {{ else }}
                            Public
                        {{/ifequal}}
                        </a>
                        <!-- Replace the "5 Days ago" with the Date() function with info on current date-->
                        <!-- time_stamp -->
                        <span class="action"><i class="fa fa-clock-o" aria-hidden="true"></i> {{timeAgo}}</span>
                    </div>
                </div>
                */
                fixture = setFixtures("<div></div>").append(newProjectItemView.$el);
                //check that all elements exist in the DOM:
                expect(fixture).toContainElement('.project-overview');
                expect(fixture).toContainElement('.map-title');
                expect(fixture).toContainElement('.owner');
                expect(fixture).toContainElement('.project-detail');
                expect(fixture).toContainElement('.action');
                expect(fixture).toContainElement('.fa.fa-clock-o');
                expect(fixture).toContainElement('.tag');

                //check that values have been set correctly from variables:
                expect(fixture.find('.project-overview')).toHaveAttr('data-url', '/map/?project_id=' + newProjectItemView.model.id);
                expect(fixture.find('.project-overview')).toContainText(newProjectItemView.model.get("name"));
                //JOHN TODO:
                //1. check tag set correctly
                //2. check owner set correctly
                //3. check that time text is set correctly
            });

        });
    }
);
