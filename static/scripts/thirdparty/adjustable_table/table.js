gentable = function(opts){
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
	$.extend(this, opts);
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
	
	this.initTable();
	this.afterUpdateFunction();
};

gentable.prototype.adjustHiddenFields = function() {
	var me = this;
	if(this.table == null)
		return;
    var total_width = 0;
    var cell_controllers = this.getControllers();
    
    //get total width:
    cell_controllers.each(function(){
        total_width+=parseFloat($(this).width());  
    });
    
    //populate .column_width values with percentages, based on total width:
    col_sums = 0;
    var pct_width;
    cell_controllers.each(function(idx){
		if (idx > 0) {
			//var alias = $(me.getHeader(idx).find('span')).html();
			var mid = '#id_' + self.prefix + '-' + (idx-1);
			if ($(mid + '-width').get(0) == null)
				$('.add-row').trigger('click');
			$(mid + '-field').val(me.columns[(idx-1)].id);
			$(mid + '-ordering').val(idx);
	
			if(idx == cell_controllers.length-1) {
				$(mid + '-width').val(95-col_sums); //the ID column is always 5%
			}
			else {
				pct_width = parseInt(parseFloat($(this).width())/total_width*100);
				$(mid + '-width').val(pct_width);
				col_sums+=pct_width;
			}	
		}
    });
};

gentable.prototype.renderColNamer = function($elem, idx) {
	var me = this;
	$elem.css({
			'overflow': 'hidden',
			'padding': 0
		})
		.width(me.colWidths[idx]);
	var $col_alias = $('<span />')
					.addClass('column_alias')
					.html($elem.html());
	$elem.empty().append($col_alias);
	
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
	
	if (idx > 0 && me.columns.length > 1) {
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

	}
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
	//me.adjustHeaderData();
};

/*gentable.prototype.adjustHeaderData = function() {
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
}*/


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
	$col = this.getController(col_num);
	$header = this.getHeader(col_num);
	var old_width = $th.width();
	var differential = old_width - w;
	$col.width(w);
	$header.width(w);
	//alert('width / new width: ' + old_width + ',' + w);
	if ($col.next()) {
		var new_width = ($col.next().width()+differential);
		//alert('next column width / new width: ' + $col.next().width() + ',' + new_width);
		$col.next().width(new_width);
		$header.next().width(new_width);
	}
	else {
		//alert('prev column width / new width: ' + $col.prev().width() + ',' + ($col.prev().width()+differential));
		var new_width = ($col.prev().width()+differential);
		//alert('prev column width / new width: ' + $col.prev().width() + ',' + new_width);
		$col.prev().width(new_width);	
		$header.prev().width(new_width);
	}
	/*$.each(this.getControllers(), function(){
		alert($(this).width());	
	})*/
};

gentable.prototype.initTable = function() {
	//alert(this.maxWidth);
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
	//this.table.width(self.maxWidth)
	this.container.empty();
	this.container.append($tbl);
	this.colWidths = [];
	
	//initialize header cells:
	var $controls_row = $('<tr></tr>');
	var $control_cell = null
	$tbl.find('thead tr').each(function(n){
		var num_cols = $(this).find('th').length;
		$(this).find('th').each(function(i){
			if(i == 0) {
				me.colWidths.push(me.maxWidth*.05);
			}
			else {
				w = me.maxWidth*.95/(num_cols-1);
				me.colWidths.push(w);
			}	  
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
				.html( $('<div />').html($(this).html()).css('overflow', 'hidden') );
		});
	});
	
	this.renderVerticalResizer();
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