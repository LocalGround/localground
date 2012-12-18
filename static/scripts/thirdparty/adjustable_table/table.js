gentable = function(){
	this.table = null;
	this.addButton = null;
    this.height = 200;
	this.resizer = null;
	this.activeHeaderCell = null;
	this.container = null;
	this.colWidths = null;
	this.maxWidth = 700.0;
	this.maxCols = 5; // + ID col
	this.minColWidth = 60;		
	this.headerClass = 'grid-header-bg';
	this.gridClass = 'datagrid';
	this.resizeHandleHtml = '';				
	this.resizeHandleClass = 'grid-col-resize';
	this.text_data_type = 1;//in database
	this.int_data_type = 2;//in database
	this.initDataTypes = false;
	this.afterUpdateFunction = this.adjustHiddenFields();
};

//table.prototype = new base(); // inherits from base 

gentable.prototype.initialize = function(opts) {
	//alert('initializing');
	var me = this;
	this.container = opts.container || $('body');
	this.table = opts.table || $('#table1');
	this.initDataTypes = opts.initDataTypes || this.initDataTypes;
	this.maxWidth = opts.maxWidth || this.maxWidth;
	if(opts.afterUpdateFunction) {
		this.afterUpdateFunction = function() {
			this.adjustHiddenFields();
			opts.afterUpdateFunction();
		}
	}
	$(document).click(function() {
        $('.dropdown-menu').hide();
    });
	
	if(this.initDataTypes)
		this.getDataTypes();
	this.initTable();
	this.afterUpdateFunction();
};

gentable.prototype.adjustHiddenFields = function() {
	if(this.table == null)
		return;
    var total_width = 0;
    var cell_headers = this.table.find('thead tr:eq(0)').children();
    
    //get total width:
    cell_headers.each(function(){
        total_width+=parseFloat($(this).width());  
    });
    
    //populate .column_width values with percentages, based on total width:
    col_sums = 0;
    var pct_width;
    cell_headers.each(function(idx){
        if(idx == $('.column_width').length-1) {
            $(this).find('.column_width').val(100-col_sums);
        }
        else {
            if(idx == 0)
                pct_width = 5 //id column always 5%
            else
                pct_width = parseInt(parseFloat($(this).width())/total_width*100);
            $(this).find('.column_width').val(pct_width);
            col_sums+=pct_width;
        } 
    });
};

gentable.prototype.getDataTypes = function() {
	var me = this;
    $.get('/print/forms/get-types/',
        function(result){
			//clear out old values:
			$('#column_options').empty();
			
			$('#column_options').append(
				$('<li></li>').append(
					$('<a></a>')
					//.addClass('data_options')
					.attr('href', '#')
					.attr('id', 'delete_column')
					.click(function(event) {
						me.deleteColumn(me.activeHeaderCell);
						$('.dropdown-menu').hide();
						me.afterUpdateFunction();
						return false;
					})
					.append($('<span></span>').html('Delete Column'))
				)
			);
			$('#column_options').append(
				$('<li></li>').addClass('divider'))
			
			$.each(result.types, function() {
                $('#column_options').append(
                    $('<li></li>').append(
                        $('<a></a>')
                        .addClass('data_options')
                        .attr('href', '#')
                        .attr('id', this.id)
                        .click(function(event) {
							me.activeHeaderCell.find('.column_type').val($(this).attr('id'));
                            me.activeHeaderCell.find('span').html('(' + $(this).find('span').html() + ')');
							$('.dropdown-menu').hide();
							me.afterUpdateFunction();
							return false;
                        })
                        .append($('<div></div>').addClass('sprite ui-icon-check'))
                        .append($('<span></span>').html(this.name))
                    )
                );	
            });
			
            //Initialize everything to text
            $('.column_type').val(1); //1 = Text data type
        },
    'json');
	  
};


gentable.prototype.appendButtonAddColumn = function() {
	var me = this;
	this.addButton = $('<div id="addCol" />').append(
					$('<a href="#">add column</a>')
						.click(function() {
							me.addColumn();
							if(me.getHeaders().length > me.maxCols)
								$(this).parent().css({'visibility': 'hidden'});
							me.afterUpdateFunction();
							return false;
						}))
					.append(' (up to 5)');
	this.container.append(this.addButton);
};

gentable.prototype.renderColNamer = function($elem, idx) {
	var me = this;
	$elem.css({
			'overflow': 'hidden',
			'padding': 0
		})
		.width(me.colWidths[idx]);
	if(idx > 0) {
		var $renamer = $('<input />')
						.attr('type', 'text')
						.addClass('column_alias')
						.val($elem.html())
						.click(function(){
							$(this).focus().select()	
						})
						.keypress(function(event){
							if(event.keyCode == 13){
								$(this).blur();
								me.afterUpdateFunction();
								return false;
							}
							return true;
						});
		$elem.empty().append($renamer);
	} else {
		//first column is read only
		var txt = $elem.html();
		$elem.empty().append($('<div class="id_col"></div>').html(txt));	
	}	
};

gentable.prototype.renderHeaderCell = function($elem, idx) {
	var me = this;
	// init width
	$elem.css({
		'background-color': '#eee',
		'border-bottom': 'solid 1px #999',
		'cursor': 'pointer',
		'padding': 0
	}).width(me.colWidths[idx]);
		
	$elem.bind('resizeColumn', function(e, w){
		me.resizeIt($(this), idx, w, true);
		me.afterUpdateFunction();
	});
	
	// make column headers resizable
	var handle = $('<div />')
					.html(me.resizeHandleHtml == '' ? '-' : me.resizeHandleHtml)
					.addClass(me.resizeHandleClass);
	handle.bind('mousedown', function(e){
		// start resize drag
		var th 		= $(this).parent();
		var left  = e.clientX;
		me.resizer.resizeStart(th, left);
	});
	$elem.append(handle)
	this.appendDataTypeControl(idx, $elem);
	return $elem;	
};

gentable.prototype.deleteColumn = function($th) {
	//alert($th);
	var me = this;
	var $tr = $th.parent('tr');
	var n = $tr.children().index($th);
	this.colWidths.pop();
	this.table.find("tr").each(function(index){
		$(this).find("th:eq("+n+")").remove();
		$(this).find("td:eq("+n+")").remove();
	});
	me.adjustHeaderData();
};

gentable.prototype.adjustHeaderData = function() {
	var me = this;
	var id_col_width = 60
	var new_width = (this.maxWidth-id_col_width)/(this.colWidths.length-1);
	this.getControllers().each(function(index) {
		var width = new_width;
		if(index == 0)
			width = id_col_width;

		//1) resize columns
		me.colWidths[index] = width;	
		me.resizeIt($(this), index, width, false);
		
		//2) update form field names:
		$(this).find('.column_type').attr('name', 'type_' + index);
		$(this).find('.column_width').attr('name', 'width_' + index);
	});
	this.getHeaders().each(function(index) {
		$(this).find('.column_alias').attr('name', 'alias_' + index);
	});
	
	if(this.colWidths.length <= this.maxCols)
		$('#addCol').css({'visibility': 'visible'});
	else
		$('#addCol').css({'visibility': 'hidden'});
	if(this.colWidths.length > 2)
		$('.close').show();
	else
		$('.close').hide();
}

gentable.prototype.addColumn = function() {
	var me = this;
	this.table.find("tr").each(function(index){
		if(index == 0) {
			$th = $('<th></th>').html('');
			me.renderHeaderCell($th, me.colWidths.length);
			$(this).find('th:last').after($th);
		}
		else if(index == 1) {
			$th = $('<th></th>').html('Click to name column...');
			me.renderColNamer($th, me.colWidths.length);
			$(this).find('th:last').after($th);
			
		} 
		else {
			$td = $('<td></td>').append('<div>&nbsp;</div>');
			$(this).find('td:last').after($td);
		}
		
	});
	//just add an arbitrary width for new column (will be adjusted later)
	this.colWidths.push(100)
	this.adjustHeaderData();
};


gentable.prototype.appendDataTypeControl = function(idx, $th) {
	var me = this;
	var $control = $('<div />')
		.attr('id', 'datacontrol_' + idx)
		.attr('title', 'Column Options')
		.addClass('sprite-small ui-icon-bottom-triangle-small border-rounded')
		.css({
			float: 'left',
			cursor: 'pointer'
		})
		.attr('style', 'margin: 4px 0px 0px 4px !important')
		.click(function(event){
			me.toggleMenu($(this));
			return false;
		});
	var data_type = this.text_data_type, type_name = '(Text)';
	if(idx == 0)
		data_type = this.int_data_type, type_name = '(Integer)';
	$header = $('<div />')
		.append($('<span />').html(type_name).css({float: 'left'})
						.attr('style', 'margin-top: 0px !important;'))
		.append($('<input />').attr('type', 'hidden').attr('name', 'type_'+idx)
					.addClass('column_type')
					.val(data_type))
		.append($('<input />').attr('type', 'hidden').attr('name', 'width_'+idx)
					.addClass('column_width')
					//.css({width: 40})
					.val(''));
	if(idx != 0) {
		$header.append($control);
		$header.click(function(){
			$(this).find('.sprite-small').trigger('click');
			return false;
		});
	}
	$th.append($header);
};

gentable.prototype.toggleMenu = function($elem) {
	this.activeHeaderCell = $elem.parent('div').parent('th');
	var me = this;
	if($('#column_options').is(':visible')) {
		$('#column_options').hide();
	} else {
		$('#column_options').show().css({
			top: $elem.position().top+15,
			left: $elem.position().left+4,
			'border-top': 'solid 1px #ccc'
		});
		$('#column_options').find('.data_options').each(function() {
			if(me.activeHeaderCell.find('.column_type').val() == $(this).attr('id'))
				$(this).find('div').show();
			else
				$(this).find('div').hide();
		});
	}
};

gentable.prototype.resizeIt = function($th, col_num, w, adjust_next) {
	var me = this;
	$renamer = this.getHeader(col_num);
	var padding = Math.abs($renamer.find('.column_alias').width() -
						   $renamer.find('.column_alias').outerWidth());
	//alert(padding);
	if(adjust_next) {
		//figure out width differential:
		this.colWidths[col_num] = w;
		var totalPotentialWidth = w;
		this.getHeaders().each(function(i){
			if(i != col_num)
				totalPotentialWidth += $(this).width();
		});
		var differential = totalPotentialWidth-this.maxWidth;
		
		if(col_num+1 == me.getHeaders().length) {
			w = w-differential;
		} else {
			var $next_col = me.getController(col_num+1);
			var new_width = $next_col.width()-differential;
			$next_col.width(new_width);
			//$next_col.find('.column_width').val(new_width);
			$renamer_next = this.getHeader(col_num+1);
			$renamer_next.width(new_width)
			$renamer_next.find('.column_alias').width(new_width-padding);
		}
	}
	$th.width(w);
	//$th.find('.column_width').val(w);
	$renamer.width(w)
	$renamer.find('.column_alias').width(w-padding);
};

gentable.prototype.initTable = function() {
	var me = this;
	this.tableID = this.table.attr('id');
	var $tbl = $('<table cellpadding="0" cellspacing="0"></table>')
					.css({width: this.maxWidth})
					.attr('id', this.tableID)
					.attr('resizeable', true)
					.append(this.table.find('thead'))
					.append(this.table.find('tbody'))
					.addClass(me.gridClass);
	this.table.remove();
	this.table = $tbl;
	this.container.empty();
	this.appendButtonAddColumn();
	this.container.append($tbl);
	this.colWidths = [];
	
	//initialize header cells:
	var $controls_row = $('<tr></tr>');
	var $control_cell = null
	$tbl.find('thead tr').each(function(n){
		$(this).find('th').each(function(i){
			me.colWidths.push(10); // this width is arbitrary and will be adjusted later
			
			//render new controls cell (and add to new row):
			$control_cell = $('<th></th>');
			me.renderHeaderCell($control_cell, i);	
			$controls_row.append($control_cell);
	
			//render column renaming cell based on current header cell:
			me.renderColNamer($(this), i);	
		});
		$(this).before($controls_row);
	});
	
	//initialize data cells:
	this.getRows().each(function(r){
		$(this).find('td').each(function(i){
			$(this)
				.width(me.colWidths[i])
				.html( $('<div />').html($(this).html()).css('overflow', 'hidden') );
		});
	});
	
	this.renderVerticalResizer();
	this.adjustHeaderData(); //applies names and widths, based on positioning
};

gentable.prototype.renderVerticalResizer = function() {
	// create a vertical resize divider, with unique ID
	var me = this;
	var z_sel = 'vertical-resize-divider' + new Date().getTime();
	this.resizer = $('<div id="' + z_sel + '"></div>')
			.css({
				backgroundColor: '#ababab', 
				height: (me.height),
				width: '4px',
				position: 'absolute',
				zIndex: '10',
				display: 'none'
			})
			.extend({
				resizeStart : function(th, eventX){
					// this is fired onmousedown of the column's resize handle
					$('table, td, th, div, input').addClass('disable_select');
					var pos	= th.offset();
					$(this).show().css({
						top: pos.top,
						left: eventX
					})
					// when resizing, bind some listeners for mousemove & mouseup events
					$('body').bind('mousemove', {col : th}, function(e){		
						// on mousemove, move the vertical-resize-divider
						var th 		= e.data.col;
						var pos		= th.offset();
						var col_w	= e.clientX - pos.left;
						// make sure cursor isn't trying to make column smaller than minimum
						if (col_w > me.minColWidth) {
							$('#' + z_sel).css('left', e.clientX);										
						}																		
					})
					$('body').bind('mouseup', {col : th}, function(e){
						// on mouseup, 
						// 1.) unbind resize listener events from body
						// 2.) hide the vertical-resize-divider
						// 3.) trigger the resize event on the column
						
						$('table, td, th, div, input').removeClass('disable_select');
						$(this).unbind('mousemove').unbind('mouseup');
						$('#' + z_sel).hide();
						var th 		= e.data.col;
						var pos		= th.offset();
						var col_w	= e.clientX - pos.left;
						
						if (col_w > me.minColWidth) {
							th.trigger('resizeColumn', [col_w]);
						} else {
							th.trigger('resizeColumn', [me.minColWidth]);
						}
					})
				}
			});
	this.container.append(this.resizer);
};

gentable.prototype.getController = function(idx) {
	return this.table.find('thead tr:eq(0) th:eq(' + idx + ')');
};

gentable.prototype.getHeader = function(idx) {
	return this.table.find('thead tr:eq(1) th:eq(' + idx + ')');
};

gentable.prototype.getControllers = function() {
	return this.table.find('thead tr:eq(0)').children();
};

gentable.prototype.getHeaders = function() {
	return this.table.find('thead tr:eq(1)').children();
};
		
gentable.prototype.getRows  = function() {
	return this.table.find("tbody tr");
};

gentable.prototype.move = function($container, num_rows) {
	$container.empty().show();
	this.addButton.show().appendTo($container);
	this.table.show().appendTo($container);
	if(this.getRows.length != num_rows) {
		$row = this.table.find('tbody tr:eq(0)').clone();
		this.table.find('tbody').empty();
		while(this.table.find('tbody tr').length < num_rows) {
			this.table.find('tbody').append($row.clone());
		}
	}
};