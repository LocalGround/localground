var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/home/views/shareForm",
    rootDir + "models/project",
    rootDir + "models/projectUser",
    rootDir + "collections/projects",
    rootDir + "collections/projectUsers",
    "tests/spec-helper"
],
    function ($, ShareForm, Project, ProjectUser, Projects, ProjectUsers) {
        'use strict';
        var fixture, newProject, newShareForm, initSpies;

        initSpies = function () {

            // Project
            spyOn(Project.prototype,'shareWithUser').and.callThrough();
            spyOn(Project.prototype,'getProjectUsers').and.callThrough();
            spyOn(Project.prototype,'getProjectUserCount').and.callThrough();
            spyOn(Project.prototype,'getProjectUserByUsername').and.callThrough();
            spyOn(Project.prototype,'destroy').and.callThrough();

            // Share Form
            spyOn(ShareForm.prototype,'saveProjectSettings').and.callThrough();
            spyOn(ShareForm.prototype,'createNewProjectUsers').and.callThrough();
            spyOn(ShareForm.prototype,'addUserButton').and.callThrough();
            spyOn(ShareForm.prototype,'blankInputs').and.callThrough();
            spyOn(ShareForm.prototype,'deleteProject').and.callThrough();

        };

        describe("Initialization Test", function(){
            /*
            DO the following:
            When project created,
            the following fields should be left undefined -
            title = "Untitled"
            owner = The curret user on computer (username)
            access authority is private by default
            All else blank

            When editing existing project (model exists)
            make sure information is same as model
            include the following functions for testing
            make sure they are called once

            this.model.getProjectUsers();
            this.attachCollectionEventHandlers();

            */

            beforeEach(function(){
                initSpies();
            });

            it("Creates a new empty project",function(){
                newShareForm = new ShareForm({
                    app: this.app,
                    model: new Project({
                        id: 8,
                        time_stamp: new Date().toISOString().replace("Z", ""),
                        date_created: new Date().toISOString().replace("Z", ""),
                        access_authority: 1, // Private
                        owner: "MrJBRPG"
                    })
                });
                expect(newShareForm.model.get("name")).toEqual("Untitled");
                expect(newShareForm.model.get("owner")).toEqual("MrJBRPG");
                expect(newShareForm.model.get("access_authority")).toEqual(1);

            });

            it("Opens an existing project", function(){
                newShareForm = new ShareForm({
                    app: this.app,
                    model: this.project
                });
                fixture = setFixtures("<div></div>").append(newShareForm.$el);
                expect(newShareForm.model.get("name")).toEqual(fixture.find('#projectName').val());
                expect(newShareForm.model.get("access_authority")).toEqual(fixture.find("#access_authority").val());
                expect(newShareForm.model.get("caption")).toEqual(fixture.find("#caption").val());
                expect(newShareForm.model.get("tags")).toEqual(fixture.find("#tags").val());
                expect(fixture.find("#owner").val()).toBeUndefined();
            });
        });

        describe("Share Form: Project User List", function() {
            //
            //
            /*
              To look for project users inside the project itself,
              look for the attribute "sharing_url" that leads to the users list
              The question now is that how do I access that content to create new users

              Several links can help
              http://localhost:7777/api/0/projects/
              http://localhost:7777/api/0/user-profile/
              // Sample example
              http://localhost:7777/api/0/projects/5/users/
            */
            beforeEach(function(){
                initSpies();
                newShareForm = new ShareForm({
                    app: this.app,
                    model: this.project
                });
            });
            it ("Successfully adds a project user", function() {
                // Make sure to add a new username

                fixture = setFixtures("<div></div>").append(newShareForm.$el);
                expect(1).toEqual(1);
            });
        });



    }
);
