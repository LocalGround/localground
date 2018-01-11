localground.print = function(){
    this.layouts = [];
    this.form = null;
    this.forms = [];
    this.scans = null;
    this.selectedLayout
    this.selectedLayoutID = 1; //portrait
    this.resizableTable = null;
    this.table_width = 735;
    this.data_types_initialized = false;
    this.selectedProjectID = -1;
    this.numProjects = 0;
};
localground.print.prototype = new localground.basemap();           // Here's where the inheritance occurs 

localground.print.prototype.initialize=function(opts){
    self = this;
    $.extend(this, opts);
    this.center             = opts.center || new google.maps.LatLng(37.855365, -122.272614);
    this.zoom               = opts.zoom || 13;
    this.layouts            = opts.layouts || this.layouts,
    this.selectedLayoutID   = opts.selectedLayoutID || this.selectedLayoutID;
    this.forms              = opts.forms || this.forms;
    this.scans              = opts.scans || this.scans;
    this.selectedProjectID  = opts.selectedProjectID || this.selectedProjectID;
    this.numProjects        = opts.numProjects || this.numProjects;
    if(opts.formID != null) 
        this.form = this.getForm(opts.formID);
    
    this.initFormsMenu();
    this.initProjectsMenu();
    //this.initViewsMenu();
    this.initLayout();
    this.initMap(opts);
    this.initLayoutFormset();
    
    //$('#the_form').submit(self.validateForm);
    $('input').keypress(function(event){
        if(event.keyCode == 13){
            return false;
        }
        return true;
    });

};

localground.print.prototype.initFormsMenu = function() {
    if(this.form != null)
        $('#form_id').val(this.form.id);
        
    if(this.forms.length > 0) {
        $.each(this.forms, function() {
            $('#form').append(
                $('<option />').attr('id', this.id).val(this.id).html(this.name)
            );
        });
        $('#form').change(function(){
            self.form = self.getForm($('#form').val());
            //self.toggleFormControls();
            self.renderForm();
        });
    }
    else {
        $('#form_options').hide();
    }
    $('#form').append(
        $('<option />').attr('id', -1).val(-1).html('-- Create New --')
    );
    $('#cancel_add_new_form').click(function() {
        $('#form').get(0).selectedIndex = 0;
        $('#short_form').attr('checked', false);
        $('#long_form').attr('checked', false);
        self.setLayout();
        self.renderForm();
        return false;
    });
    
    $('#form_name').val('Enter table name...');
};

localground.print.prototype.initProjectsMenu = function() {
    $('#project_id').val(this.selectedProjectID);
    $('#project_id').change(function(){
        if($(this).val() == 'add')
            self.toggleNewProject(true);
    });
    $('#cancel_add_new_project').click(function(){
        self.toggleNewProject(false);
        return false;
    });
    
    //if the user hasn't created any projects, default to this.
    if(this.numProjects == 0) {
        self.toggleNewProject(true);
        $('#project_id').val('add');
        $('#cancel_add_new_project').hide();
    }
    
    $('#project_name').val('Enter new project name...');
};

localground.print.prototype.initMap = function(opts) {
    //override map options (turn off everything):
    this.mapOptions = {
        scrollwheel: false,
        streetViewControl: false,
        scaleControl: false,
        panControl: false,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL
        },
        mapTypeControl: false,
        rotateControl: false
    };
    localground.basemap.prototype.initialize.call(this, opts);
    
    google.maps.event.addListener(self.map, 'bounds_changed', function() {
        $('#zoom').val(self.map.getZoom());
    });
    
    // render overlay tiles:
    if(opts.initial_overlays){
        $.each(opts.initial_overlays, function() {
            self.addTileOverlay(this, true);   
        });
    }
    
    // render scans
    if(this.scans) {
        $.each(this.scans, function() {
            self.addGroundOverlay(this);
        });
    }

    google.maps.event.addListener(this.map, 'idle', function() {
        $('#center_lat').val(self.map.getCenter().lat());
        $('#center_lng').val(self.map.getCenter().lng());
    });  
};

localground.print.prototype.initLayout = function() {
    $("#txtMapTitle")
        .keypress(function(event){
            if(event.keyCode == 13){
                self.setTitleComplete();
                return false;
            }
            return true;
        })
        .blur(function(){self.setTitleComplete();});
    
    $("#txtInstructions").blur(function(){ self.setInstructionsComplete(); });

    
    $("#mapTitle, #instructions").hover(
        function () {
          $(this).css({'cursor': 'pointer', 'background-color': '#eee'});
        },
        function () {
          $(this).css({'background-color': '#fff'});
        }
    );
    $('.layout_control').click(function() {
        self.form = self.getForm($('#form').val());
        //alert(self.form);
        self.setLayout();
        self.renderForm();
    })

    $('#short_form').attr('checked', false);
    $('#long_form').attr('checked', false);
    this.toggleFormControls();
    //select controls based on selected layout:
    switch(this.selectedLayoutID) {
        case 1:
            $('#portrait').attr('checked', true);
            $('#map_form').attr('checked', true);
            break;
        case 2:
            $('#landscape').attr('checked', true);
            $('#map_form').attr('checked', true);
            break;
        case 3:
            $('#portrait').attr('checked', true);
            $('#map_form').attr('checked', true);
            $('#short_form').attr('checked', true);
            break;
        case 4:
            $('#portrait').attr('checked', true);
            $('#map_report').attr('checked', true);
            break;
        case 5:
            $('#landscape').attr('checked', true);
            $('#map_report').attr('checked', true);
            break;
    }
    $('#second_page').hide();
    this.setLayout();
};

localground.print.prototype.initLayoutFormset = function() {	
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
	
	$('#tbl').find('tr').each(function(){
		self.initRow($(this), false);
	});
};


localground.print.prototype.initNewRow = function($elem) {
    self.initRow($elem, true);   
};

localground.print.prototype.initRow = function($elem, isNew) {
    /***
    This function adds some extra functionality so that the
    UI is customized for the fields forms (adding new users to views and projects)
    */
    var $cell1 = $elem.find('td:eq(1)');
	// if it's a new row, clear out old row's id (pk):
    if(isNew) {
        $elem.find('td:eq(0)').find('input').val('');
		$cell1.find('span').remove();
    }
    else {
        if($cell1.hasClass('error')) {
			$cell1.find('span').remove();  	
		}
    }
};

localground.print.prototype.toggleNewProject = function(show) {
    if(show) {
        $('#project_id').hide();
        $('#project_name').show();
        $('#cancel_add_new_project').show();
    }
    else {
        $('#project_id').val('-1').show();
        $('#project_name').hide();
        $('#cancel_add_new_project').hide();
    }
};

localground.print.prototype.setLayout = function(){
    //return;
    //set flags:
    var is_portrait = $('#portrait').attr('checked');
    var is_landscape = $('#landscape').attr('checked');
    var is_map_form = $('#map_form').attr('checked');
    var is_map_report = $('#map_report').attr('checked');
    var short_form = $('#short_form').attr('checked');
    var long_form = $('#long_form').attr('checked');
    
    //show / hide controls & continue setting flags:
    if(is_map_report) {
        $('#header, #footer, #form_options, #project_options').hide();
        $('#second_page').hide();
        $('#short_form').attr('checked', false);
        $('#long_form').attr('checked', false);
        short_form = long_form = false;
        $('#no_save_warning').show();
    } else {
        $('#header, #footer, #project_options').show();
        if(this.forms.length > 0){
           $('#form_options').show();
        }
        $('#no_save_warning').hide();
    }
    if(is_landscape) {
        $('#span_same_page').hide();
        short_form = false;
        $('#short_form').attr('checked', false);
    } else {
        $('#span_same_page').show();    
    }

    //get layout configuration
    var id = -1;
    if(is_portrait) {
        if(is_map_form && short_form)
            id = 3; // portrait + qr + same page form
        else if(is_map_form)
            id = 1; // portrait + qr
        else
            id = 4; // portrait report
    }
    else {
        if(is_map_form)
            id = 2; // landscape + qr
        else
            id = 5; // landscape report
    }
     
    $.each(this.layouts, function(){
        if(this.id == id) {
            self.selectedLayout = this;
            return;
        }
    });
    
    $('#layout').val(self.selectedLayout.id);
    $('#txtMapTitle').width(self.selectedLayout.map_width-5);
    $('#mapTitle').width(self.selectedLayout.map_width+5);
    $('#map_canvas')
        .width(self.selectedLayout.map_width)
        .height(self.selectedLayout.map_height);
    $('#instructions').width(self.selectedLayout.map_width-80);
    $('#paper_form_short').width(self.selectedLayout.map_width+7);
    $('#txtInstructions').width(self.selectedLayout.map_width-90);
    if(self.map != null) { google.maps.event.trigger(self.map, 'resize'); }
};


localground.print.prototype.addGroundOverlay = function(scan) {
    var overlay = new google.maps.GroundOverlay(
        scan.overlay_path, 
        new google.maps.LatLngBounds(
            new google.maps.LatLng(scan.south, scan.west),
            new google.maps.LatLng(scan.north, scan.east)
        )
    );
    overlay.setMap(this.map);
};

localground.print.prototype.addContext = function(elem, name, do_clear) {
    if($(elem).val().indexOf(name) != -1 && do_clear)
        $(elem).val('');
    else if($(elem).val().length == '')
        $(elem).val(name);
};
    

localground.print.prototype.setTitle = function() {
    $('#mapTitle').hide(); 
    $('#txtMapTitle').val($('#mapTitle').html()).show().focus().select(); 
};

localground.print.prototype.setInstructions = function() {
    var txt = $('#instructions').html().replace(/<br>/g, '\n');
    $('#instructions').hide(); 
    $('#txtInstructions').val(txt).show().focus().select(); 
};

localground.print.prototype.setTitleComplete = function() {
    $('#mapTitle').html($('#txtMapTitle').val());
    $('#mapTitle_slave').html($('#txtMapTitle').val());
    $('#mapTitle').css({'display': 'block'});
    $('#txtMapTitle').css({'display': 'none'});//.blur(); 
};

localground.print.prototype.setInstructionsComplete = function() {
    var txt = $('#txtInstructions').val().replace(/\n\r?/g, '<br>');
    $('#instructions').html(txt);
    $('#instructions_slave').html(txt);
    $('#instructions').css({'display': 'block'});
    $('#txtInstructions').css({'display': 'none'});//.blur(); 
};


localground.print.prototype.createTable = function(num_rows, table_id) {
    //alert('create table');
    var $thead = $('<thead></thead>');
    var $row = $('<tr></tr>');
    $thead.append($row);
    var $cell = $('<th style="width:5%"></th>')
                    .html('ID')
                    .css({ padding: '15px 10px 15px 10px' });
    $row.append($cell);
    var f = this.form;
    if (f == null) {
        f = { columns: [
                    { width_pct: 32, alias: 'Click to name column...'},
                    { width_pct: 32, alias: 'Click to name column...'},
                    { width_pct: 31, alias: 'Click to name column...'},
                ]
            };
    }
    $.each(f.columns, function() {
        $cell = $('<th></th>')
                    .html(this.alias)
                    .css({
                        width: this.width_pct + '%',
                        padding: '15px 10px 15px 10px' });
        $row.append($cell);
    })
    var $tbody = $('<tbody></tbody>');
    for(i=0; i < num_rows; i++) {
        $row = $('<tr></tr>');
        $row.append($('<td></td>').html('&nbsp;'));
        $.each(f.columns, function() {
            $row.append($('<td></td>').html('<div>&nbsp;</div>'));   
        });
        $tbody.append($row);
    }
    $('#' + table_id)
        .attr('style', 'width: ' + this.table_width + 'px !important')
        //.removeAttr('resizeable')
        .empty()
        .append($thead).append($tbody)
        .show();      
};
localground.print.prototype.renderForm = function() {
    self.toggleFormControls();
    var short_form = $('#short_form').attr('checked');
    var long_form = $('#long_form').attr('checked');
    var is_new = (this.form == null);
    
    if(!short_form && !long_form) { return; }
    
    var resizeable_table_exists = (this.resizableTable != null &&
                                   this.resizableTable.table.attr('resizeable') != null);
    var id = 'paper_form', $container = $('#holder2'), num_rows = 14;
    if(short_form)
        id = 'paper_form_short', $container = $('#holder1'), num_rows = 4;
    
    if (resizeable_table_exists) {
        //clear out the field layout fields:
        $('#tbl').find('tr').each(function(idx){
            if ($(this).find('.close').get(0) && idx > 1) {
                $(this).find('.close').trigger('click');
            }
        });
    }
        
    this.createTable(num_rows, id);    
    var $tbl = $('#' + id);
    this.resizableTable = null; //should avoid a memory leak...
    var opts = {
        prefix: this.prefix,
        columns: this.form.columns
    };
    this.resizableTable = new gentable(opts);
    //this.resizableTable.getDataTypes();
    this.data_types_initialized = true;
    var opts = {
        container: $container,
        table: $tbl ,
        maxWidth: this.table_width - 10,
        afterUpdateFunction: this.afterTableUpdate
    }
    this.resizableTable.initialize(opts);
};

localground.print.prototype.toggleFormControls = function() {
    var short_form = $('#short_form').attr('checked');
    var long_form = $('#long_form').attr('checked');
    //control page display:
    
    //show / hide panels:
    if(!short_form)
       $('#holder1').hide();
    else
        $('#holder1').show(); 
    if(!long_form)
        $('#second_page').hide();
    else
        $('#second_page').show();
        //$('#holder2').hide()
        
    if(!short_form && !long_form) {
        //hide everything
        $('#form').hide();
        $('#form_name').hide();
        $('#cancel_add_new_form').hide();
        return;
    }
    
    var is_new = (this.form == null);
    var has_existing_projects = $('#form option').length > 1;
    
    if(is_new || !has_existing_projects) {
        //show text area:
        $('#form_name').css({'display': 'block'});
        $('#form').hide();
        if(has_existing_projects)
            $('#cancel_add_new_form').show();
    }
    else {
        $('#form').show();
        //$('#form').get(0).selectedIndex = 0;
        $('#form_name').hide();
        $('#cancel_add_new_form').hide();
    }
};

localground.print.prototype.afterTableUpdate = function() {
    if($('#short_form').attr('checked') && $('#long_form').attr('checked')) {
        var $clone = $('#paper_form_short').clone().attr('id', 'paper_form');
        
        //remove controller row (if applicable):
        if($clone.find('thead tr').length > 1)
            $clone.find('thead tr:eq(0)').remove();
        
        //remove controls from header:
        $clone.find('thead tr:eq(0) th').each(function() {
            if($(this).find('input').get(0) != null) {
                $(this).html(
                    $('<div />').addClass('id_col')
                        .html($(this).find('input').val())
                );
            }
        });
        
        //add some more rows:
        while($clone.find('tbody tr').length < 14) {
            $clone.find('tbody').append($clone.find('tbody tr:eq(0)').clone());
        }
        
        $('#holder2').empty().append($clone);
        $('#second_page').show();
    }
    else if(!$('#long_form').attr('checked')) {
        $('#second_page').hide();   
    }
};


localground.print.prototype.getForm = function(id) {
    var the_form = null;
    //alert(JSON.stringify(this.forms));
    $.each(this.forms, function() {
        if(this.id == id && id != -1) {
            the_form = this;
            return;
        }
    });
    //alert(JSON.stringify(the_form));
    $('#form_id').val($('#form').val())
    return the_form;
};

/*localground.print.prototype.validateForm = function() {
    alert('validating form');
    if(!$('#short_form').attr('checked') && !$('#long_form').attr('checked')) {
        alert('NO FORM INCLUDED');
        $('#tbl').find('tr').each(function(idx){
            if ($(this).find('.close').get(0)) {
                $(this).find('.close').trigger('click');
            }
        });
    }
    return;
    var messages = [];
    var msg = 'Enter new project name...';
    if($('#project_id').val() == '-1')
        messages.push('Please assign this print to a project by selecting \
                      a project from the menu.');
    if($('#project_id').val() == 'add') {
        if($('#project_name').val() == msg || $('#project_name').val() == '') {
            messages.push('Please give your new project a name');
        }
    }
    
    //if it's a new form, must have a name and column names:
    msg = 'Enter table name...';
    if($('#form').val() == '-1' && ($('#short_form').attr('checked') ||
                                    $('#long_form').attr('checked'))) {
        if($('#form_name').val() == msg || $('#form_name').val() == '') {
            messages.push('Please give your new table a name');
        }
        $('.column_alias').each(function() {
            if($(this).val() == 'Click to name column...') {
                messages.push('Please name all of your table columns and \
                              assign them a data type.');
                return false;
            }
            return true;
        });
    }
    if(messages.length == 0)
        return true;
    //alert(messages.join('\n'));
    
    try {
        self.displayMessage(messages, {
            title: 'Please fix the following items in order to generate your print:',
            error: true
        });
    } catch(e) {
        alert(e);
        return false;
    }
    return false;
};
*/

