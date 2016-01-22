/* Todo: Perhaps migrate to Backbone? Not sure if it's necessary */
var self, Uploader;
Uploader = function (opts) {
    'use strict';
    //this.url = '/upload/media/post/';
    this.errorCount = 0;
    this.successCount = 0;
    this.isIframe = opts.isIframe;
    this.options = {
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
        mediaType: opts.mediaType,
        imageTypes: opts.imageTypes.split(', '),
        audioTypes: opts.audioTypes.split(', '),
        acceptFileTypes: opts.acceptFileTypes.split(', ')
    };

    this.initAJAX = function () {
        var csrf = $('input[name="csrfmiddlewaretoken"]').val();
        $.ajaxSetup({
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-CSRFToken", csrf);
            }
        });
    };

    this.initialize = function () {
        self = this;
        this.initAJAX();
        var msg = "";
        $('#warning-message-text').empty();
        $('#fileupload').fileupload({
            dataType: 'json',
            autoUpload: true,
            //sequential: true,
            dropZone: $('body'),
            add: self.onAdd,
            done: self.done,
            stop: function () {
                //fires after all uploads are finished:
                if (self.successCount > 0) {
                    if (self.isIframe) {
                        msg = 'Your files have finished uploading. Close this window to refresh the map. ';
                        msg += 'Then, geo-reference your files and give them titles and captions';
                        $('#success-message-text').html(msg);
                    } else {
                        msg = 'Your files have finished uploading. You may now add ';
                        msg += 'titles & captions to your files ';
                        msg += 'or geo-reference you files in the <a id="edit-map-link" href="#">map editor</a>.';
                        $('#success-message-text').html(msg);
                        $('#edit-map-link').attr('href', '/maps/edit/new/');
                    }
                    $('#success').show();
                } else {
                    $('#success').hide();
                }
                if (self.errorCount > 0) {
                    $('#error').show();
                    $('#error-message-text').html('There were errors when uploading your files.');
                } else {
                    $('#error').hide();
                }
                //reset counters:
                self.errorCount = 0;
                self.successCount = 0;
            },
            progress: function (e, data) {
                data.files[0].context.find('.progress-bar').css(
                    'width',
                    parseInt(data.loaded / data.total * 100, 10) + '%'
                );
            },
            submit: function (e, data) {
                data.formData = self.getFormData();
            }
        });
        
        //section for uploading by dragging files from your desktop:
        $(document).bind({
            dragover: function (e) {
                //alert('dragover');
                e.stopPropagation();
                e.preventDefault();
                var dropZone = $('#dropzone'),
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
    };

    this.getFormData = function () {
        return {
            project_id: $('#project').val(),
            csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
        };
    };

    this.formatFileSize = function (bytes) {
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
    };

    this.hasError = function (file) {
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
    };

    this.validate = function (data) {
        //alert(self.counter);
        var valid = !!data.files.length;
        $.each(data.files, function (index, file) {
            file.error = self.hasError(file);
            if (file.error) {
                valid = false;
            }
        });
        return valid;
    };

    this.renderBlob = function (file) {
        return ((loadImage && loadImage(
            file,
            function (img) {
                file.context.find('.preview').attr('src', img.toDataURL("image/jpeg"));
            },
            {
                maxWidth: self.options.previewMaxWidth,
                maxHeight: self.options.previewMaxHeight,
                canvas: true
            }
        )));
    };

    this.showOmittedFiles = function (data) {
        var omitted = 0;
        $.each(data.files, function (index, file) {
            if (file.error) {
                if (file.error == 'acceptFileTypes') {
                    ++omitted;
                    if ($('#warning-message-text').html().length > 0) {
                        $('#warning-message-text').append(', ');
                    } else {
                        $('#warning-message-text').append(
                            'The following files were ignored because they are not supported  by the file uploader:<br>'
                        );
                    }
                    $('#warning-message-text').append(file.name + ": " + file.type);
                }
            }
        });
        if (omitted > 0) {
            $('#warning').show();
        }
    };

    this.formatFilename = function (filename) {
        if (filename.length > 25) {
            return filename.substring(0, 12) +
                    '...' +
                    filename.substring(filename.length - 10, filename.length);
        }
        return filename;
    };
    this.getUrl = function (baseURL, ext) {
        ext = ext.toLowerCase();
        var isAudio = this.options.audioTypes.indexOf(ext) != -1,
            url = 'photos/';
        if (this.options.mediaType == 'map-images') {
            url = 'map-images/';
        } else if (isAudio) {
            url =  'audio/';
        }
        return baseURL + url;
    };

    this.getApiUrl = function (ext) {
        return this.getUrl('/api/0/', ext);
    };

    this.getProfileUrl = function (ext) {
        return this.getUrl('/profile/', ext);
    };

    this.showInitMessage = function () {
        if ($('.file-container').length == 0) {
            $('#nothing-here').show();
        }
    };

    this.onAdd = function (e, data) {
        $('#nothing-here').hide();
        //validate files:
        self.validate(data);
        self.showOmittedFiles(data);
        $.each(data.files, function (index, file) {
            if (file.error) {
                //continue to next iteration: return true;
                self.showInitMessage();
                return true;
            }
            data.url = self.getApiUrl(file.ext);
            var $thediv = $('<div />')
                .addClass('file-container')
                .append($('<div class="img-polaroid thumbnail" />')
                    .append(
                        $('<div class="img-container" />')
                            .css({
                                width: 145,
                                'max-height': 140,
                                'min-height': 100,
                                overflow: 'hidden'
                            })
                            .append(
                                $('<img />').css({
                                    width: 145
                                }).addClass('preview')
                            )
                    ))
                .append(
                    $('<div class="progress"></div>')
                        .append(
                            $('<div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" style="width: 10%;"></div>')
                                .append($('<span class="sr-only">10% Complete</span>'))
                        )
                );
            file.context = $thediv;
            self.showPreview(file);
            $('#dropzone').prepend($thediv);
            $thediv.find('.img-polaroid').append(
                $('<p />').html(
                    self.formatFilename(file.name) + '<br>' + self.formatFileSize(file.size)
                )
            );
            file.context = $thediv;
            data.media_file = data.files;
            data.submit()
                .error(function (result, textStatus, jqXHR) {
                    self.handleServerError(data.files[0], result, textStatus, jqXHR);
                });
            return true;
        });
    };
    this.handleSuccess = function (file) {
        console.log(file);
        this.showPreview(file);
    };
    this.showPreview = function (file) {
        //load image function defined in fileupload-ip.js
        if (self.options.previewSourceFileTypes.test(file.type)) {
            self.renderBlob(file);
        } else {
            var $preview = file.context.find('.preview');
            $('<div class="audio-holder"><i class="fa fa-headphones fa-5x"></i></div>')
                .insertAfter($preview);
            $preview.remove();
        }
    };

    this.handleServerError = function (file, result, textStatus, jqXHR) {
        var $container, $error, $preview;
        console.log('server error', result);
        $error = $('<div class="badge failure-icon" />')
                    .append($('<i >').addClass('fa fa-exclamation'));
        file.context.find('.img-container').prepend($error);
        $preview = file.context.find('.preview');
        $('<div class="error-holder"></div>').insertAfter($preview);
        $preview.remove();
        file.context.find('.error-holder')
            .css({
                color: '#b94a48',
                padding: 10,
                'font-size': '10px',
                'line-height': '12px'
            }).html('<strong>Error uploading ' + file.name +
                    ':</strong><br>' + result.responseText);
        console.error('Server Error: ' + result.responseText);
        file.context.find('.progress').remove();
        self.errorCount += 1;

        $('#error').show();
        $('#error-message-text').html('There were errors when uploading your files.');
    };

    this.done = function (e, data) {
        var $success, $delete, file = data.files[0];
        file.isDone = true;
        file.context.find('.progress').remove();
        $delete = $('<a />').attr('href', '#').append('delete')
            .click(function () {
                var $container = $(this).parent().parent().parent(),
                    deleteURL = self.getApiUrl(file.ext) + data.result.id + "/";
                $.ajax({
                    url: deleteURL,
                    type: 'DELETE',
                    dataType: 'json',
                    success: function () {
                        $container.remove();
                        file.cancelled = true;
                        file.context.remove();
                        self.showInitMessage();
                    },
                    error: function (response) {
                        try {
                            var error = JSON.parse(response.responseText).detail;
                            alert("Error deleting: " + error);
                        } catch (ex) {
                            alert("Error deleteting");
                        }
                    }
                });
                return false;
            });

        $success = $('<div class="badge success-icon" />')
            .append($('<i >').addClass('fa fa-check'));
        file.context.find('.img-container').prepend($success);
        file.context.find('p')
            .append('<br />').append($delete).append(' | <a href="' + self.getProfileUrl(data.files[0].ext) + '">edit</a>');
        self.successCount += 1;
    };

    //call initialization:
    this.initialize();
};