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
                expect(1).toEqual(1);
            });


            it ("Successfully removes a project user", function() {
                // Delete an existing username
                expect(1).toEqual(1);
            });
        });



    }
);
