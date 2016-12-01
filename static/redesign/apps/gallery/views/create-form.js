define([
  "underscore",
  "jquery",
  "handlebars",
  "marionette",
  "text!../templates/create-form.html"
],
  function (_, $, Handlebars, Marionette, CreateFormTemplate){
    // Setting up a create form js

    var CreateFormView = Marionette.ItemView.extend({
      events: {
        'click #save-form-settings' : 'saveFormSettings'
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
          Marionette.ItemView.prototype.initialize.call(this);
          this.template = Handlebars.compile(CreateFormTemplate);
      },

      // Need to add more functions to handle various events
      // and to get the form to open up

      saveFormSettings: function(){
        alert("Need to save form");
      }

    });
    return CreateFormView;

  }
);
