/* Todo: Perhaps migrate to Backbone? Not sure if it's necessary */
var self, Uploader;
Uploader = function (opts) {
    'use strict';
    //this.url = '/upload/media/post/';
    this.errorCount = 0;
    this.successCount = 0;
    this.options = {
        //acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp3|m4a|x-m4a|mpeg|wav)$/i,
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
        acceptFileTypes: opts.acceptFileTypes.split(', '),
        url: '/api/0/' + opts.mediaType + '/'
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
            url: this.options.url,
            dropZone: $('body'), //$('#dropzone'),
            add: self.onAdd,
            done: self.done,
            stop: function () {
                //fires after all uploads are finished:
                if (self.successCount > 0) {
                    msg = 'Your files have finished uploading. You may now add ';
                    msg += 'titles & descriptions to your files <a id="edit-media-link" href="#">here</a> ';
                    msg += 'or geo-reference you files in the <a id="edit-map-link" href="#">map editor</a>.';
                    $('#success-message-text').html(msg);
                    $('#edit-map-link').attr('href', '/maps/editor/' +
                        $('#project').val() + '/');
                    $('#edit-media-link').attr('href', '/profile/' +
                        self.options.mediaType + '/?project_id=' + $('#project').val());
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
            media_type: self.options.mediaType,
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

    this.renderBlob = function (file, index) {
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

    this.onAdd = function (e, data) {
        $('#nothing-here').remove();
        //validate files:
        self.validate(data);
        self.showOmittedFiles(data);
        $.each(data.files, function (index, file) {
            if (file.error) {
                //continue to next iteration: return true;
                return true;
            }
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
                            $('<div class="progress-bar" role="progressbar" style="width: 10%;"></div>')
                                .append($('<span class="sr-only">10% Complete</span>'))
                        )
                    /*$('<div />')
                        .addClass('progress progress-success progress-striped active')
                        .css({'min-width': '90px'})
                        .append($('<div />').addClass('bar').css({width: '0%'}))*/
                );
            $('#dropzone').prepend($thediv);
            $thediv.find('.img-polaroid').append(
                $('<p />').html(
                    self.formatFilename(file.name) + '<br>' + self.formatFileSize(file.size)
                )
            );
            file.context = $thediv;
            data.media_file = data.files;
            data.submit();
            return true;
        });

        //add image preview functionality:
        $(this).fileupload('resize', data).done(function () {
            $.each(data.files, function (index, file) {
                if (file.error) {
                    //continue to next iteration: return true;
                    return true;
                }
                var that = this,
                    options = this.options,
                    deferred = $.Deferred();
                //load image function defined in fileupload-ip.js
                if (self.options.previewSourceFileTypes.test(file.type)) {
                    self.renderBlob(file, index);
                    return true;
                } else {
                    file.context.find('.preview')
                        .attr('src', '/static/images/headphones_large.png')
                        .css({
                            width: '64px',
                            height: '64px',
                            'margin-top': '20px',
                            'margin-left': '40px'
                        });
                    return false;
                }
            });
        });
    };
    
    this.done = function (e, data) {
        var $success, $delete, $error, $container,
            response = data.result;
        data.files[0].isDone = true;
        data.files[0].context.find('.progress').remove();
        if (data.textStatus == "success") {
            $success = $('<div class="badge success-icon" />')
                .append($('<i >').addClass('fa fa-check'));

            $delete = $('<a />').attr('href', '#').append('delete')
                .click(function () {
                    var $container = $(this).parent().parent().parent(),
                        deleteURL = self.options.url + data.result.id + "/";
                    $.ajax({
                        url: deleteURL,
                        type: 'DELETE',
                        dataType: 'json',
                        success: function () {
                            $container.remove();
                            data.files[0].cancelled = true;
                            data.files[0].context.remove();
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
            data.files[0].context.find('.img-container').prepend($success);
            data.files[0].context.find('p')
                .append(' | ').append($delete).append('<br>' + $('#project-name').html());
            self.successCount += 1;
        } else {
            $error = $('<div class="badge badge-important" />')
                .css({
                    padding: '0px 0px 3px 3px',
                    'border-radius': '20px',
                    '-webkit-border-radius': '20px',
                    '-moz-border-radius': '20px',
                    'margin-top': '-10px',
                    'margin-left': '-10px',
                    position: 'absolute',
                    width: '16px'
                })
                .append($('<i >').addClass('icon-white icon-minus'));
            $container = data.files[0].context.find('.preview').parent();
            data.files[0].context.find('.preview').remove();
            data.files[0].context.find('.img-container').prepend($error);
            data.files[0].context.find('p')
                .css({
                    color: '#b94a48',
                    padding: 10,
                    'font-size': '10px',
                    'line-height': '12px'
                }).html('<strong>Error uploading ' + data.files[0].name +
                        ':</strong><br>' + data.result.error_message);
            $container.append(data.files[0].context.find('p'));
            self.errorCount += 1;
        }
    };

    //call initialization:
    this.initialize();
};