define([
  "underscore",
  "handlebars",
  "marionette",
  "text!../templates/create-form.html",
  "text!../templates/field-item.html",
  "models/field",
  "collections/fields"
], function (_, Handlebars, Marionette, CreateFormTemplate, FieldItemTemplate,
  Field, Fields) {
    // Setting up a create form js
    'use strict';
    var CreateFormView = Marionette.ItemView.extend({

      initialize: function (opts) {
        _.extend(this, opts);

        if (this.model == undefined){
          // Create a blank project if new project made
          this.model = new Form();
        } else {

          //this.collection = this.model.fields;
          Marionette.CompositeView.prototype.initialize.call(this);
          //this.model.getfields();
          //this.listenTo(this.collection, 'reset', this.render);
          //this.listenTo(this.collection, 'destroy', this.render);
        }

        //this.listenTo(this.model, 'sync', this.createNewfields);

        Marionette.ItemView.prototype.initialize.call(this);
        this.template = Handlebars.compile(CreateFormTemplate);
        this.render();
      },


      childViewOptions: function () {
        return this.model.toJSON();
      },
      getChildView: function () {
        // this child view is responsible for displaying
        // and deleting Field models:
        return Marionette.ItemView.extend({
          initialize: function (opts) {
            _.extend(this, opts);
          },
          events: {
            'click .delete-field': 'doDelete'
          },
          template: Handlebars.compile(FieldItemTemplate),
          tagName: "tr",
          doDelete: function (e) {
            var that = this;
            if (!confirm("Are you sure you want to remove this field from the form?")) {
              return;
            }
            this.model.destroy();
            e.preventDefault();


          }
        });
      },
      childViewContainer: "#fieldList",
      template: Handlebars.compile(CreateFormTemplate),
      events: {
        'click #save-form-settings' : 'saveFormSettings',
        'click .close': 'hideModal',
        'click .new_field_button' : 'addFieldButton'
      },
      fetchShareData: function () {
        this.model.getFields();
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
        //*
        // This will eventually consider the number of fields represented
        // in columns for the tags and values while the rows contains
        // the data stored into the tags
        if (this.model.fields == undefined) return;
        return {
          fields: this.model.fields.toJSON()
        };
        //*/
      },

      // Need to add more functions to handle various events
      // and to get the form to open up
      saveFormSettings: function () {
        alert("Need to save form");

        var that = this;

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
      },

      //
      // Still needs refactoring since the majority of the code
      // is based on the share-form.js file
      //

      createNewFields: function(){
        console.log(this.model);
        if (this.model.fields == undefined){
          this.model.fields = new Fields(null,
            {id: this.model.get("id")});
            this.collection = this.model.fields;

            // Gather the list of fields changed / added
            var $fieldList = $("#fieldList");
            var $fields = $fieldList.children();

            //loop through each table row:
            for (var i = 0; i < $fields.length; ++i) {
              var $row = $($users[i]);
              if ($row.attr("id") == this.model.id) {
                //edit existing fields:
                var fieldname = $row.find(".fieldname").html();
                var existingField = this.model.getFieldByName(fieldname);
                existingField.save();

              } else {
                //create new fields:
                var fieldName = $row.find(".fieldname").val();
                var fieldType = $row.find(".fieldType").val();
                this.model.createField(fieldName, fieldType);
              }

            }

            this.collection.fetch({ reset: true });

            this.listenTo(this.collection, 'reset', this.render);

          }
        },

        addFieldButton: function() {
          console.log("Pressed new Field Link");
          var fieldTableDisplay = $(".fieldTable");
          fieldTableDisplay.show();// Make this visible even with 0 users
          var $newTR = $("<tr class='new-row'></tr>");
          var template = Handlebars.compile(FieldItemTemplate);
          $newTR.append(template());
          this.$el.find("#fieldList").append($newTR);

          // Now find out how many rows are there
          // to either show user table or add user prompt
          //

          // this.checkNumberOfRows();

        }



      });
      return CreateFormView;

    });
