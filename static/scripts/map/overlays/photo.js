/**
 * For convenience, this class depends on the global variable "self" which
 * is the main controller object that uses this class.
**/
localground.photo = function(opts){
    $.extend(this, opts);
	this.managerID = this.overlayType = self.overlayTypes.PHOTO;
    this.iframeURL = '/scans/update-' + this.overlayType + '/embed/?id=' + this.id;
    //initialize icons in the constructor:
    this.image = this.path_marker_sm;
    this.iconSmall = new google.maps.MarkerImage(this.path_marker_sm,
        new google.maps.Size(20, 20),		// size (width, height)
        new google.maps.Point(0,0),			// origin (x, y)
        new google.maps.Point(10, 10));		// anchor (x, y)
	
    this.iconLarge = new google.maps.MarkerImage(this.path_marker_lg,
        new google.maps.Size(52, 52),		// size (width, height)
        new google.maps.Point(0,0),			// origin (x, y)
        new google.maps.Point(26, 26));		// anchor (x, y)
	
	this.imgSmall = this.path_small;
	this.imgMediumSm = this.path_medium_sm;
	this.imgMedium = this.path_medium;

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
					.addClass(this.getObjectType())
					.attr('src', this.image)
					.attr('id', 'img_' + this.getObjectType() + '_' + this.id)
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

localground.photo.prototype.showInfoBubbleView = function(opts) {
    if(self == null) {
        alert('The variable self should be set to the map controller in the \
                parent class');
        return;
    }
    //ensures that the marker renders on top:
    this.googleOverlay.setMap(null);
    this.googleOverlay.setMap(self.map);

    //build bubble content:
    var htmlString = '<img class="thumb" style="max-width:400px;margin-right:30px;" src="' +
        this.path_medium + '" />';
    if(this.caption && this.caption.length > 4)
        htmlString += '<br /><p>' + this.caption + '</p>';
    
    var $contentContainer = $('<div></div>').css({
            'width': '440px',
            'height': '320px',
            'margin': '5px 0px 5px 10px',
            'overflow-y': 'auto',
            'overflow-x': 'hidden'
        }).append(htmlString);
    var showHeader = true;
    self.infoBubble.setHeaderText(showHeader ? this.name.truncate(5) : null);
    self.infoBubble.setFooter(null);    
    self.infoBubble.setContent($contentContainer.get(0)); 
    self.infoBubble.open(self.map, this.googleOverlay);
};

