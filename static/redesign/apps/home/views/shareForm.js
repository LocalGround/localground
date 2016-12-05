define(["marionette",
"underscore",
"handlebars",
"text!../templates/share-form.html",
"text!../templates/project-user-item.html",
"models/project",
"collections/projectUsers"],
function (Marionette, _, Handlebars, ItemTemplate, ProjectUserFormTemplate,
          Project, ProjectUsers) {
  'use strict';
  var ShareFormView = Marionette.CompositeView.extend({
    initialize: function (opts) {
      _.extend(this, opts);

      if (this.model == undefined){
        // Create a blank project if new project made
        this.model = new Project();
      } else {

        //This section of code is reserved
        // when user modifies an existing project
        this.collection = this.model.projectUsers;
        Marionette.CompositeView.prototype.initialize.call(this);
        this.model.getProjectUsers();
        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(this.collection, 'destroy', this.render);
      }

      this.listenTo(this.model, 'sync', this.createNewProjectUsers);
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
      // for new projects, there shall be no projectUsers defined
      // otherwise, extract data from exising projectUsers
      if (this.model.projectUsers == undefined) return;
      return {
        projectUsers: this.model.projectUsers.toJSON()
      };
    },
    saveProjectSettings: function () {

      var that = this;

      // If a new project is made, then create a new projectUsers collection
      // to store the added users

      var $projectName = $('#projectName').val();
      var $shareType = $('#share_type').val();
      var $caption = $('#caption').val();
      var $owner = $('#owner').val();
      var $tags = $('#tags').val();

      if (this.blankInputs()){
        return;
      }

      this.model.set('name', $projectName);
      this.model.set('access_authority', $shareType);
      this.model.set('tags', $tags);
      this.model.set('caption', $caption);
      this.model.set('slug', 'slug_' + parseInt(Math.random()*100000));
      this.model.set('owner', $owner);
      this.model.save();



    },

    createNewProjectUsers: function(){
        console.log(this.model);
      if (this.model.projectUsers == undefined){
        this.model.projectUsers = new ProjectUsers(null,
                                  {id: this.model.get("id")});
        this.collection = this.model.projectUsers;

      // Gather the list of users changed / added
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

      this.collection.fetch({ reset: true });

      this.listenTo(this.collection, 'reset', this.render);

      // fire this event to redraw the project list underneath the modal.
      // the main.js function is listening for it:
      this.app.vent.trigger('project-added');
      }
    },

    // Create a new user row with the necessary fields
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

    blankInputs: function(){

      // If any of the required fields are blank,
      // give the red color to the labels
      // and give message to the placeholders
      // to prompt user to fill in
      // the required fields

      var blankFields = false;

      var $projectName_ = $('#projectName').val();
      var $shareType_ = $('#share_type').val();
      var $caption_ = $('#caption').val();
      var $owner_ = $('#owner').val();
      var $tags_ = $('#tags').val();

      /*
      Tip: it's possible to refer to labels that hold the id
      by using the following:
      $('#id_name').prev(); // go to label for the id name

      it is especially useful for changing style with css like this:
      $('#id_name').prev().css({property: value});
      */

      $('#projectName').prev().css("color", '#000000');
      //$('#caption').prev().css("color", '#000000');
      //$('#tags').prev().css("color", '#000000');
      $('#share_type').prev().css("color", '#000000');
      $('#owner').prev().css("color", '#000000');


      if (!($.trim($projectName_))){
        blankFields = true;
        $('#projectName').prev().css("color", '#FF0000');
      }

      /*
      if (!($.trim($caption_))){
        blankFields = true;
        $('#caption').prev().css("color", '#FF0000');
      }

      if (!($.trim($tags_))){
        blankFields = true;
        $('#tags').prev().css("color", '#FF0000');
      }
      */

      if (!($shareType_)){
        blankFields = true;
        $('#share_type').prev().css("color", '#FF0000');
      }

      if (!($.trim($owner_))){
        blankFields = true;
        $('#owner').prev().css("color", '#FF0000');
      }


      return blankFields;

    },

    checkNumberOfRows: function(){

      var $userList = $("#userList");
      var $addNewUser = $("#addNewUser");
      var $userTableDiv = $("#userTableDiv");
      var numOfUsers = $userList.children().length;
      //console.log("Number of Users: " + numOfUsers);

      if (numOfUsers > 0 || numOfUsers == undefined || numOfUsers == null){
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
