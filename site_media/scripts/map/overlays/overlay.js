/**
 * For convenience, this class depends on the global variable "self" which
 * is the main controller object that uses this class.
**/
localground.overlay = function(){
    //abstract class for all overlays
	this.name = null;
    this.id = null;
    this.googleOverlay = null;
    this.overlayType = null;
	this.overlayTypes = {
		PHOTO: 'photo',
		AUDIO: 'audio',
		VIDEO: 'video',
		NOTE: 'note',
		PAPER: 'paper',
		MARKER: 'marker'
	};
};

localground.overlay.prototype.isVisible = function() {
	return this.getListingElement().css('display') != 'none';
};

localground.overlay.prototype.isChecked = function() {
	return $('#cb_' + this.getObjectType() + '_' + this.id).attr('checked') ? true : false;	
};

localground.overlay.prototype.isEditMode = function() {
	return self.mode == 'edit';
};

localground.overlay.prototype.isViewMode = function() {
	return self.mode == 'view';
};

localground.overlay.prototype.getObjectType = function() {
	return this.overlayType;
};

localground.overlay.prototype.getListingContainer = function() {
	return $('#' + this.getObjectType());
};

localground.overlay.prototype.renderListingCheckbox = function() {
	var me = this;
	var $cb = $('<input class="cb_' + this.getObjectType() + '" type="checkbox" />')
        .attr('id', 'cb_' + this.getObjectType() + '_' + this.id)
        .val(this.id)
        .css({'vertical-align': 'baseline'})
        .change(function() {
			me.toggleOverlay($(this).attr('checked'));
        });
	if(this.googleOverlay) {
		if(this.googleOverlay.map != null) {
			$cb.attr('checked', true);
		}
		else if(this.turned_on) { //only relevant for views.
			this.googleOverlay.setMap(self.map);
			$cb.attr('checked', true);
		}
	}
	//if the element hasn't been geo-referenced, hide the check box:
	if(this.lat == null && this.north == null)
        $cb.css({ 'visibility': 'hidden' });
	return $cb;
};

localground.overlay.prototype.getListingElement = function() {
	var $elem = $('#' + this.getObjectType() + '_' + this.id);
	if($elem.get(0) != null)
		return $elem;
	return null;
};

localground.overlay.prototype.getListingCheckbox = function() {
	return $('#cb_' + this.getObjectType() + '_' + this.id);
};

localground.overlay.prototype.getListingImage = function() {
	return $('#img_' + this.getObjectType() + '_' + this.id);
};


localground.overlay.prototype.renderListingImage = function() {
	var $img = $('<img />')
					.addClass(this.getObjectType())
					.attr('src', this.image)
					.attr('id', 'img_' + this.getObjectType() + '_' + this.id)
					.css({'vertical-align': 'baseline'});
	if(this.file_name_orig != null)
		$img.attr('title', this.file_name_orig);   
	if(this.lat == null) { $img.addClass('can_drag'); }
	return $img;
};

localground.overlay.prototype.renderListingText = function() {
	if(this.name == null)
		this.name = 'Untitled';
	var me = this;
	var $div_text = $('<div></div>').css({
        'display': 'inline-block',
        'margin-left': '5px',
        'vertical-align': 'bottom',
		'padding-bottom': '3px',
		'line-height': '15px'
    });
	if(this.lat || this.north) {
        $div_text.append($('<a href="#"></a>')
                .html(this.name.truncate(4))
                .attr('title', this.name)
                .click(function() {
                    me.zoomToOverlay();
					return false;
                }));
    }
    else {
        $div_text.append($('<span></span>')
                .html(this.name.truncate(4) + '<br />')
                .attr('title', this.name));
    }
	return $div_text;
};

localground.overlay.prototype.renderListing = function() {
	var $div_entry = this.getListingElement();
	if($div_entry == null) {
		$div_entry = $('<div></div>').attr('id', this.getObjectType() + '_' + this.id);
        this.getListingContainer().append($div_entry);	
	}
	else {
		$div_entry.children().remove();	
	}

    var me = this;
	
	//add checkbox
    var $cb = this.renderListingCheckbox();
    $div_entry.append($cb);
    
	//add image (if applicable):
    //$img = this.renderListingImage()
	//if($img)
	$div_entry.append(this.renderListingImage());
		
	//add text:
	$div_entry.append(this.renderListingText());
    
	//add close button
    $div_entry.append($('<a href="#" title="hide" class="close">&times;</a>')
                .click(function() {
                    me.removeItem();
					return false;
                }));
	
	if(self.hideIfMarker && this.markerID != null) {
		$div_entry.hide();
	}
	else {
		$div_entry.show();
	}
};

localground.overlay.prototype.removeItem = function(item, prefix) {
    //show un-hide:
	this.getListingContainer().find('.unhide').show();
    if(this.googleOverlay) {
		this.googleOverlay.setMap(null);
		if(this == self.currentOverlay) {
			self.closeInfoBubble();
		}
	}
	this.getListingElement().find('input[type=checkbox]').attr('checked', false);
	this.getListingElement().hide();
};

localground.overlay.prototype.toggleOverlay = function(isOn) {
    var $cb = $('#cb_' + this.getObjectType() + '_' + this.id);
    //if checked, make markers visible and check everything:
    if(isOn) {
        if(this.isVisible() && this.googleOverlay && this.googleOverlay.getMap() == null) {
			if(this.googleOverlay) {
				this.googleOverlay.setMap(self.map);
				if(this.getObjectType() == this.overlayTypes.PHOTO)
					this.googleOverlay.icon = this.getIcon();    
			}
            $cb.attr('checked', true);
        }
    }
    else {
        $cb.attr('checked', false);
        if(this.googleOverlay)
			this.googleOverlay.setMap(null);
    }
};

localground.overlay.prototype.zoomToOverlay = function() {
	alert('implement zoomToOverlay in child class');
};

localground.overlay.prototype.renderOverlay = function() {
	alert('implement renderOverlay in child class');
};

localground.overlay.prototype.makeEditable = function() {
	alert('implement makeEditable in child class');
};

localground.overlay.prototype.makeViewable = function() {
	return;
};

localground.overlay.prototype.getManager = function() {
	switch(this.overlayType) {
		case this.overlayTypes.AUDIO:
			return self.audioManager;
		case this.overlayTypes.MARKER:
			return self.markerManager;
		case this.overlayTypes.NOTE:
			//a little bit more complicated -- noteManager is an array of managers:
			var table_id = this.getObjectType().split('_')[1];
			return self.noteManager.tables[table_id];
		case this.overlayTypes.PAPER:
			return self.paperManager;
		case this.overlayTypes.PHOTO:
			return self.photoManager;
		default:
			alert('overlayType "' + this.overlayType + '" not defined.')
			return null;
	}
};

localground.overlay.prototype.getMarkerManager = function() {
	return self.markerManager;
};

localground.overlay.prototype.getPhotoManager = function() {
	return self.photoManager;
};

localground.overlay.prototype.getAudioManager = function() {
	return self.audioManager;
};

localground.overlay.prototype.getNoteManager = function() {
	return self.noteManager;
};
