define(["marionette",
        "underscore",
        "handlebars",
        "text!../templates/project-item.html"],
    function (Marionette, _, Handlebars, ItemTemplate) {
        'use strict';
<<<<<<< HEAD

        /*
        // Cannot make a new object inside the define since
        // one item is already being made
        var NoChildrenView = Marionette.ItemView.extend({
          template: "#addNewUser"
        });
        */

        var ProjectItemView = Marionette.CompositeView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                /*
                If the collection is empty, show empty view
                else show the collection of project users
                */
                console.log(this.model.projectUsers);
                this.collection = this.model.projectUsers;
                //console.log(this.collection);
                Marionette.CompositeView.prototype.initialize.call(this);
            },
            childViewOptions: function () {
                return this.model.toJSON();
            },
            //emptyView: NoChildrenView, // Does this work? NO IT DOES NOT.
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
            //emptyView: '#addNewUser',
=======
        var ProjectItemView = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                Marionette.CompositeView.prototype.initialize.call(this);
            },
>>>>>>> origin/redesign-john-edited
            template: Handlebars.compile(ItemTemplate),
            events: {
                'click .action': 'shareModal',
                'click #delete_project': 'deleteProject'
            },
            shareModal: function () {
                //tell the home-app to show the share-project modal:
                this.app.vent.trigger('share-project', { model: this.model });
            },
            templateHelpers: function () {
                return {
                    projectUsers: this.model.projectUsers.toJSON()
                };
            },
<<<<<<< HEAD
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
=======
            deleteProject: function () {
                if (!confirm("Are you sure you want to delete this project?")) {
                    return;
                }
                this.model.destroy();
>>>>>>> origin/redesign-john-edited
            }
        });
        return ProjectItemView;
    });
