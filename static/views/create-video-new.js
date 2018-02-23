define([
    "jquery",
    "underscore",
    "backbone",
    "handlebars",
    "marionette",
    "lib/forms/backbone-form",
    "models/video",
    "text!templates/create-media.html"
], function ($, _, Backbone, Handlebars, Marionette, DataForm,
    Video, CreateMediaTemplate) {
    'use strict';

    /*
    Decided to go forth with another view incolving video link
    Making a very rough draft version of create video layout
    with an html, but requires some configuration to choose between
    create media template and create video template
    */

    var CreateMediaViewNew = Marionette.CompositeView.extend({
        models: [],
        // There must be some way to dynamically determine the template
        // dependong on data type
        template: Handlebars.compile(CreateMediaTemplate),
        initialize: function (opts) {
            this.model = new Video(null, {
                projectID: 2
            });
            console.log(opts);
            console.log(DataForm);

        },
        templateHelpers: function () {
            return {
                mode: this.mode,
                //file_name: this.formatFilename(this.file.name),
                //file_size: this.formatFileSize(this.file.size),
                //errorMessage: this.errorMessage,
                //imageSerial: this.imageSerial,
                // having dataType does not help because
                // it is uninitialized
                dataType: this.options.dataType
            };
        },
        onRender: function () {
            this.form = new DataForm({
                model: this.model,
                schema: this.model.getFormSchema(),
                app: this.app
            }).render();
            this.$el.find('#video-url-get').append(this.form.$el);
        },
    });
    return CreateMediaViewNew;

});
