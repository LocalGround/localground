define(["marionette",
        "underscore",
        "handlebars",
        "text!../templates/project-item.html",
        "text!../templates/project-user-item.html"],
    function (Marionette, _, Handlebars, ItemTemplate, ProjectUserItemTemplate) {
        'use strict';
        var ProjectItemView = Marionette.CompositeView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.collection = this.model.projectUsers;
                Marionette.CompositeView.prototype.initialize.call(this);
            },
            childViewOptions: function () {
                return this.model.toJSON();
            },
            getChildView: function () {
                // this child view is responsible for displaying
                // and deleting ProjectUser models:
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                    },
                    events: {
                        'click .delete-project-user': 'doDelete'
                    },
                    template: Handlebars.compile(ProjectUserItemTemplate),
                    tagName: "tr",
                    doDelete: function (e) {
                        /*if (!confirm("Are you sure you want to remove this user from the project?")) {
                            return;
                        }*/
                        this.model.destroy();
                        e.preventDefault();
                    }
                });
            },
            childViewContainer: "#userList",
            template: Handlebars.compile(ItemTemplate),
            // this parent view is responsible for creating
            events: {
                'click .action': 'shareModal',
                'click .confirm-user-add': 'confirmAddUser',
                'click #delete_project': 'deleteProject',
                'click .new_user_button': 'addUserButton'
                //'click .delete_user': 'deleteUserRow'
            },
            fetchShareData: function () {
                this.model.getProjectUsers();
            },
            shareModal: function () {
                this.model.getProjectUsers();
                var modal = this.$el.find('.modal').get(0);
                var span = this.$el.find('.close').get(0);
                modal.style.display = "block";
                // When the user clicks on <span> (x), close the modal
                span.onclick = function () {
                    modal.style.display = "none";
                }

                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function(event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }
            },
            templateHelpers: function () {
                return {
                    projectUsers: this.model.projectUsers.toJSON()
                };
            },
            confirmAddUser: function () {
                var $newRow = this.$el.find(".new-row");
                var username = $newRow.find(".username").val();
                var authorityID = $newRow.find(".authority").val();
                this.model.shareWithUser(username, authorityID);
                //show success message or error message below
            },

            // A test function to add in a table with information
            // the test data will not be saved upon reload
            addUserButton: function() {
                console.log("Pressed new User Link");
                //
                // To successfully insert a row of user data,
                // that row must be placed above "#addUserRow"
                // that is under its parent "#userList"
                //
                // The following jQuery functions should be useful:
                //
                // $(target).before(contentToInsert);
                // $(contentToInsert).insertBefore(target);
                var $newTR = $("<tr class='new-row'></tr>");
                var template = Handlebars.compile(ProjectUserItemTemplate);
                $newTR.append(template());
                this.$el.find("#userList").append($newTR);
              /*var $addUserRow = $("#newUserRow");
              var $newTR = $("<tr></tr>");
              var userTD = $("<td>USER</td>");
              var accessTD = $("<td>ACCESS</td>");
              var deleteTD = $("<td></td>");
              var deleteLink = $("<a>&times;</a>")
              deleteLink.attr('class','delete_user');
              deleteTD.append(deleteLink);
              // Test if adding this row works
              $newTR.append(userTD, accessTD, deleteTD);
              $newTR.insertBefore($addUserRow);

              var that = this;
              var projectModel = that.model;
              console.log(projectModel);
              console.log(projectModel.collection);*/

              // This one also does not work
              // console.log(projectModel.getProjectUserCollection());
              // It cannot be getProjectUserModel
              // since it does not return anything useful
              /*
              console.log(projectModel.getProjectUserModel());
              console.log(projectModel.getProjectUserModel().collection);
              */

              // this one returns unnecessary information
              // console.log(projectModel.fetch());
              //var numberOfUsers = Project.getProjectUserCount();
              //console.log("Number of shared users: " + numberOfUsers);

              //
              //
              //
              //
            },

            /*deleteUserRow: function(){
              console.log("Pressed Delete Button");
              console.log($(".delete_user"));
              console.log($(".delete_user").parent());
              console.log($(".delete_user").parent().parent());
              var $parentRow = $(".delete_user").parent("td").parent("tr");
              $parentRow.remove();

              //var numberOfUsers = Project.getProjectUserCount();
              //console.log("Number of shared users: " + numberOfUsers);
            },*/

            deleteProject: function(){
                if (!confirm("Are you sure you want to delete this project?"))
                {
                  return;
                }
                var that = this;
                //console.log(that);
  
                // Destroy the target model
                // and update display without deleted project
                var model = that.model;
                model.destroy();
            }
        });
        return ProjectItemView;
    });