var self;

localground.tables = function(){
    this.formID = null;
    this.projectID = null;
    this.alias = null;
    this.mode = 'default';
    this.blanksURL = null;
};

localground.tables.prototype = new localground.profile(); // Here's where the inheritance occurs 

localground.tables.prototype.initialize=function(opts){
    //alert('init tables');
    self = this;
    localground.profile.prototype.initialize.call(this, opts);
    
    //set initialization variables:
    this.formID = opts.formID || this.formID;
    this.projectID = opts.project_id || this.projectID;
    this.alias = opts.alias || this.alias;
    this.blanksURL = opts.blanksURL || this.blanksURL;
    
    this.resizeTable();
    this.resizeControlsRow();
    $(window).resize(function() {
        self.resizeTable();
        self.resizeControlsRow();
    });
    
    $('#update_table').click(function(){
        self.addObject();
        $('#add-modal').find('.primary').hide();
    });
    
    $('#not_blank').click(function(){
        self.toggleBlanks(false);
        return false;
    });
    
    $('#blank').click(function() {
         self.toggleBlanks(true);
        return false;
    });
    
    
    this.initDownloadControls();
    //this.initEditor();
    
};

localground.tables.prototype.initDownloadControls = function() {
    $('#download-modal').find('.download_btn').click(function() {
        var where = [];
        if($('#col_4').val() != '-1')
            where.push('col_4=' + $('#col_4').val());
        if($('#col_6').val().length > 0)
            where.push('col_6=' + $('#col_6').val());
        var params = {
            form_id: self.formID,
            alias: self.alias,
            project_id: self.projectID
        };
        if(where.length > 0)
            params['where'] = where.join('|');
        //alert('/profile/tables/download/csv/?' + $.param(params));
        var $loadingImg = $('<div id="load_msg"></div>')
            .css({
                'width': '100%',
                'text-align': 'center',
                'height': 150
            })
            .append($('<img />')
                .attr('src', '/static/images/ajax-loader.gif')
        );
        var format = 'csv';
        $("#download-modal").find('.download-table').hide();
        var $result_div = $("#download-modal").find('.download-table-results').show();
        $result_div.append($loadingImg);
        $.getJSON('/profile/tables/download/' + format + '/', params,
            function(result) {
                //alert(JSON.stringify(result));
                $result_div.empty()
                    .append($('<p>Your file is ready for download:</p>'))
                    .append(
                        $('<a href="' + result.path + '">' + result.file_name + '</a>')
                    );
                $("#download-modal").find('.hide').html('Done');
            },
        'json');
        return false;

    }); 
    $('#download-modal').find('.close_btn').click(function() {
        $('#download-modal').modal('hide');
    }); 
    
    $('#col_4').append($('<option value="-1">-- All --</option>'));
    $('#download').click(function(){
        if(self.formID == 84)
            self.showModalWithOptions();
        else
            self.showModal();
    });  
};

localground.tables.prototype.showModalWithOptions = function() {
    if($('#col_4').find('option').length == 1) {
        $.getJSON('/api/0/tables/table/84/get-menu/',
            function(result){
                //check again in case user was impatient:
                if($('#col_4').find('option').length == 1) {
                    $.each(result.file_names, function(){
                        $('#col_4').append(
                                $('<option id="' + this + '">' + this + '</option>'));
                    });
                }
            },
            'json'
        );
    }
    $("#download-modal").find('.download-table').show();
    $("#download-modal").find('.download-table-results').hide();
    $('#download-modal').modal('show');    
};

localground.tables.prototype.showModal = function(){
    $('#download-modal').find('.hide').html('Cancel');
    $('#download-modal').find('h3').html("Download Data");
    $('#download-modal .modal-body').empty().css({'min-height': 150}).empty();
    $('#download-modal .modal-body').append(
        $('<p>Select the file type that you would like to download:</p>')
    )
    .append(
        $('<a href="#">Shapefile</a>').click(function() {
            self.doDownload('shapefile')
        })                            
    )
    .append($('<br>'))
    .append(
        $('<a href="#">KML</a>').click(function() {
            self.doDownload('kml')
        })                            
    )
    .append($('<br>'))
    .append(
        $('<a href="#">Comma-separated values (CSV)</a>').click(function() {
            self.doDownload('csv')
        })                            
    );
    $('#download-modal').modal('show');
    $('#download-modal').find('.primary').hide();  
};

localground.tables.prototype.doDownload = function(format) {
    var $loadingImg = $('<div id="load_msg"></div>')
        .css({
            'width': '100%',
            'text-align': 'center',
            'height': 150
        })
        .append($('<img />')
            .attr('src', '/static/images/ajax-loader.gif')
    );
    $('#download-modal .modal-body').empty().append($loadingImg);
    var params = {
        form_id: this.formID,
        alias: this.alias,
        project_id: this.projectID
    };
    $.getJSON('/profile/tables/download/' + format + '/', params,
        function(result) {
            //alert(JSON.stringify(result));
            $('#download-modal .modal-body').empty()
                .append($('<p>Your file is ready for download:</p>'))
                .append(
                    $('<a href="' + result.path + '">' + result.file_name + '</a>')
                );
            $('#download-modal').find('.hide').html('Done');
        },
    'json');
    return false;
};

/*
localground.tables.prototype.initEditor = function() {
    $('.edit').click(function() {
        self.edit($(this).attr('target'), true);
        return false;
    });   
    $('.edit').bind("contextmenu", function(event) {
        self.edit($(this).attr('target'), false);
        return false;
    });
    
    $('#save_and_continue').click(function() {
        self.mode = 'edit_object';
        $('#load_msg').show();
        var $nextRecord = $('#the_frame').contents().find('#next_record');
        $nextRecord.val('true');
        var $f =  $('#the_frame').contents().find('form');
        $f.submit();
        
    });
    $('#save').click(function() {
        self.mode = 'edit_object';
        $('#load_msg').show();
        var $nextRecord = $('#the_frame').contents().find('#next_record');
        $nextRecord.val('false');
        var $f =  $('#the_frame').contents().find('form');
        $f.submit();
    });
    $('#close').click(function() {
        $('#my-modal').modal('hide');
    });  
};

*/

localground.tables.prototype.initImagePreviewer = function() {
    var modal_width = 900, modal_height = 300;
    $('.thumb').click(function() {
        //$('.modal-body').css({ height: 170 });
        $('#image-modal').css({
            'width': modal_width,
            'margin-left': -1*parseInt(modal_width/2)
        }).modal('show');
        $('#preview_image').attr('src', $(this).next().val());
        return false;
    }).css({'cursor': 'pointer'});
};

localground.tables.prototype.resizeControlsRow = function() {
    //overriding default resizer to accomodate really long tables:
    if($('#table-container').get(0) == null)
        return;
    var overflowX = ($('#table-container').get(0).scrollWidth >
            $('#table-container').width());
    //only resize if horizontal overflow:
    if(!overflowX) {
        $('#controls_row, .paginator, .alert-message').width($('#the_table').width() + 10);
        $('.alert-message').width($('#the_table').width()-30); 
    }
    else {
        //otherwise, give the buttons some right padding:
        //$('#controls_row > button, .paginator > div').css({'margin-right': '10px'});
        $('#controls_row, .paginator, .alert-message').width($('#table-container').width()-8);
        $('.alert-message').width($('#table-container').width()-8); 
    }
    $('.tabs').width($('#table-container').width()-200);
};

localground.tables.prototype.resizeTable = function() {
    if($('#table-container').get(0) == null) { return; }
    var overflowX = ($('#table-container').get(0).scrollWidth >
            $('#table-container').width());
    //if(overflowX)
    {
        var topHeight = 153;
        if($('.paginator').length > 0)
            topHeight = topHeight + 40;
        $('#table-container').height($(window).height()-topHeight);    
    }
  
};

localground.tables.prototype.addObject = function() {
    var $msg = $('<div id="load_msg">Coming soon!</div>')
                    .css({
                        'width': '520px',
                        'height': '100px',
                        'text-align': 'center'
                    });
    $('#add-modal-body').empty().append($msg);
    $('#add-modal').modal('show');
};

localground.tables.prototype.edit = function(markerID, embed) {
    if(!embed) {
        var url = '/scans/update-record/map/?id=' + markerID + '&form_id=' + this.formID;
        window.open(url, '_blank');
    }
    else {
        var url = '/scans/update-record/map/embed/?id=' + markerID + '&form_id=' + this.formID;    
        var modal_width = 1000, modal_height = $('body').height()-135;
        var $iframe = $('<iframe></iframe>')
            var $iframe = $('<iframe></iframe>')
            .css({
                'width': (modal_width-3),
                'height': modal_height,
                'margin': '0px 0px 0px 0px',
                'display': 'block',
                'visibility': 'hidden' //display:none throws positioning error
            })
            .attr('id', 'the_frame')
            .attr('frameborder', 0)
            .attr('src', url)
            .load(function() {
                $iframe.css({ 'visibility': 'visible' });
                $('#load_msg').hide();
                if($('#the_frame').contents().find('.success').get(0) != null)
                   $('#close').html('Done');
            });
        var $loadingImg = $('<div id="load_msg"></div>')
                                .css({
                                    'width': modal_width,
                                    'text-align': 'center',
                                    'position': 'absolute',
                                    'margin-top': 100
                                })
                                .append($('<img />')
                                    .attr('src', '/static/images/ajax-loader.gif')
                            );
        $('#dialogBody').empty().append($loadingImg).append($iframe);
        $('#my-modal').css({
            'width':modal_width,
            'margin-left': -1*parseInt(modal_width/2),
            'margin-top': -1*parseInt($('body').height()/2)+10
        }).modal('show');
    }
};

localground.tables.prototype.toggleBlanks = function(is_blank) {
    $('#is_blank').val(is_blank);
    var selection_made = false;
    var $ul = $('<ul></ul>');
    $('.checkone').each(function() {
        if($(this).attr('checked')) {
            selection_made = true;
            $ul.append($('<li></li>').html('Record #' + $(this).val()));
        }
    });
    if(!selection_made) {
        $('#no-selection-modal').modal('show');
    }
    else {
        var msg = 'Are you sure you want to set the following items(s) to ';
        if(is_blank)
            msg += 'blank?';
        else
            msg += 'not blank?';
        $('#blank_message').empty()
            .append($('<p></p>').html(msg))
            .append($ul);
        $('#blank-modal').find('.primary').css({'display': 'inline-block'});
        $('#blank-modal').modal('show');
    }  
};


localground.tables.prototype.blankConfirm = function() {
    self.mode = 'update_blanks';
    $('#blank_message').empty()
            .append($('<img />')
            .css({'margin-left': '200px'})
            .attr('src', '/static/images/ajax-loader.gif'));
    $('#blank-modal').find('.primary').css({'display': 'none'});
    var params = $('#the_form').serialize();
    $.post(self.blanksURL,
        params,
        function(result) {
            //alert(JSON.stringify(result));
            $('#blank_message').html(result.message);
            $('#blank-modal').find('.hide').html('Done');
        },
        'json')
        .error(function() {
            $('#blank-modal').find('.primary').css({'display': 'inline-block'}); 
            $('#blank-modal').find('.hide').html('Cancel');
        });   
};