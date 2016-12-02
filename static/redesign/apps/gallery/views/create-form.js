define([
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/create-form.html"
], function (_, Handlebars, Marionette, CreateFormTemplate) {
    // Setting up a create form js
    'use strict';
    var CreateFormView = Marionette.ItemView.extend({
        events: {
            'click #save-form-settings' : 'saveFormSettings',
            'click .close': 'hideModal'
        },

        template: Handlebars.compile(CreateFormTemplate),

        templateHelpers: function () {
            return {
                mode: this.app.mode,
                dataType: this.app.dataType,
                screenType: this.app.screenType
            };
        },

        initialize: function (opts) {
            _.extend(this, opts);

            if (this.model == undefined){
              // Create a blank project if new project made
              this.model = new Form();
            } else {

              //this.collection = this.model.projectUsers;
              Marionette.CompositeView.prototype.initialize.call(this);
              //this.model.getProjectUsers();
              //this.listenTo(this.collection, 'reset', this.render);
              //this.listenTo(this.collection, 'destroy', this.render);
            }

            //this.listenTo(this.model, 'sync', this.createNewProjectUsers);

            Marionette.ItemView.prototype.initialize.call(this);
            this.template = Handlebars.compile(CreateFormTemplate);
            this.render();
        },
        hideModal: function () {
            this.$el.hide();
        },


        /*
          Behavior problem: After opeiing the modal window and closing
          for the first time, modal windows opo up when
          clicking on the add button again.
        */
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
          /*
          // This will eventually consider the number of fields represented
          // in columns for the tags and values while the rows contains
          // the data stored into the tags
          if (this.model.projectUsers == undefined) return;
          return {
            projectUsers: this.model.projectUsers.toJSON()
          };
          */
        },

        // Need to add more functions to handle various events
        // and to get the form to open up
        saveFormSettings: function () {
            alert("Need to save form");

            // Gather the html data
            var $formName = $('#formName').val();
            var $shareType = $('#share_type').val();
            var $caption = $('#caption').val();
            var $tags = $('#tags').val();

            this.model.set('name', $formName);
            this.model.set('access_authority', $shareType);
            this.model.set('tags', $tags);
            this.model.set('caption', $caption);
            this.model.set('slug', 'slug_' + parseInt(Math.random()*100000));
            this.model.set('project_ids', [this.app.selectedProject.id]);
            this.model.save();
        }

    });
    return CreateFormView;

});
