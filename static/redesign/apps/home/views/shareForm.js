define(["marionette",
        "underscore",
        "handlebars",
        "text!../templates/share-form.html",
        "text!../templates/project-user-item.html"],
    function (Marionette, _, Handlebars, ItemTemplate, ProjectUserFormTemplate) {
        'use strict';
        var ShareFormView = Marionette.CompositeView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.collection = this.model.projectUsers;
                Marionette.CompositeView.prototype.initialize.call(this);
                //this.render();
                this.model.getProjectUsers();
                this.listenTo(this.collection, 'reset', this.render);
                this.listenTo(this.collection, 'destroy', this.render);
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
                    template: Handlebars.compile(ProjectUserFormTemplate),
                    tagName: "tr",
                    doDelete: function (e) {
                        var that = this;
                        if (!confirm("Are you sure you want to remove this user from the project?")) {
                            return;
                        }
                        this.model.destroy();
                        e.preventDefault();

                        // Add in code to check value of the number of users
                        // to determine if user table remians
                        // or show prompt instead

                        this.checkNumberOfRows();
                        //this.model.getProjectUsers();
                    }
                });
            },
            childViewContainer: "#userList",
            template: Handlebars.compile(ItemTemplate),
            events: {
                'click .action': 'shareModal',
                'click .save-project-settings': 'saveProjectSettings',
                'click .new_user_button': 'addUserButton'
            },
            fetchShareData: function () {
                this.model.getProjectUsers();
            },
            onRender: function () {
                //console.log("rerender");
                var modal = this.$el.find('.modal').get(0),
                    span = this.$el.find('.close').get(0);
                modal.style.display = "block";
                this.checkNumberOfRows();
                // When the user clicks on <span> (x), close the modal
                span.onclick = function () {
                    modal.style.display = "none";
                }

                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function (event) {
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
            saveProjectSettings: function () {
                // Make sure you check every single row from top to bottom
                // by starting at the first child row
                // and ending at the last child row
                //
                // Now you know how to get the collection of existing users
                // userModels = this.collection.models // returns an array
                // To get the needed attributes, do this
                // userModels[i].attributes.user and authority (1-3)
                //
                // Now to get the id of the project,
                // this.model.id
                //
                var $userList = $("#userList");
                var $users = $userList.children();

                //loop through each table row:
                for (var i = 0; i < $users.length; ++i) {
                  var $row = $($users[i]);
                    if ($row.attr("id") == this.model.id) {
                        //edit existing projectusers:
                        var username = $row.find(".username").html();
                        var authorityID = $row.find(".authority").val();
                        var existingProjectUser = this.model.getProjectUserByUsername(username);
                        existingProjectUser.set("authority", parseInt(authorityID));
                        existingProjectUser.save();

                    } else {
                        //create new projectusers:
                        var username = $row.find(".username").val();
                        var authorityID = $row.find(".authority").val();
                        this.model.shareWithUser(username, authorityID);
                    }

                }

                // Now save the project settings itself
                //
                // So far the project settings are saved
                // but a reset function is not put yet
                // so for now a manual relaod is needed
                var $projectName = $('#projectName').val();
                var $shareType = $('#share_type').val();
                var $owner = $('#owner').val();
                this.model.set('name', $projectName);
                this.model.set('access_authority', $shareType);
                this.model.set('owner', $owner);
                this.model.save();

                // Let's try refreshing the data for any changes:
                //this.collection = new Projects();

                // The individual projects update at the modal level,
                // but this does not update the infromation on the project panels
                this.collection.fetch({ reset: true });

                this.listenTo(this.collection, 'reset', this.render);

                // Let's try rendering the individual model
                // if the changes are instantly and visibly made
                // No this does not work due to no such function error
                //this.model.render();



            },

            // A test function to add in a table with information
            // the test data will not be saved upon reload
            addUserButton: function() {
                console.log("Pressed new User Link");
                var userTableDisplay = $(".userTable");
                userTableDisplay.show();// Make this visible even with 0 users
                var $newTR = $("<tr class='new-row'></tr>");
                var template = Handlebars.compile(ProjectUserFormTemplate);
                $newTR.append(template());
                this.$el.find("#userList").append($newTR);

                // Now find out how many rows are there
                // to either show user table or add user prompt
                //

                this.checkNumberOfRows();

            },

            checkNumberOfRows: function(){

              var $userList = $("#userList");
              var $addNewUser = $("#addNewUser");
              var $userTableDiv = $("#userTableDiv");
              var numOfUsers = $userList.children().length;
              //console.log("Number of Users: " + numOfUsers);

              if (numOfUsers > 0){
                $userTableDiv.show();
                $addNewUser.hide();
              } else if (numOfUsers === 0){
                $userTableDiv.hide();
                $addNewUser.show();
              }
            }
    });
    return ShareFormView;
});


/* NOTES:
 To access the child elements with access to all the parameters,
 do the following:

  var parentTag = $("tag attribute or attribute or (.class or #id" name))
  var jChildren = parentTag.children(); // You have access to an array of children

  open up the console inspector by having the following:
  console.log(jChildren);
  and now you can see all the parameters that represent the attributes
  read carefully as they have different names compared to the HTML attributes

  now you can call the attributes themselves form the children indexes

  examples:
  jChildren[i].className
  jChildren[i].id


*/
