define([
    "backbone",
    "marionette",
    "handlebars",
    "text!../templates/create-media.html",
    "text!../templates/uploader/upload-manager.file.html",
    "text!../templates/uploader/upload-manager.main.html",
    "backbone-upload-manager"
], function (Backbone, Marionette, Handlebars, CreateMediaTemplate, MainTemplate, FileTemplate) {
    'use strict';

    /*
      As of now, this is a rough draft copy-paste version for
      creating and uploading media and subject to further changes

    */
    var CreateMediaView = Marionette.ItemView.extend({
        template: Handlebars.compile(CreateMediaTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            console.log(this.template);
            
            var uploadManager = new Backbone.UploadManager({
	            uploadUrl: '/api/0/photos/',
	            templates: {
	                main: "../static/redesign/apps/gallery/templates/uploader/upload-manager.main.html",
	                file: "../static/redesign/apps/gallery/templates/uploader/upload-manager.file.html"
	            }
	        });
            console.log(uploadManager);
            this.render();
            //this.$el.append(uploadManager.$el);
            uploadManager.renderTo(this.$el);
        }
    });
    return CreateMediaView;

});
