/* Uses:
    https://github.com/blueimp/jQuery-File-Upload
*/
localground.uploader = function (opts) {
    'use strict';
    this.mediaType = opts.mediaType;
    this.url = '/api/0/' + this.mediaType + '/';
    alert(this.url);
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
        autoUpload: true
    };
};

localground.uploader.prototype = new localground.base(); // inherits from base 
localground.uploader.prototype.initAjaxGlobalErrorHandling = function() {
    //override default:
    return;    
};
localground.uploader.prototype.initialize = function(opts) {
    self = this;
    localground.base.prototype.initialize.call(this, opts);
    this.options.mediaType = opts.mediaType;
    this.options.acceptFileTypes = opts.acceptFileTypes.split(', ');
    
    $('.dropdown-menu > li > a').click(function(){
        $('#project').val($(this).attr('id'));
        $('#project-name').html($(this).html());
    });
    
    $('#warning-message-text').empty();
    $('#fileupload').fileupload({
        dataType: 'json',
        autoUpload: true,
        //sequential: true,
        url: this.url,
        dropZone: $('body'), //$('#dropzone'),
        add: self.onAdd,
        done: self.done,
        stop: function(e){
            //fires after all uploads are finished:
            if(self.successCount > 0) {
                $('#success-message-text').html(
                        'Your files have finished uploading. You may now add \
                        titles & descriptions to your files <a id="edit-media-link" href="#">here</a> \
                        or geo-reference you files in the \
                        <a id="edit-map-link" href="#">map editor</a>.');
                $('#edit-map-link').attr('href', '/maps/editor/' +
                            $('#project').val() + '/');
                $('#edit-media-link').attr('href', '/profile/' +
                            self.options.mediaType + '/?project_id=' + $('#project').val());
                $('#success').show();
                
            }
            else {
                $('#success').hide();
            }
            if(self.errorCount > 0){
                $('#error').show();
                $('#error-message-text').html('There were errors when uploading your files.');
            }
            else{ $('#error').hide(); }
            
            //reset counters:
            self.errorCount = 0;
            self.successCount = 0;
        },
        progress: function (e, data) {
            data.files[0].context.find('.progress .bar').css(
                'width',
                parseInt(data.loaded / data.total * 100, 10) + '%'
            );
        },
        submit: function (e, data) {
            var token = $('input[name="csrfmiddlewaretoken"]').val();
            //alert(token);
            data.formData = {
                media_type: self.options.mediaType,
                project_id: $('#project').val(),
                csrfmiddlewaretoken: token
            }
            //alert(JSON.stringify(data.formData));
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

localground.uploader.prototype.formatFileSize = function(bytes) {
    if (typeof bytes !== 'number')
        return '';
    if (bytes >= 1000000000)
        return (bytes / 1000000000).toFixed(2) + ' GB';
    if (bytes >= 1000000)
        return (bytes / 1000000).toFixed(2) + ' MB';
    return (bytes / 1000).toFixed(2) + ' KB';
};

localground.uploader.prototype.hasError = function(file) {
    var pieces = file.name.split('.')
    var ext = pieces[pieces.length-1];
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

localground.uploader.prototype.validate = function(data) {
    //alert(self.counter);
    valid = !!data.files.length;
    $.each(data.files, function (index, file) {
        file.error = self.hasError(file);
        if (file.error) {
            valid = false;
        }
    });
    return valid;
};

localground.uploader.prototype.renderBlob = function(file, index) {         
    return ((loadImage && loadImage( 
        file,
        function (img) {
            file.context.find('.preview').attr('src', img.toDataURL("image/jpeg"));
        },
        {
            maxWidth: self.options.previewMaxWidth,
            maxHeight:self.options.previewMaxHeight,
            canvas: true
        }
        )));  
};


localground.uploader.prototype.showOmittedFiles = function(data) {
    var omitted = 0;
    $.each(data.files, function (index, file) {
        if(file.error) {
            if(file.error == 'acceptFileTypes') {
                ++omitted;
                if($('#warning-message-text').html().length > 0)
                    $('#warning-message-text').append(', ');
                else
                    $('#warning-message-text').append(
                        'The following files were ignored because they are not supported \
                        by the file uploader:<br>');
                $('#warning-message-text').append(file.name + ": " + file.type);
            }
        }
    });
    if(omitted > 0) {
        $('#warning').show();
    }
};

localground.uploader.prototype.formatFilename = function(filename) {
    if(filename.length > 25) {
        return filename.substring(0, 12) +
                '...' +
                filename.substring(filename.length-10, filename.length)
    }
    return filename;
}

localground.uploader.prototype.onAdd = function(e, data) {
    $('#nothing-here').remove();
    //validate files:
    self.validate(data);
    self.showOmittedFiles(data);
    $.each(data.files, function (index, file) {
        if(file.error) {
            //continue to next iteration: return true;
            return true;
        }
        var $thediv= $('<div />')
            .addClass('file-container')
            .append($('<div class="img-polaroid" />')
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
                )
            ).append(
                $('<div />')
                    .addClass('progress progress-success progress-striped active')
                    .css({'min-width': '90px'})
                    .append($('<div />').addClass('bar').css({width: '0%'}))
            );
        $('#uploaded').prepend($thediv);
        $thediv.find('.img-polaroid').append(
            $('<p />').html(
                self.formatFilename(file.name) + '<br>' + self.formatFileSize(file.size)
            )
        );
        file.context = $thediv;
        data.file_name_orig = data.files
        console.log(data);
        data.submit();
        return true;
    });

    //add image preview functionality:
    $(this).fileupload('resize', data).done(function () {
        $.each(data.files, function (index, file) {
            if(file.error) {
                //continue to next iteration: return true;
                return true;
            }
            var that = this,
                options = this.options,
                deferred = $.Deferred();
            //load image function defined in fileupload-ip.js
            if(self.options.previewSourceFileTypes.test(file.type)) {
                self.renderBlob(file, index);
                return true;
            }
            else {
                file.context.find('.preview')
                    .attr('src', '/static/images/headphones_large.png')
                    .css({
                        width: '64px',
                        height: '64px' ,
                        'margin-top': '20px' ,
                        'margin-left': '40px'       
                    });
                return false;
            }
        });
    });
};

localground.uploader.prototype.done = function(e, data) {
    data.files[0].isDone = true;
    data.files[0].context.find('.progress').remove();
    if(data.result.success) {
        $success= $('<div class="badge badge-success" />')
                    .css({
                        padding: '0px 3px 3px 3px',
                        'border-radius': '20px',
                        '-webkit-border-radius': '20px',
                        '-moz-border-radius': '20px',
                        'margin-top': '-10px',
                        'margin-left': '-10px',
                        position: 'absolute',
                        width: '16px'
                    })
                    .append($('<i >').addClass('icon-white icon-ok'));
    
        $delete = $('<a />').attr('href', '#').append('delete')
            .click(function() {
                $(this).parent().parent().parent().remove();
                $.getJSON(data.result.delete_url,
                    function(result) {
                        //alert(JSON.stringify(result));
                        data.files[0].cancelled = true;
                        data.files[0].context.remove();
                        return false;
                    },
                'json');    
                return false;
            });
        data.files[0].context.find('.img-container').prepend($success);   
        data.files[0].context.find('p')
            .append(' | ').append($delete).append('<br>' + $('#project-name').html());
        self.successCount += 1;
    }
    else {
        $error= $('<div class="badge badge-important" />')
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



    
    