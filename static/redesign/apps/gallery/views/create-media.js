define([
    "backbone",
    "marionette",
    "handlebars",
    "text!../templates/create-media.html",
    "form"
], function (Backbone, Marionette, Handlebars, CreateMediaTemplate) {
    'use strict';

    /*
      As of now, this is a rough draft copy-paste version for
      creating and uploading media and subject to further changes

    */
    var CreateMediaView = Marionette.ItemView.extend({
        template: Handlebars.compile(CreateMediaTemplate),
        initialize: function (opts) {

        }
    });
    return CreateMediaView;

});
