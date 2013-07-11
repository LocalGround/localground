/**
 * For convenience, this class depends on the global variable "self" which
 * is the main controller object that uses this class.
**/
localground.record = function(opts, color, tableID){
    this.fields = [];
    $.extend(this, opts);
    this.overlay_type = 'record';
	this.managerID = tableID;
    this.iframeURL = '/scans/update-record/embed/?id=' + this.id + '&form_id=' +
                        this.managerID;
    this.infoBubbleParams = {
        edit: { width: 785, height: 285 },
        view: { width: 600, height: 290 }
    };
    
	if(!opts.noMap) {
		//initialize icons in the constructor:
		this.image = 'http://chart.apis.google.com/chart?cht=it&chs=15x15&chco='
		this.image += color + ',000000ff,ffffff01&chl=&chx=000000,0&chf=bg,s,00000000&ext=.png';
		this.iconSmall = this.iconLarge = new google.maps.MarkerImage(this.image,
			// This marker is 20 pixels wide by 32 pixels tall.
			new google.maps.Size(15, 15),
			// The origin for this image is 0,0.
			new google.maps.Point(0,0),
			// The anchor for this image is the base of the flagpole at 0,32.
			new google.maps.Point(7, 7));
	}
};

localground.record.prototype = new localground.point();


localground.record.prototype.setRecordName = function() {
    for(i=0; i<this.fields.length; i++) {
        if(this.fields[i].col_name == 'col_1')
            if(this.fields[i].value) {
                this.name = this.fields[i].value;
                return;
            }
            else {
                if(this.num)
                    this.name = 'Observation #' + this.num;
                else
                    this.name = 'Untitled';
                return;
            }
    }
};

localground.record.prototype.showInfoBubbleView = function(opts) {
    var $contentContainer = $('<div></div>')
                    .css({
                        'width': this.infoBubbleParams.view.width,
                        'height': this.infoBubbleParams.view.height,
                        'margin': '5px 0px 5px 10px',
                        'overflow-y': 'auto',
                        'overflow-x': 'hidden'
                    }).append(this.renderRecord());
    var showHeader = true;
    self.infoBubble.setHeaderText(showHeader ? this.getName().truncate(5) : null);
    self.infoBubble.setFooter(null);    
    self.infoBubble.setContent($contentContainer.get(0)); 
    self.infoBubble.open(self.map, this.googleOverlay);
};

localground.record.prototype.saveIframe = function() {
    var $f =  $('#the_frame').contents().find('form');
    $('#the_frame').contents().find('form').submit();
    
    //update the object & the right-hand panel text:
    this.name =  $f.find('#id_col_1').val();
    for(i=0; i<this.fields.length; i++) {
        this.fields[i].value = $f.find('#id_' + this.fields[i].col_name).val();
    }
    this.renderListing();
};

localground.record.prototype.hasFieldSnippets = function() {
    var hasFieldSnippets = false;
    $.each(this.fields, function() {
        if(this.snippet_url) {
            hasFieldSnippets = true;
            return;
        }
    });
    return hasFieldSnippets;
}

localground.record.prototype.renderRecord = function() {
    var hasFieldSnippets = this.hasFieldSnippets();
    var $tbl = $('<table></table>').addClass('zebra-striped')
    var $thead = $('<thead></thead>');
    var $headerRow = $('<tr></tr>')
                        .append($('<th></th>').html('Field'))
                        .append($('<th></th>').html('Value'))
    if(hasFieldSnippets)
        $headerRow.append($('<th></th>').html('Image'));
        
    $tbl.append($thead.append($headerRow));
             
    $tbody= $('<tbody></tbody>');
    var hasSnippets = false;
    //identifier:
    $row = $('<tr></tr>')
        .append($('<td></td>').html('ID').css({'font-weight': 'bold'}))
        .append($('<td></td>').html(this.id));
    $row.append($('<td></td>').html('&nbsp;'));
    $tbody.append($row);
    
    $.each(this.fields, function() {
        $row = $('<tr></tr>')
                .append($('<td></td>').html(this.col_alias).css({'font-weight': 'bold'}))
                .append($('<td></td>').html(this.value));
        if(this.snippet_url)
            $row.append($('<td></td>').append($('<img />').attr('src', this.snippet_url)));
        else
            $row.append($('<td></td>').html('&nbsp;'));
        $tbody.append($row); 
    });
    $tbl.append($tbody);
    if(hasFieldSnippets) {
        return $tbl;
    }
    else if(this.snippet_url) {
        return $('<div />')
                    .append($('<img />')
                        .attr('src', this.snippet_url)
                        .css({'max-width': '600px'})
                    )
                    .append($tbl);
    }
    else {
        return $tbl;    
    }
};

localground.record.prototype.renderMarkerRecord = function() {
    var $record = $('<div />'), $row = null;
    $.each(this.fields, function() {
        $row = $('<div />');
        $row.append(
                $('<div />')
                    .css({
                        'width': '80px',
                        'display': 'inline-block',
                        'vertical-align': 'top',
                        'text-align': 'right',
                        'font-weight': 'bold'
                    })
                    .html(this.col_alias))
            .append(
                $('<div />')
                    .css({
                        'width': '300px',
                        'margin-left': '5px',
                        'display': 'inline-block',
                        'color': '#666'
                    })
                .html(this.value))
        $record.append($row);
    });
    return $record;
};

localground.record.prototype.renderSlideRecord = function() {
    var $record = $('<div />'), $row = null;
    $.each(this.fields, function() {
        $row = $('<div />');
        $row.append(
                $('<div />')
                    .css({
                        'width': '120px',
                        'display': 'inline-block',
                        'vertical-align': 'top',
                        'text-align': 'right',
                        'font-weight': 'bold',
						'padding': '5px'
                    })
                    .html(this.col_alias))
            .append(
                $('<div />')
                    .css({
                        'width': '300px',
                        'margin-left': '5px',
                        'display': 'inline-block',
                        'color': '#222',
						'padding': '5px'
                    })
                .html(this.value))
        $record.append($row);
    });
	if(this.snippet_url) {
        $record.append(
			$('<div />')
				.append($('<img />')
					.attr('src', this.snippet_url)
					.css({'max-width': '460px'})
			));
    }
    return $record;
};

localground.record.prototype.renderRecordHover = function() {
    var $record = $('<div />'), $row = null;
    $.each(this.fields, function() {
        $row = $('<div />');
        $row.append(
                $('<div />')
                    .css({
                        'width': '90px',
                        'display': 'inline-block',
                        'vertical-align': 'top',
                        'text-align': 'left',
                        'font-weight': 'bold'
                    })
                    .html(this.col_alias + ':'))
            .append(
                $('<div />')
                    .css({
                        'width': '200px',
                        'margin-left': '5px',
                        'display': 'inline-block',
                        'text-align': 'left',
                        'color': '#666'
                    })
                .html(this.value))
        $record.append($row);
    });
    return $record;
};


localground.record.prototype.renderListingImage = function() {
	var $img = $('<img />')
					.addClass(this.getObjectType())
					.attr('src', this.image)
					.attr('id', 'img_' + this.getObjectType() + '_' + this.id)
					.css({
                        'vertical-align': 'baseline',
                        'cursor': 'pointer'
                    });
	if(this.file_name_orig != null)
		$img.attr('title', this.file_name_orig);   
	if(this.lat == null) { $img.addClass('can_drag'); }
    var me = this;
    if($('#record_preview').get(0) == null) {
        $('body').append(
            $('<div></div>').css({
                width: 350,
                height: 150,
                'background-color': '#FFF',
                position: 'absolute',
                padding: 3,
                'overflow-y': 'auto'
            })
            .attr('id', 'record_preview')
            .addClass('thumb')
            .hide()
        );
    }
    $img.hover(function() {
            $('#record_preview').empty().append(me.renderRecordHover()).css({
                'top': $(this).offset().top - 75,  
                'left': $(this).offset().left-360     
            }).show();  
        },
        function() {
            $('#record_preview').hide();
        });
	return $img;
};

