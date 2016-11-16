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
                    }
                });
            },
            childViewContainer: "#userList",
            template: Handlebars.compile(ItemTemplate),
            events: {
                'click .action': 'shareModal',
                'click .confirm-user-add': 'confirmAddUser',
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
                var userTableDisplay = $(".userTable");
                userTableDisplay.show();// Make this visible even with 0 users
                var $newTR = $("<tr class='new-row'></tr>");
                var template = Handlebars.compile(ProjectUserFormTemplate);
                $newTR.append(template());
                this.$el.find("#userList").append($newTR);
            }
        });
        return ShareFormView;
    });
