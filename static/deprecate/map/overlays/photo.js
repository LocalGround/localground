/**
 * For convenience, this class depends on the global variable "self" which
 * is the main controller object that uses this class.
**/
localground.photo = function(opts){
    this.managerID = null;
    $.extend(this, opts);
	this.iframeURL = '/scans/update-' + this.overlay_type + '/embed/?id=' + this.id;
    //initialize icons in the constructor:
    this.image = this.path_marker_sm;
    this.iconSmall = new google.maps.MarkerImage(this.path_marker_sm,
        new google.maps.Size(20, 20),		// size (width, height)
        new google.maps.Point(0,0),		// origin (x, y)
        new google.maps.Point(10, 10));		// anchor (x, y)
	
    this.iconLarge = new google.maps.MarkerImage(this.path_marker_lg,
        new google.maps.Size(52, 52),		// size (width, height)
        new google.maps.Point(0,0),		// origin (x, y)
        new google.maps.Point(26, 26));		// anchor (x, y)
	
    this.imgSmall = this.path_small;
    this.imgMediumSm = this.path_medium_sm;
    this.imgMedium = this.path_medium;
    this.bubbleWidth = 320;
    this.bubbleHeight = 330;
};

localground.photo.prototype = new localground.point();

localground.photo.prototype.renderListingImage = function() {
	var me = this;
    var $imgPreview = $('#image_preview');
    if($imgPreview.get(0) == null) {
        $imgPreview = $('<img />').css({
            'position': 'absolute',
            'z-index': 200
        }).addClass('thumbsmall').hide();
        $('body').append($imgPreview );
    }
    var $img = $('<img />')
		    .addClass(this.managerID)
		    .attr('src', this.image)
		    .attr('id', 'img_' + this.managerID + '_' + this.id)
		    .css({'vertical-align': 'baseline'})
                    .hover(function() {
                        $imgPreview.attr('src', me.path_small).css({
                            'top': $(this).offset().top+24,  
                            'left': $(this).offset().left-5     
                        }).show();  
                    }, function() {
                        $imgPreview.hide()    
                    }).click(function() {
                        me.zoomToOverlay();
                        return false;
                    });
	if(this.file_name_orig != null)
	    $img.attr('title', this.file_name_orig);   
	$img.addClass('thumbsmall');   
	if(this.lat == null) { $img.addClass('can_drag'); }
	return $img;
};

localground.photo.prototype.getIcon = function() {
    if(self.map.getZoom() > 18)
	return this.imgSmall;
    else if(self.map.getZoom() > 16)
	return this.iconLarge;
    else
        return this.iconSmall;
};

localground.photo.prototype.setImageIcon = function(list) {
    if(this.googleOverlay) {
        var icon = this.getIcon();
        if(this.googleOverlay.map != null && icon != this.googleOverlay.icon) {
            this.googleOverlay.setIcon(icon);
	    this.googleOverlay.setMap(null);
            this.googleOverlay.setMap(self.map);    
        }
    }
};

localground.photo.prototype.showInfoBubbleEdit = function(opts){
    if (opts == null)
	opts = {};
    $.extend(opts, {
	height: '400px',
	width: this.bubbleWidth + 30
    });
    var $contentContainer = this.renderInfoBubble(opts);
    var me = this;
    var fields = this.getManager().getUpdateSchema();
    var form = new ui.form({
        schema: fields,
        object: this,
        exclude: ['geometry', 'project_id']
    });
    var $container = $('<div />');
    $container.append(this.getPhotoPreview({
					    height: this.bubbleHeight - 160,
					    width: (this.bubbleWidth + 30)
				    }));
    $container.append(
	$('<div />')
	.css({'text-align': 'center'})
	.append($('<a href="#" />').html('rotate left').click(
	    function(){
		$.ajax({
		    url: '/api/0/photos/' + me.id + '/rotate-left/.json',
		    type: 'PUT',
		    success: function(data) {
			$.extend(me, data);
			$('#preview_' + me.id).attr('src', data.path_medium);
		    },
		    notmodified: function(data) { alert('Not modified'); },
		    error: function(data) { alert('Error'); }
		});
		return false;
	    }
	))
	.append(' | ')
	.append($('<a href="#" />').html('rotate right').click(
	    function(){
		$.ajax({
		    url: '/api/0/photos/' + me.id + '/rotate-right/.json',
		    type: 'PUT',
		    success: function(data) {
			$.extend(me, data);
			$('#preview_' + me.id).attr('src', data.path_medium);
		    },
		    notmodified: function(data) { alert('Not modified'); },
		    error: function(data) { alert('Error'); }
		});
		return false;
	    }
	))	
    );
    $container.append(form.render());
    $contentContainer.append($container);
};

localground.photo.prototype.getPhotoPreview = function(opts) {
    var me = this;
    var height = this.bubbleHeight - 100;
    var width = this.bubbleWidth;
    if (opts) {
	height = opts.height || height;
	width = opts.width || width;
    }
    return  $('<div />')
	.css({
	    'max-width': width,
	    'height': height,
	    'overflow': 'hidden',
	    'background-image': 'url("/static/images/fabric_bg.png")'
	})
	.append(
	    $('<img />').css({
		'display': 'block',
		'max-width': width,
		'max-height': height + 40,
		'min-height': height,
		'margin-right': 'auto',
		'margin-left': 'auto',
		'margin-top': '0px'
	    })
	    .attr('src', this.path_medium)
	    .attr('id', 'preview_' + me.id)
	    .addClass('dragclass')
	);
};

localground.photo.prototype.showInfoBubbleView = function(opts) {
    //ensures that the marker renders on top:
    this.googleOverlay.setMap(null);
    this.googleOverlay.setMap(self.map);

    //build bubble content:
    var $container = $('<div />');
    $container.append(this.getPhotoPreview());
    $container.append(this.renderDetail());
    
    var $contentContainer = this.renderInfoBubble(opts);
    $contentContainer.append($container);
};

localground.photo.prototype.mouseoverF = function(){
    if(self.hideTip){ return; }
    var $innerObj = $('<div />')
			.append($('<img />')
			    .attr('src', self.currentOverlay.path_marker_lg)
			    .css({float: 'left', 'margin-right': '5px'}))
			.append($('<p />').html(self.currentOverlay.getName())
						.css({'font-weight': 'bold', 'margin-bottom': '0px'})
			).append($('<p />').html(self.currentOverlay.caption));
    this.showTip({
	width: '200px',
	height: '50px',
	overflowY: 'hidden',
	contentContainer: $innerObj 
    });
};
