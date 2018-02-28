define([
    "jquery",
    "underscore",
    "backbone",
    "handlebars",
    "marionette",
    "lib/forms/backbone-form",
    "models/photo",
    "models/audio",
    "models/video",
    "text!templates/create-media.html",
    "text!templates/new-media.html",
    'load-image',
    'canvas-to-blob',
    'jquery.fileupload-ip'
], function ($, _, Backbone, Handlebars, Marionette, DataForm, Photo, Audio, Video,
    CreateMediaTemplate, NewMediaItemTemplate, loadImage) {
    'use strict';

    var CreateMediaView = Marionette.CompositeView.extend({
        models: [],
        // There must be some way to dynamically determine the template
        // dependong on data type
        template: Handlebars.compile(CreateMediaTemplate),
        getChildView: function () {
            return Marionette.ItemView.extend({
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
                        // having dataType does not help because
                        // it is uninitialized
                        dataType: this.options.dataType
                    };
                },
                getUrl: function (baseURL, ext) {
                    ext = ext.toLowerCase();
                    var isAudio = this.options.audioTypes.indexOf(ext) != -1,
                        url = 'photos/';
                    if (this.options.dataType == 'map_images') {
                        url = 'map-images/';
                    } else if (isAudio) {
                        url =  'audio/';
                    } else if (this.options.dataType == 'videos') {
                        url = 'videos/';
                    }
                    return baseURL + url;
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
        },
        form: null,
        childViewContainer: "#dropzone",
        events: {
            'click #upload-button': 'triggerFileInputButton'
        },
        collectionEvents: {
            "destroy": "showInitMessage"
        },
        triggerFileInputButton: function (e) {
            this.$el.find("#fileupload").trigger('click');
            e.preventDefault();
        },
        templateHelpers: function () {
            return {
                count: this.collection.length,
                dataType: this.dataType
            };
        },
        defaults: {
            dataType: "default",
            acceptFileTypes: 'png, jpg, jpeg, gif, audio\/x-m4a, m4a, mp3, m4a, mp4, mpeg, video\/3gpp, 3gp, aif, aiff, ogg, wav',
            imageTypes: 'png, jpg, jpeg, gif',
            audioTypes: 'audio\/x-m4a, m4a, mp3, m4a, mp4, mpeg, video\/3gpp, 3gp, aif, aiff, ogg, wav',
            isIframe: false
        },

        childViewOptions: function () {
            return {
                parent: this
            };
        },
        getOptions: function () {
            return {
                maxFileSize: undefined,
                minFileSize: undefined,
                maxNumberOfFiles: 20,
                previewSourceFileTypes: /^image\/(gif|jpeg|png)$/,
                imageFileTypes: /^image\/(gif|jpeg|png)$/,
                audioFileTypes: /^audio\/(x-m4a|mp3|m4a|mp4|mpeg|wav)$/,
                previewSourceMaxFileSize: 5000000, // 5MB
                previewMaxWidth: 800,
                previewMaxHeight: 800,
                autoUpload: true,
                imageTypes: this.defaults.imageTypes.split(', '),
                audioTypes: this.defaults.audioTypes.split(', '),
                acceptFileTypes: this.defaults.acceptFileTypes.split(', ')
            };
        },
        onShow: function () {
            var that = this;
            this.$el.find('#fileupload').fileupload({
                dataType: 'json',
                autoUpload: true,
                dropZone: this.$el.find("#dropzone"),
                add: that.onAdd.bind(that),
                done: that.done.bind(that),
                stop: that.stop.bind(that),
                progress: function (e, data) {
                    data.files[0].context.find('.progress-bar').css(
                        'width',
                        parseInt(data.loaded / data.total * 100, 10) + '%'
                    );
                },
                submit: function (e, data) {
                    data.formData = that.getFormData();
                }
            });

            //section for uploading by dragging files from your desktop:
            this.$el.find("#dropzone").bind({
                dragover: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var dropZone = that.$el.find('#dropzone'),
                        timeout = window.dropZoneTimeout;
                    if (!timeout) {
                        dropZone.addClass('in hover');
                    } else {
                        clearTimeout(timeout);
                    }
                    window.dropZoneTimeout = setTimeout(function (e) {
                        window.dropZoneTimeout = null;
                        dropZone.removeClass('in hover');
                        return false;
                    }, 500);
                },
                drop: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            });
        },
        initialize: function (opts) {
            console.log("Data Form:");
            console.log(DataForm);
            _.extend(this, opts);
            this.collection = new Backbone.Collection();
            var that = this;
            this.options = this.getOptions();
            if (opts.dataType) {
                this.options.dataType = opts.dataType;
            }
            $('#warning-message-text').empty();
            if (opts.dataType == "videos"){
                /*
                // Commented out for rough draft workable version
                this.model = new Video(null, {
                    projectID: 2
                });
                console.log("Data Form:");
                console.log(DataForm);
                this.form = new DataForm({
                    model: this.model,
                    schema: this.model.getFormSchema(),
                    app: this.app
                }).render();
                this.$el.find('#model-form').append(this.form.$el);
                */
            }
            this.render();
            /*
            Going to need some changes to consider either create media mode
            between media (photo and audio) or video links
            for setting up the template
            */
            console.log(this.$el.find("#fileupload"));
            this.$el.find('#fileupload').fileupload({
                dataType: 'json',
                autoUpload: true,
                dropZone: this.$el.find("#dropzone"),
                add: that.onAdd.bind(that),
                done: that.done.bind(that),
                stop: that.stop.bind(that),
                progress: function (e, data) {
                    data.files[0].context.find('.progress-bar').css(
                        'width',
                        parseInt(data.loaded / data.total * 100, 10) + '%'
                    );
                },
                submit: function (e, data) {
                    data.formData = that.getFormData();
                }
            });

            //section for uploading by dragging files from your desktop:
            this.$el.find("#dropzone").bind({
                dragover: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var dropZone = this.$el.find('#dropzone'),
                        timeout = window.dropZoneTimeout;
                    if (!timeout) {
                        dropZone.addClass('in hover');
                    } else {
                        clearTimeout(timeout);
                    }
                    window.dropZoneTimeout = setTimeout(function (e) {
                        window.dropZoneTimeout = null;
                        dropZone.removeClass('in hover');
                        return false;
                    }, 500);
                },
                drop: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            });
        },
        dragover: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var dropZone = this.$el.find('#dropzone'),
                timeout = window.dropZoneTimeout;
            if (!timeout) {
                dropZone.addClass('in hover');
            } else {
                clearTimeout(timeout);
            }
            window.dropZoneTimeout = setTimeout(function (e) {
                window.dropZoneTimeout = null;
                dropZone.removeClass('in hover');
                return false;
            }, 500);
        },
        errorCount: 0,
        successCount: 0,
        stop: function () {
            if (this.successCount > 0) {
                this.$el.find('.success-message').show();
            } else {
                this.$el.find('.success-message').hide();
            }
            if (this.errorCount > 0) {
                this.$el.find('.failure-message').show();
            } else {
                this.$el.find('.failure-message').hide();
            }
            //reset counters:
            this.errorCount = 0;
            this.successCount = 0;
        },

        getFormData: function () {
            return {
                project_id: this.app.getProjectID(),
                csrfmiddlewaretoken: this.app.getCookie('csrftoken')
            };
        },

        hasError: function (file) {
            var pieces = file.name.split('.'),
                ext = pieces[pieces.length - 1];
            file.ext = ext;
            if (file.error) {
                return file.error;
            }
            if (this.options.acceptFileTypes.indexOf(file.type.toLowerCase()) == -1 &&
                    this.options.acceptFileTypes.indexOf(ext.toLowerCase()) == -1) {
                return 'acceptFileTypes';
            }
            if (this.options.maxFileSize &&
                    file.size > this.options.maxFileSize) {
                return 'maxFileSize';
            }
            if (typeof file.size === 'number' &&
                    file.size < this.options.minFileSize) {
                return 'minFileSize';
            }
            return null;
        },
        validate: function (data) {
            var that = this,
                valid = !!data.files.length;
            $.each(data.files, function (index, file) {
                file.error = that.hasError(file);
                if (file.error) {
                    valid = false;
                }
            });
            return valid;
        },

        showOmittedFiles: function (data) {
            var omitted = 0,
                messages = [],
                message = "The following files were ignored because they are not supported  by the file uploader:<br>";
            $.each(data.files, function (index, file) {
                if (file.error) {
                    if (file.error == 'acceptFileTypes') {
                        ++omitted;
                        messages.push(file.name + ": " + file.type);
                    }
                }
            });
            if (omitted > 0) {
                message += messages.join(", ");
                this.$el.find('.warning-message').html(message).show();
            }
        },

        showInitMessage: function () {
            if (this.collection.length == 0) {
                this.$el.find('#nothing-here').show();
                this.$el.find('#dropzone').css('border', 'dashed 1px #CCC');
            }
        },

        onAdd: function (e, data) {
            var that = this,
                model;
            this.$el.find('#nothing-here').hide();
            this.$el.find('#dropzone').css('border', 'none');
            //validate files:
            this.validate(data);
            this.showOmittedFiles(data);
            $.each(data.files, function (index, file) {
                if (file.error) {
                    //continue to next iteration: return true;
                    that.showInitMessage();
                    return true;
                }
                if (that.options.previewSourceFileTypes.test(file.type)) {
                    model = new Photo({
                        file: file,
                        data: data
                    });
                } else {
                    model = new Audio({
                        file: file,
                        data: data
                    });
                }
                that.collection.add(model);
            });
        },

        done: function (e, data) {
            var attributes = data.result,
                model = data.files[0].model,
                sourceCollection = null;
            model.set(attributes);
            if (model.get("overlay_type") == "photo") {
                sourceCollection = this.app.dataManager.getCollection("photos");
            } else {
                sourceCollection = this.app.dataManager.getCollection("audio");
            }
            model.urlRoot = sourceCollection.url;
            delete model.attributes.data;
            delete model.attributes.file;
            sourceCollection.unshift(model); //add to top
        },

        addModels: function () {
            var selectedModels = [];
            this.collection.each(function (model) {
                selectedModels.push(model);
            });
            this.parentModel.trigger('add-models-to-marker', selectedModels);
        }
    });
    return CreateMediaView;

});
