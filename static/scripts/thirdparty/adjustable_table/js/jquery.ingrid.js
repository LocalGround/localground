/**
 * Ingrid : JQuery Datagrid Control
 *
 * Copyright (c) 2007-2009 Matthew Knight (http://www.reconstrukt.com http://slu.sh)
 * 
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * @requires jQuery v1.2+
 * @version 0.9.3
 */

jQuery.fn.ingrid = function(o){

	var cfg = {
		height: 200, 							// height of our datagrid (scrolling body area)
		activeControl: null,
		savedStateLoad : false,					// when Ingrid is initialized, should it load data from a previously saved state?
		initialLoad : false,					// when Ingrid is initialized, should it load data immediately?

		colWidths: [80,225,225,225],			// width of each column
		minColWidth: 60,						// minimum column width
		headerHeight: 30,						// height of our header
		headerClass: 'grid-header-bg',			// header bg
		resizableCols: true,					// make columns resizable via drag + drop
		
		gridClass: 'datagrid',					// class of head & body
		
		/* should seldom change */
		resizeHandleHtml: '',					// resize handle html + css
		resizeHandleClass: 'grid-col-resize',
		scrollbarW: 22,							// width allocated for scrollbar
		columnIDAttr: '_colid',					// attribute name used to groups TDs in columns
		ingridIDPrefix: '_ingrid',				// prefix used to create unique IDs for Ingrid
		
		
		/* not yet implemented */
		minHeight: 100,
		resizableGrid: true,
		dragDropCols: true,
		sortType: 'server|client|none',
		
		/* cfg functions */
		isSortableCol : function(colIndex) {
			if (cfg.unsortableCols.length==0 || jQuery.inArray(colIndex, cfg.unsortableCols)==-1) {
				return true;
			}
			return false;
		}
		
	};
	jQuery.extend(cfg, o);
	$(document).click(function() {
        $('.dropdown-menu').hide();
    });
	$('#data_options a').click(function(){
		cfg.activeControl.find('span').html('(' + $(this).html() + ')')
		cfg.activeControl.find('input').val($(this).html())
	});
	
	var cols = new Array();
	var a = $('<a href="#" >add new</a>')
				.click(function() {
					var new_width = cfg.colWidths[cfg.colWidths.length-1]/2
					cfg.colWidths[cfg.colWidths.length-1] = new_width;
					cfg.colWidths.push(new_width);
					$('#the_table').find("tr").each(function(index){
						if(index == 0) {
							//new_width = $(this).find("th:eq("+idx+")").width();
							var lastTDClone = $(this).find('th:last').clone();
							$(this).find('th:last').after(lastTDClone);
						}
						else {
							var lastTDClone = $(this).find('td:last').clone();
							$(this).find('td:last').after(lastTDClone);	
						}
						//$(this).find("th:eq("+idx+")").remove();
						//$(this).find("td:eq("+idx+")").remove();
						//$(rows[i]).find('td:last').after(lastTDClone);

					});
				});
	var h = $('<table id="the_table" cellpadding="0" cellspacing="0"></table>')
					.append(this.find('thead'))
					.append(this.find('tbody'))
					.addClass(cfg.gridClass)
					//.addClass(cfg.headerClass)
					.height(cfg.headerHeight)
					.extend({
						cols : cols
					});
	// initialize columns
	h.find('th').each(function(i){
														 
		// init width
		$(this).width(cfg.colWidths[i]);

		if(i > 0) {
			var $renamer = $('<input type="text" value="" class="col_input" />')
							.css({
								width: $(this).width()-50
							})
							.val($(this).html())
							.click(function(){
								$(this).focus().select()	
							})
							.keypress(function(event){
								if(event.keyCode == 13){
									$(this).blur();
								}
							});
			if(i > 1) {
				var $close_button = $('<div class="close" title="delete column" href="#">×</div>')
					//.attr('id', 'col_' + i)
					.css({float: 'left', cursor: 'pointer', border: 'none'})
					.click(function(){
						var $th = $(this).parent('th');
						var $tr = $th.parent('tr');
						var idx = $tr.children().index($th);
						cfg.colWidths.splice(idx, 1);
						var new_width = 0, old_width = 0;
						$('#the_table').find("tr").each(function(index){
							if(index == 0)
								new_width = $(this).find("th:eq("+idx+")").width();
							$(this).find("th:eq("+idx+")").remove();
							$(this).find("td:eq("+idx+")").remove();
						});
						//resize last column:
						idx = $tr.children().length-1;
						old_width = cfg.colWidths[idx];
						$('#the_table').find("tr").each(function(index){
							/*if(index == 0) {
								old_width = $(this).find("th:eq("+idx+")").width();
								alert(old_width + ',' + new_width);
							}*/
							$(this).find("th:eq("+idx+")").css({width: old_width+new_width});
							$(this).find("td:eq("+idx+")").css({width: old_width+new_width});
						});
					});
				$(this).empty().append($close_button).append($renamer);
			} else {
				$(this).empty().append($renamer);	
			}
		} else {
			//first column is read only
			var txt = $(this).html();
			$(this).empty().append($('<div class="id_col"></div>').html(txt));	
		}
		
		// bind an event to easily resize columns
		$(this).bind('resizeColumn', {col_num : i}, function(e, w){
			var maxWidth = 800;
			var col_num = i;
			cfg.colWidths[col_num] = w;
			var totalPotentialWidth = w;
			g.getHeaders().each(function(i){
				if(i != col_num) {
					totalPotentialWidth += $(this).width();
				}
			});
			var differential = totalPotentialWidth-maxWidth;
			if(col_num+1 == g.getHeaders().length) {
				w = w-differential;
			} else {
				var $next_col = $(g.getHeaders()[col_num+1]);
				var new_width = $next_col.width()-differential;
				$next_col.width(new_width);
				$next_col.find('input').width(new_width-40);
			}
			$(this).width(w);
			$(this).find('input').width(w-40);

		});
		
		// make column headers resizable
		var handle = $('<div />').html(cfg.resizeHandleHtml == '' ? '-' : cfg.resizeHandleHtml).addClass(cfg.resizeHandleClass);
		handle.bind('mousedown', function(e){
			// start resize drag
			var th 		= $(this).parent();
			var left  = e.clientX;
			z.resizeStart(th, left);
		});
		$(this).append(handle);
		if(i != 0) {
			var $control = $('<div />')
					.attr('id', 'datacontrol_' + i)
					.attr('title', 'change data type')
					.css({
						float: 'left',
						clear: 'left',
						cursor: 'pointer',
						'margin-top': -3
					}).click(function(){
						cfg.activeControl = $(this);
						if($('#data_options').is(':visible')) {
							$('#data_options').hide();
						} else {
							$('#data_options').show().css({
								top: $(this).position().top + 15,
								left: $(this).position().left
							});
						}
						return false;
					});
			$control
				.append($('<div />').addClass('sprite ui-icon-bottom-triangle'))
				.append($('<span />').html('(Text)').css({float: 'left'}))
				.append($('<input type="hidden" value="" name="data_type_' + i + '" />'));
			$(this).append($control);
			
		}
		else {
			//use attr('style') to honor !important (.css() ignores it)
			$(this)
				.append($('<span />').html('(Integer)')
				.attr('style', 'margin-top: -8px !important; \
					  margin-left: 5px !important; float:left; clear:left'));	
		}
	});
	
	// create a vertical resize divider, with unique ID
	var z_sel = 'vertical-resize-divider' + new Date().getTime();
	var z	= $('<div id="' + z_sel + '"></div>')
					.css({
						backgroundColor: '#ababab', 
						height: (cfg.headerHeight + cfg.height),
						width: '4px',
						position: 'absolute',
						zIndex: '10',
						display: 'block'
					})
					.extend({
						resizeStart : function(th, eventX){
							// this is fired onmousedown of the column's resize handle 						
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
								if (col_w > cfg.minColWidth) {
									$('#' + z_sel).css('left', e.clientX);										
								}																		
							})
							$('body').bind('mouseup', {col : th}, function(e){
								// on mouseup, 
								// 1.) unbind resize listener events from body
								// 2.) hide the vertical-resize-divider
								// 3.) trigger the resize event on the column
								$(this).unbind('mousemove').unbind('mouseup');
								$('#' + z_sel).hide();
								var th 		= e.data.col;
								var pos		= th.offset();
								var col_w	= e.clientX - pos.left;
								
								//$(th).children().first().width(col_w-40); //.next().width(col_w-20);
								if (col_w > cfg.minColWidth) {
									th.trigger('resizeColumn', [col_w]);
								} else {
									th.trigger('resizeColumn', [cfg.minColWidth]);
								}
							})
						}
					});
	
	// create a container div to for our main grid object
	// append & extend grid {g} with header {h}, body {b}, paging {p}, resize handle {z}
	var g = $('<div />').append(a).append(h).extend({
		a : a,
		h : h
	});
	g.append(z.hide()).extend({ z : z });

	// create methods on our grid object
	g.extend({
		// returns <th> els
		getHeaders : function(cb) {
			var ths = this.find('th');
			if (cb) {
				ths.each(function(){
					cb($(this));							 
				});
				return this;
			} else {
				return ths;
			}
		},
		
		// returns single <th> el
		getHeader : function(i, cb) {
			var th = this.find('th').slice(i, i+1);
			if (cb) {
				cb($(this));
				return this;
			} else {
				return th;
			}
		},
		
		
		getRows : function(cb) {
			var trs = this.find("tbody tr");
			if (cb) {
				trs.each(function(){
					cb($(this));							 
				});
				return this;
			} else {
				return trs;							 
			}
		},
		
		initStylesAndWidths : function() {
			
			// alert('setting styles and widths')
			
			var colWidths = new Array();
			this.getHeaders().each(function(i){
				// don't use width() - makes column headers jitter
				// colWidths[i] = $(this).width();
				colWidths[i] = $(this).css('width');
			});

			this.getRows().each(function(r){
				// setup column IDs & classes on row's cells
				$(this).find('td').each(function(i){
					// column IDs & width
					// wrap the cell text in a div with overflow hidden, so cells aren't stretched wider by long text
					var txt = $(this).html();
					$(this).attr(cfg.columnIDAttr, i)
											.width(colWidths[i])
											.html( $('<div />').html(txt).css('overflow', 'hidden') );
				});
			});
		}			
	});
	

	return this.each(function(tblIter){

		// append to doc
		var g_id = 	cfg.ingridIDPrefix + '_' + $( this ).attr('id') + '_' + tblIter;
		g.attr( 'id', g_id );
		$( this ).replaceWith( g[0] )

		// init grid styles, etc
		g.initStylesAndWidths();
		
		// sync grid size to headers
		g.resize();
		
		if (cfg.initialLoad) {
			g.load();
		}

	}).extend({
		g : g
	});

};

