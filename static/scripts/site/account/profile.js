localground.profile = function(){
    this.mode = 'default'
    this.rawURL = null;
    this.addURL = null;
    this.updateURL = null;
    this.deleteURL = null;
    this.objectName = 'Object';
	this.addModal = null;
	this.deleteModal = null;
	this.noSelectionModal = null;
	this.imageModal = null;
};

localground.profile.prototype = new localground.base(); // inherits from base 

localground.profile.prototype.initialize = function(opts) {
    self = this;
    localground.base.prototype.initialize.call(this, opts);
	if(opts) {
        $.extend(this, opts);
    }
     
    //make sure everything's un-checked!
    $('.checkone, .checkall').attr('checked', false);
    
    /*$('#add-modal, #delete-modal, #no-selection-modal, #move-modal, #image-modal').modal({
        keyboard: true,
        backdrop: true,
        closeExtras: function() {
            switch(self.mode) {
                //only reload page if they didn't cancel the action
                case 'add_object':
                    if($('#add-modal').find('.hide').html() == 'Done') {
                        document.location.href = self.pageURL;
                    }
                    break;
                case 'move_objects':
                    if($('#move-modal').find('.hide').html() == 'Done') {
                        document.location.href = self.pageURL;
                    }
                    break;
                case 'delete_objects':
                    if($('#delete-modal').find('.hide').html() == 'Done') {
                        document.location.href = self.pageURL;
                    }
                    break;
                case 'update_blanks':
                    if($('#blank-modal').find('.hide').html() == 'Done') {
                        document.location.href = self.pageURL;
                    }
                    break;
                default:
                    //do nothing
                    break;
            }
            self.mode = 'default';
        }
    });
	*/
    
    $('#saveChanges').click(function() {
		$('#the_form').attr('action', self.updateURL);
        $('#load_msg').show();
        $('#the_form').submit();
        return false;
    });
    
    $('#add_object').click(function() {
        self.mode = 'add_object';
        self.addObject();
    });
    
    $('.checkall').click(function() {
        if($(this).attr('checked')) {
            $('.checkone, .checkall').attr('checked', true);
            //$('.checkone, .checkall').parents('td, th').addClass('checkbox_selected');
            $('.checkone, .checkall').parents('tr').children('td, th').addClass('checkbox_selected');
        }
        else {
            $('.checkone, .checkall').attr('checked', false);   
            //$('.checkone, .checkall').parents('td, th').removeClass('checkbox_selected');
            $('.checkone, .checkall').parents('tr').children('td, th').removeClass('checkbox_selected');
        }
    });
    
    $('.checkone').click(function() {
        if($(this).attr('checked')) {
            $(this).attr('checked', true);
            //$(this).parents('td, th').addClass('checkbox_selected');
            $(this).parents('tr').children('td, th').addClass('checkbox_selected');
        }
        else {
            $(this).attr('checked', false);   
            //$(this).parents('td, th').removeClass('checkbox_selected');
            $(this).parents('tr').children('td, th').removeClass('checkbox_selected');
        }
    });
    
    $('#delete_objects').click(function() {
		var $list = $('<ul></ul>').addClass('item_list');
        var selection_made = false;
        $('.checkone').each(function() {
            if($(this).attr('checked')) {
                selection_made = true;
                var id = $(this).val();
                var name = self.objectName + ' #' + id;
                if($('#name_' + id).get(0) != null && $('#name_' + id).val().length > 0)
                    name = $('#name_' + id).val();
                $list.append($('<li></li>').html(name));
            }
        });
        //$('#dialogBody').empty();
        if(!selection_made) {
            return self.noSelection();
        }
        else {
            this.deleteModal = new ui.dialog({
				id: 'delete-modal',
				width: 560,
				height: 350,
				showTitle: true,
				title: 'Delete Confirmation',
				submitButtonText: 'Confirm',
				submitFunction: self.deleteConfirm,
				closeExtras: function() {
					if($('#delete-modal').find('.hide').html() == 'Done')
						document.location.href = self.pageURL;
				},
				innerContent: $('<div></div>').append(
									$('<div id="delete_message"></div>').html(
											'Are you sure you want to delete the \
										  following item(s)?')
									).append($list)
			});
			this.deleteModal.show();
			return false;
        }
    });
    
    this.initImagePreviewer();
    
    $('#move_project').click(function() {
        self.initiateMove();
	});
    
    this.resizeControlsRow();
	
	$('.datetime')
        .find('input:eq(0)')
        .datepicker({ dateFormat: 'mm/dd/yy' });
    $('.datetime')
        .find('input:eq(1)')
        .timepicker({
            showPeriod: true,
            showLeadingZero: true
        });
    
    
};

localground.profile.prototype.resizeControlsRow = function() {
    $('#controls_row, .paginator').width($('#the_table').width());
    $('.alert-message').width($('#the_table').width()-30); 
    $('.tabs').width($('.tabs').width()-200);
};

localground.profile.prototype.deleteConfirm = function() {
	$('#delete_message').empty()
            .append($('<img />')
            .css({'margin-left': '200px'})
            .attr('src', '/static/images/ajax-loader.gif'));
    
	$('#delete-modal').find('.primary').css({'display': 'none'});
    var params = $('#the_form').serialize();
    $.post(self.deleteURL,
        params,
        function(result) {
            $('#delete_message').html(result.message);
            $('#delete-modal').find('.hide').html('Done');
        },
        'json')
        .error(function() {
            $('#delete-modal').find('.primary').css({'display': 'inline-block'}); 
            $('#delete-modal').find('.hide').html('Cancel');
        });
};

localground.profile.prototype.deleteConfirm1 = function() {
    self.mode = 'delete_objects';
    $('#delete_message').empty()
            .append($('<img />')
            .css({'margin-left': '200px'})
            .attr('src', '/static/images/ajax-loader.gif'));
    $('#delete-modal').find('.primary').css({'display': 'none'});
    var params = $('#the_form').serialize();
    $.post(self.deleteURL,
        params,
        function(result) {
            //alert(JSON.stringify(result));
            $('#delete_message').html(result.message);
            $('#delete-modal').find('.hide').html('Done');
        },
        'json')
        .error(function() {
            $('#delete-modal').find('.primary').css({'display': 'inline-block'}); 
            $('#delete-modal').find('.hide').html('Cancel');
        });
};

localground.profile.prototype.addObject = function() {
	//alert(this.addURL);
    this.addModal = new ui.dialog({
        id: 'add-modal',
        width: 560,
        height: 400,
        iframeURL: this.addURL,
        showTitle: false,
        //title: 'Create New ' + this.objectName,
        submitButtonText: 'Add ' + this.objectName.toLowerCase(),
        closeExtras: function() {
            if($('#add-modal').find('.hide').html() == 'Done')
                document.location.href = self.pageURL;
        }
    });
    this.addModal.show();
    return false;   
};

localground.profile.prototype.noSelection = function() {
	if(this.noSelectionModal == null) {
		this.noSelectionModal = new ui.dialog({
			id: 'no-selection-modal',
			width: 400,
			height: 150,
			showTitle: true,
			title: 'No ' + this.objectName + '(s) Selected',
			innerContent: 'In order to perform the selected operation, one or more \
						items must be selected (use the check boxes to the left).'
		});
	}
    
    this.noSelectionModal.show();
    return false;   
};

localground.profile.prototype.initImagePreviewer = function() {
    $('.thumb').click(function() {
		self.imageModal = new ui.dialog({
			id: 'image-modal',
			width: 540,
			height: 350,
			overflowY: 'auto',
			showTitle: false,
			innerContent: $('<img />').attr('src', $(this).next().val())
		});
		self.imageModal.show();
		return false;
    }).css({'cursor': 'pointer'}); 
};

localground.profile.prototype.saveObject = function() {
    $('#load_msg').show();
    var $f =  $('#the_frame').contents().find('form');
    $f.submit();
};

localground.profile.prototype.hideDialog = function() {
    $('#add-modal').modal('hide');
    $('#delete-modal').modal('hide');
    $('#no-selection-modal').modal('hide');
    $('#move-modal').modal('hide');
    $('#image-modal').modal('hide');
    $('#blank-modal').modal('hide');
    $('#my-modal').modal('hide');
    
};

localground.profile.prototype.initiateMove = function() {
    //check to see if selection made:
    var selection_made = false;
    $.each($('input[name="id"]'), function() {
        if($(this).attr('checked')) {
            selection_made = true;
            return;
        }
    });
    if(!selection_made) {
        return self.noSelection();
    }
    else {
        $('#move-server-message').empty()
            .append($('<img />')
            .css({'margin-left': '200px'})
            .attr('src', '/static/images/ajax-loader.gif'));
        var params = $("#the_form").serialize() + '&just_validate=true';
        $.post(this.moveURL,
            params,
            function(result) {
                $('#move-server-message').html(result.message);
            },
            'json');
        
        $('#move-modal').find('.primary').css({'display': 'block !important'});
        $('#move-modal').find('.hide').html('Cancel');
        $('#move-modal').modal('show');
		return false;
    }	
};

localground.profile.prototype.moveConfirm = function() {
	self.mode = 'move_objects';
    $('#move-server-message').empty()
            .append($('<img />')
            .css({'margin-left': '200px'})
            .attr('src', '/static/images/ajax-loader.gif'));
    $('#move-modal').find('.primary').css({'display': 'none'});
    var params = $("#the_form").serialize() + '&new_project=' + $('#new_project').val();
    $.post(this.moveURL,
        params,
        function(result) {
            $('#move-server-message').html(result.message);
            $('#move-modal').find('.hide').html('Done');
        },
        'json');
};
