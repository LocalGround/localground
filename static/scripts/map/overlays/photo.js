/**
 * For convenience, this class depends on the global variable "self" which
 * is the main controller object that uses this class.
**/
localground.photo = function(opts){
    $.extend(this, opts);
    this.overlayType = 'photo';
    this.iframeURL = '/scans/update-' + this.overlayType + '/embed/?id=' + this.id;
    //initialize icons in the constructor:
    this.image = this.path_marker_sm;
    this.iconSmall = this.iconLarge = new google.maps.MarkerImage(this.path_marker_sm,
        // This marker is 20 pixels wide by 32 pixels tall.
        new google.maps.Size(20, 20),
        // The origin for this image is 0,0.
        new google.maps.Point(0,0),
        // The anchor for this image is the base of the flagpole at 0,32.
        new google.maps.Point(10, 10));
    this.iconLarge = this.iconLarge = new google.maps.MarkerImage(this.path_marker_lg,
        // This marker is 20 pixels wide by 32 pixels tall.
        new google.maps.Size(52, 52),
        // The origin for this image is 0,0.
        new google.maps.Point(0,0),
        // The anchor for this image is the base of the flagpole at 0,32.
        new google.maps.Point(26, 26));
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
    if(self.map.getZoom() > 16)
        return this.iconLarge;
    else
        return this.iconSmall;
};

localground.photo.prototype.setImageIcon = function(list) {
    if(this.googleOverlay) {
        var icon = this.googleOverlay.icon;
        if(self.map.getZoom() > 16)
            this.googleOverlay.icon = this.iconLarge;
        else
            this.googleOverlay.icon = this.iconSmall;
        if(this.googleOverlay.map != null && icon != this.googleOverlay.icon) {
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

