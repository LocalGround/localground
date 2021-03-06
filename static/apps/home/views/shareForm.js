define(["jquery",
        "marionette",
        "underscore",
        "handlebars",
        "text!../templates/share-form.html",
        "text!../templates/project-user-item.html",
        "models/project",
        "collections/projectUsers",
        "apps/home/views/projectUserView",
        "jquery.ui"],
    function ($, Marionette, _, Handlebars, ItemTemplate, ProjectUserFormTemplate,
              Project, ProjectUsers, ProjectUserView) {
        'use strict';
        var ShareFormView = Marionette.CompositeView.extend({
            childViewContainer: "#userList",
            template: Handlebars.compile(ItemTemplate),
            events: {
                'click .new_user_button': 'addUserButton',
                'click .delete-project-user': 'removeRow' //,
                //'blur #projectName': 'generateSlug'
            },

            //slugError: null,

            initialize: function (opts) {
                _.extend(this, opts);
                if (this.model == undefined) {
                    // Create a blank project if new project made
                    this.model = new Project();
                } else {
                    // This section of code is reserved
                    // when user modifies an existing project
                    this.collection = this.model.projectUsers;
                    Marionette.CompositeView.prototype.initialize.call(this);
                    this.model.getProjectUsers();
                    this.attachCollectionEventHandlers();
                }
                //this.listenTo(this.model, 'sync', this.createNewProjectUsers);
                this.render();
            },
            childViewOptions: function () {
                return this.model.toJSON();
            },

            /* Make the slug based on project title */
            // generateSlug: function () {
            //
            //     if (this.$el.find('#slug').val().length > 0){
            //         return;
            //     }
            //
            //     var name = this.$el.find('#projectName').val(),
            //         nameSplit = name.toLowerCase().split(" ");
            //
            //     // Remove all junk characters between words
            //     for(var idx in nameSplit){
            //         nameSplit[idx] = nameSplit[idx].replace(/\W+/g, "").trim();
            //     }
            //     // clean up extra spaces and complete slug name
            //     var slug = nameSplit.join(" ").trim().replace(/\s+/g, "-");
            //
            //     this.$el.find('#slug').val(slug);
            // },
            childView: ProjectUserView,
            attachCollectionEventHandlers: function () {
                this.listenTo(this.collection, 'add', this.render);
                this.listenTo(this.collection, 'reset', this.render);
                this.listenTo(this.collection, 'destroy', this.render);
            },
            fetchShareData: function () {
                this.model.getProjectUsers();
            },
            removeRow: function (e) {
                var $elem = $(e.target),
                    $row =  $elem.parent().parent();
                $row.remove();
                this.checkNumberOfRows();
            },
            onRender: function () {
                //var that = this;
                //this.showModal();
                this.checkNumberOfRows();
                // When the user clicks anywhere outside of the modal, close it
                /*window.onclick = function (event) {
                    if (event.target == that.$el.find('.modal').get(0)) {
                        that.hideModal();
                    }
                };*/
            },
            templateHelpers: function () {
                // for new projects, there shall be no projectUsers defined
                // otherwise, extract data from exising projectUsers
                var helpers = {
                    username: this.app.username
                };
                if (this.model && this.model.projectUsers) {
                    helpers.projectUsers = this.model.projectUsers.toJSON();
                }
                //helpers.slugError = this.slugError;
                return helpers;
            },

            saveProjectSettings: function () {
                // If a new project is made, then create a new projectUsers collection
                // to store the added users
                var projectName = this.$el.find('#projectName').val(),
                    shareType = this.$el.find('#access_authority').val(),
                    caption = this.$el.find('#caption').val(),
                    // slug = this.$el.find('#slug').val(),
                    // tags = this.$el.find('#tags').val(),
                    that = this;
                if (this.blankInputs()) {
                    console.log("required items not filled: Need Name, Owner, and User");
                    return;
                }
                this.model.set('name', projectName);
                this.model.set('access_authority', shareType);
                this.model.set('caption', caption);
                this.model.set('owner', this.app.username);
                //this.model.set('tags', tags);
                //this.model.set('slug', this.setSlugValue(slug));
                this.model.save(null, {
                    success: this.handleServerSuccess.bind(this),
                    error: this.handleServerError.bind(this)
                });
            },

            // redirect to the map, assuming the location is the homepage
            redirectToMapPage: function(projID){
                window.location.assign(window.location.href + 'main/' + projID + '/maps/');
            },

            handleServerSuccess: function(model, response) {
                this.createNewProjectUsers();
                //this.slugError = null;
                var projID = this.model.id;
                this.render();
                this.redirectToMapPage(projID);
            },

            handleServerError: function (model, response) {
                console.log("Project Not Saved / Created");
                this.app.vent.trigger('error-message', "Project Not Saved. Errors detected.");
                var messages = JSON.parse(response.responseText);
                // if (messages.slug && messages.slug.length > 0) {
                //     this.slugError = messages.slug[0];
                // }
                this.render();
            },

            // setSlugValue: function(slug_txt){
            //     var convertedSlug = slug_txt.toLowerCase().split(" ").join("_");
            //     return convertedSlug != "" ? convertedSlug : 'slug_' + parseInt(Math.random() * 100000, 10); // base10
            // },

            createNewProjectUsers: function () {
                var $userList = this.$el.find("#userList"),
                    $users = $userList.children(),
                    i,
                    $row,
                    username,
                    usernameInput,
                    authorityID,
                    existingProjectUser;
                if (!this.collection) {
                    this.model.projectUsers = new ProjectUsers(null,
                                        {id: this.model.get("id")});
                    this.collection = this.model.projectUsers;
                    this.attachCollectionEventHandlers();
                }
                //loop through each table row:
                for (i = 0; i < $users.length; i++) {
                    $row = $($users[i]);
                    $row.css("background-color", "#FFFFFF");
                    authorityID = parseInt($row.find(".authority").val(), 10);//base10
                    if ($row.attr("id") == this.model.id) {
                        //edit existing projectusers:
                        username = $row.find(".username").html();
                        existingProjectUser = this.model.getProjectUserByUsername(username);
                        /*
                        Before the individual file is saved,
                        make sure there are no empty values
                        */
                        if (!authorityID){
                            $row.css("background-color", "#FFAAAA");
                            return;
                        }
                        existingProjectUser.set("authority", authorityID);
                        existingProjectUser.save();
                    } else {
                        //create new projectuser:
                        username = $row.find(".username").val();
                        usernameInput = $row.find(".username");
                        if (!authorityID || (username.trim() == "" || username == undefined )){
                            $row.css("background-color", "#FFAAAA");
                            this.errorUserName(usernameInput);
                            return;
                        }
                        this.model.shareWithUser(username, authorityID, function(response, error){
                            var errorObject = JSON.parse(error.responseText);
                            console.log(response, error);
                            console.log(error.responseText.user);
                            $row.css("background-color", "#FFAAAA");
                            $row.css("color", "#AA0000");
                            $row.find("td")[0].append(errorObject.user);
                        });
                    }
                }
                // fire this event to redraw the project list underneath the modal.
                // the main.js function is listening for it:
                this.app.vent.trigger('project-added');
            },

            // Create a new user row with the necessary fields
            addUserButton: function () {
                var userTableDisplay = this.$el.find(".userTable"),
                    $newTR = $("<tr class='new-row'></tr>"),
                    template = Handlebars.compile(ProjectUserFormTemplate);

                userTableDisplay.show();// Make this visible even with 0 users
                $newTR.append(template());
                this.$el.find("#userList").append($newTR);
                this.initAutoComplete($newTR.find(".username"));
                // Now find out how many rows are there
                // to either show user table or add user prompt
                this.checkNumberOfRows();
            },
            initAutoComplete: function ($elem) {
                $elem.autocomplete({
                    minLength: 0,
                    source: function (request, response) {
                      // make the search term accept terms without case sensitivity
                      // However, that did not work inside source
                      var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                        $.ajax({
                            url: "/api/0/usernames/",
                            dataType: "json",
                            data: {
                                q: request.term
                            },
                            success: function (data) {
                                response(data);
                            }
                        });
                    }
                });
            },

            blankInputs: function () {
                // If any of the required fields are blank,
                // give the red color to the labels
                // and give message to the placeholders
                // to prompt user to fill in
                // the required fields
                var blankFields = false,
                    projectName_ = this.$el.find('#projectName').val(),
                    shareType_ = this.$el.find('#access_authority').val()
                    //,
                    //slug_ = this.$el.find('#slug').val();

                this.$el.find('#projectName').prev().css("color", '#000000');
                this.$el.find('#access_authority').prev().css("color", '#000000');
                if (!($.trim(projectName_))) {
                    blankFields = true;
                    this.$el.find('#projectName').prev().css("color", '#FF0000');
                }

                if (!(shareType_)) {
                    blankFields = true;
                    this.$el.find('#access_authority').prev().css("color", '#FF0000');
                }
                return blankFields;
            },

            deleteProject: function () {
                var that = this;
                if (!confirm("Are you sure you want to delete this project?")) {
                    return;
                }
                this.model.destroy({ success: function () {
                    console.log(that.app.vent);
                    that.app.vent.trigger('hide-modal');
                }});
            },

            errorUserName: function(_usernameInput){
              try{
                if (_usernameInput.val().trim() == "" || _usernameInput.val() == undefined){
                  throw "username missing"
                }
              }
              catch(err){
                _usernameInput.attr("placeholder", err);
                _usernameInput.css("background-color", "#FFDDDD");
                //_usernameInput.css("color", "#FF0000");
              }
            },

            checkNumberOfRows: function () {
                var $userList = this.$el.find("#userList"),
                    $userTableDiv = this.$el.find("#userTableDiv"),
                    numOfUsers = $userList.children().length;
                if (numOfUsers > 0 || numOfUsers == undefined || numOfUsers == null) {
                    $userTableDiv.show();
                } else {
                    $userTableDiv.hide();
                }
            }
        });
        return ShareFormView;
    });
