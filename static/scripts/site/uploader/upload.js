/* Uses:
    https://github.com/blueimp/jQuery-File-Upload
*/
localground.uploader = function(){
    this.counter = 0;
    this.options = {
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp3|m4a|mpeg)$/i,
        maxFileSize: undefined,
        minFileSize: undefined,
        maxNumberOfFiles: 20,
        previewSourceFileTypes: /^image\/(gif|jpeg|png)$/,
        imageFileTypes: /^image\/(gif|jpeg|png)$/,
        audioFileTypes: /^audio\/(x-m4a|mp3|m4a|mp4|mpeg)$/,
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
    
    $('#project').change(function(){
        $('.project').html($('#project option:selected').text());  
    });
    $('.close').click(function(){
       $(this).parent().hide();
       $('#alert-message-text').empty();
    });
    
    $('#alert-message-text').empty();
    $('#fileupload').fileupload({
        dataType: 'json',
        autoUpload: true,
        //sequential: true,
        url: '/upload/media/post/',
        dropZone: $('body'), //$('#dropzone'),
        add: self.onAdd,
        change: function(e, data) {
            alert(data.originalFiles.length);
        },
        done: function (e, data) {
            data.files[0].isDone = true;
            data.files[0].context.find('.progress').remove();
            
            $success= $('<div class="badge badge-success" />')
                            .css({
                                padding: '3px',
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
                        $(this).parent().parent().remove();
                        $.getJSON(data.result.delete_url,
                            function(result) {
                                //alert(JSON.stringify(result));
                                data.files[0].cancelled = true;
                                data.files[0].context.remove();
                                self.counter -= 1;
                                return false;
                            },
                        'json');    
                        return false;
                    });
            data.files[0].context.find('.img-container').prepend($success);   
            data.files[0].context.find('p').append(' | ').append($delete);      
            
        },
        progress: function (e, data) {
            data.files[0].context.find('.progress .bar').css(
                'width',
                parseInt(data.loaded / data.total * 100, 10) + '%'
            );
        },
        submit: function (e, data) {
            var $sel = data.files[0].context.find('.media_type');
            data.formData = {
                media_type: 'photos',
                project_id: $('#project').val()
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
    if (file.error) {
        return file.error;
    }
    if (self.counter > 20) {//self.options.maxNumberOfFiles) {
        return 'maxNumberOfFiles';
    }
    if (!this.options.acceptFileTypes.test(file.type)) {
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

localground.uploader.prototype.doUpload = function(file) {
    var notSubmitted = file.isDone == null || !file.isDone;
    var notCancelled = file.cancelled == null || !file.cancelled;
    var noError = file.error == null;
    //alert(file.isDone + ' - ' + file.cancelled + ' - ' + file.error);
    return (notSubmitted && notCancelled && noError);
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

localground.uploader.prototype.getTypeWidget = function(file) {
    //if it's an image, return a select box:
    if(self.options.imageFileTypes.test(file.type)) {
        var $widget = $('#media_type').clone().removeAttr('id').show();
        $widget.val('2');
        return $widget;
    }
    //if it's an audio file, pre-select audio:
    else if(self.options.audioFileTypes.test(file.type)) {
        var $widget = $('<span />')
                        .append($('<span />').html('Audio'))
                        .append($('<input type="hidden" />')
                                    .addClass('media_type')
                                    .val('4'));
        return $widget;
    }
    else {
        return $('<span />')
                        .append($('<span />').html(file.type))
                        .append($('<input type="hidden" />')
                                    .addClass('media_type')
                                    .val(file.type)); 
    }
};

localground.uploader.prototype.showOmittedFiles = function(data) {
    var omitted = 0, too_many = 0;
    $('#alert-message-text').empty();
    $.each(data.files, function (index, file) {
        if(file.error) {
            if(file.error == 'acceptFileTypes') {
                ++omitted;
                if($('#alert-message-text').html().length > 0)
                    $('#alert-message-text').append(', ');
                else
                    $('#alert-message-text').append(
                        'The following files were ignored because they are not supported \
                        by the file uploader:<br>');
                $('#alert-message-text').append(file.name + ": " + file.type);
            }
            else if(file.error == 'maxNumberOfFiles') {
                ++too_many;
            }
        }
    });
    if(omitted + too_many > 0) {
        $('.alert-message').show();
    }
    if(too_many > 0) {
        $('#alert-message-text').append('<br>Some files were not included because only 10 files can be uploaded at a time.');
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
    //validate files:
    self.validate(data);
    self.showOmittedFiles(data);
    $.each(data.files, function (index, file) {
        if(file.error) {
            //continue to next iteration: return true;
            return true;
        }
        $thediv.find('.img-polaroid').append(
            $('<p />').html(
                self.formatFilename(file.name) + '<br>' + self.formatFileSize(file.size)
            )
        );
        file.context = $thediv;
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
                    .html($('<i />').addClass('icon-headphones icon-dark'));
                return false;
            }
        });
    });

};



    
    