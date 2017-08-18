var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/home/views/projectUserView",
    rootDir + "models/projectUser",
    rootDir + "collections/projectUsers",
    "tests/spec-helper"
],
    function ($, ProjectUserView, ProjectUser, ProjectUsers) {
        'use strict';
        var fixture, newProjectUserView, newProject, newShareForm, initSpies;

        initSpies = function () {

            spyOn(ProjectUserView.prototype,'doDelete').and.callThrough();

            spyOn(ProjectUser.prototype,'destroy').and.callThrough();

        };

        describe("New Project User", function(){
            beforeEach(function(){
                initSpies();
                newProjectUserView = new ProjectUserView({
                    app: this.app,
                    model: this.projectUser
                });
                newProjectUserView.render();
            });

            it("Has the correct information obtained", function(){
                //
                fixture = setFixtures("<div></div>").append(newProjectUserView.$el);

                expect(newProjectUserView.model.get("user")).toEqual(fixture.find('.username').html());
                expect(newProjectUserView.model.get("authority")).toEqual(fixture.find('.authority').val());
            });
        });

        describe("Project User Functions", function() {

            beforeEach(function(){
                initSpies();
                newProjectUserView = new ProjectUserView({
                    app: this.app,
                    model: this.projectUser
                });
                newProjectUserView.render();
            });


            it ("Successfully removes a project user", function() {
                // Delete an existing username

                spyOn(window, 'confirm').and.returnValue(true);

                fixture = setFixtures("<div></div>").append(newProjectUserView.$el);

                expect(ProjectUserView.prototype.doDelete).toHaveBeenCalledTimes(0)
                newProjectUserView.$el.find('.delete-project-user').trigger('click');
                expect(ProjectUserView.prototype.doDelete).toHaveBeenCalledTimes(1);
                expect(ProjectUser.prototype.destroy).toHaveBeenCalledTimes(1);

            });
        });



    }
);
