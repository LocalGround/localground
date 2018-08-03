define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "text!templates/new-media.html",
    'load-image',
    'canvas-to-blob',
    'jquery.fileupload-ip'
], function ($, _, Handlebars, Marionette, NewMediaItemTemplate, loadImage) {
    'use strict';
    const CreateMediaItem = Marionette.ItemView.extend({
        initialize: function (opts) {
            _.extend(this, opts);
            this.file = this.model.get("file");
            this.data = this.model.get("data");
            this.options = opts.parent.options;
            this.doPost();
        },
        mode: "begin",
        template: Handlebars.compile(NewMediaItemTemplate),
        modelEvents: {
            'change:id': 'showSuccess'
        },
        events: {
            'click .delete': 'deleteModel'
        },
        tagName: "div",
        templateHelpers: function () {
            return {
                mode: this.mode,
                file_name: this.formatFilename(this.file.name),
                file_size: this.formatFileSize(this.file.size),
                errorMessage: this.errorMessage,
                imageSerial: this.imageSerial,
                dataType: this.getType()
            };
        },
        getType: function () {
            const ext = this.file.ext.toLowerCase();
            if (this.options.audioTypes.indexOf(ext) != -1) {
                return 'audio';
            }
            return 'photo';
        },
        getUrl: function (baseURL, ext) {
            if (this.getType() === 'audio') {
                return baseURL + 'audio/';
            } else if (this.options.dataType == 'map_images') {
                return baseURL + 'map-images/';
            }
            return baseURL + 'photos/';
        },
        getApiUrl: function (ext) {
            return this.getUrl('/api/0/', ext);
        },
        deleteModel: function (e) {
            this.model.destroy();
            e.preventDefault();
        },
        showPreview: function (file) {
            //load image function defined in fileupload-ip.js
            if (this.options.previewSourceFileTypes.test(file.type)) {
                this.renderBlob(file);
            } else {
                var $preview = file.context.find('.preview');
                $('<div class="audio-holder"><i class="fa fa-headphones fa-5x"></i></div>')
                    .insertAfter($preview);
                $preview.remove();
            }
        },
        renderBlob: function (file) {
            var that = this;
            return ((loadImage && loadImage(
                file,
                function (img) {
                    that.imageSerial = img.toDataURL("image/jpeg");
                    that.render();
                },
                {
                    maxWidth: that.options.previewMaxWidth,
                    maxHeight: that.options.previewMaxHeight,
                    canvas: true
                }
            )));
        },
        doPost: function () {
            this.data.url = this.getApiUrl(this.file.ext);
            console.log(this.data.url);
            this.render();
            //a hack to coordinate between upload manager and child model
            this.file.context = this.$el;
            this.file.model = this.model;
            //end hack
            this.showPreview(this.file);
            this.data.media_file = this.data.files;
            var that = this;
            this.data.submit()
                .error(function (result, textStatus, jqXHR) {
                    that.handleServerError(that.data.files[0], result, textStatus, jqXHR);
                });
            return true;
        },
        formatFilename: function (filename) {
            if (filename.length > 25) {
                return filename.substring(0, 12) +
                        '...' +
                        filename.substring(filename.length - 10, filename.length);
            }
            return filename;
        },
        formatFileSize: function (bytes) {
            if (typeof bytes !== 'number') {
                return '';
            }
            if (bytes >= 1000000000) {
                return (bytes / 1000000000).toFixed(2) + ' GB';
            }
            if (bytes >= 1000000) {
                return (bytes / 1000000).toFixed(2) + ' MB';
            }
            return (bytes / 1000).toFixed(2) + ' KB';
        },
        handleServerError: function (file, result, textStatus, jqXHR) {
            this.mode = "error";
            this.errorMessage = 'Error uploading ' + file.name + ": " + result.responseText;
            this.parent.errorCount += 1;
        },
        showSuccess: function () {
            this.mode = "end";
            this.render();
            this.parent.models.push(this.model);
        }
    });
    return CreateMediaItem;
});
