var self;
localground.formfields = function(){
    this.noFields = false;
    this.prefix = null;
    this.formError = false;
};

localground.formfields.prototype = new localground.base(); //alert(noFields);

localground.formfields.prototype.init = function(opts){
    self = this;
    if(opts) {
        $.extend(this, opts);
    }
    // initialize the form and the dynamic form generator:
    this.initFormset();
};

localground.formfields.prototype.initNewRow = function($elem) {
    self.initRow($elem, true);   
};

localground.formfields.prototype.initRow = function($elem, isNew) {
    /***
    This function adds some extra functionality so that the
    UI is customized for the fields forms (adding new users to views and projects)
    */
    var $cell1 = $elem.find('td:eq(1)');
	// if it's a new row, clear out old row's id (pk):
    if(isNew) {
        $elem.find('td:eq(0)').find('input').val('');
        $elem.find('select').val('').show();
		$cell1.find('select:eq(0)').val('');
		$cell1.find('span').remove();
    }
    else {
        if(!$cell1.hasClass('error')) {
            $cell1.find('select:eq(0)').hide();    
        }
		else {
			$cell1.find('span').remove();  	
		}
    }
};

localground.formfields.prototype.initFormset = function() {	
    $('#tbl tbody tr').formset({
        extraClasses: ['row1', 'row2'],
        prefix: this.prefix,
        addText: 'add new field',
        deleteText: '&times;',
        deleteCssClass: 'close',
        added: self.initNewRow,
        removed: function() {
            var visibleRows = 0;
            $('#tbl tbody tr').each(function(){
                if($(this).is(':visible')) ++visibleRows;
            });
            if(visibleRows == 1) {
                $('#tbl').hide();
                $('#field-div').show();
                $('#tbl').find('.add-row').trigger('click');
            }
        }
    });
	
	$('#field-div').find('.add-row').click(function(){
        $('#tbl').show();
        self.initRow($('#tbl').find('tr:eq(1)'), true);
        $('#field-div').hide();
        return false;
    });
	
    if(this.noFields && !this.formError) {
        $('#tbl').hide();
        $('#field-div').show();
    }
	else {
		$('#field-div').hide();
	}
	
	$('#tbl').find('tr').each(function(){
		self.initRow($(this), false);
	});
};

