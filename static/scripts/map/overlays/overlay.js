/**
 * For convenience, this class depends on the global variable "self" which
 * is the main controller object that uses this class.
**/
localground.overlay = function(){
    //abstract class for all overlays
	this.name = null;
    this.id = null;
    this.googleOverlay = null;
    this.overlay_type = null;
	this.managerID = null;
};

localground.overlay.prototype.isVisible = function() {
	return this.getListingElement().css('display') != 'none';
};

localground.overlay.prototype.isEditMode = function() {
	return self.mode == 'edit';
};

localground.overlay.prototype.isViewMode = function() {
	return self.mode == 'view';
};

localground.overlay.prototype.getObjectType = function() {
	//alert(this.overlay_type);
	return this.overlay_type;
};

localground.overlay.prototype.getListingContainer = function() {
	//alert('#' + this.managerID);
	$c = $('#' + this.managerID);
	//alert($c.html());
	return $c;
};

localground.overlay.prototype.isChecked = function() {
    return $('#cb_' + this.managerID + '_' + this.id).prop('checked');
}

localground.overlay.prototype.renderListingCheckbox = function() {
	var me = this;
	var $cb = $('<input class="cb_' + this.managerID + '" type="checkbox" />')
        .attr('id', 'cb_' + this.managerID + '_' + this.id)
        .val(this.id)
        .css({'vertical-align': 'baseline'})
        .change(function() {
			me.toggleOverlay($(this).prop('checked'));
        });
	if(this.googleOverlay) {
		if(this.googleOverlay.map != null) {
			$cb.prop('checked', true);
		}
		else if(this.turned_on) { //only relevant for views.
			this.googleOverlay.setMap(self.map);
			$cb.prop('checked', true);
		}
	}
	//if the element hasn't been geo-referenced, hide the check box:
	if(this.geometry == null && this.north == null)
        $cb.css({ 'visibility': 'hidden' });
	return $cb;
};

localground.overlay.prototype.getListingElement = function() {
	//alert(this.managerID + '_' + this.id)
	var $elem = $('#' + this.managerID + '_' + this.id);
	if($elem.get(0) != null)
		return $elem;
	return null;
};

localground.overlay.prototype.getListingCheckbox = function() {
	return $('#cb_' + this.managerID + '_' + this.id);
};

localground.overlay.prototype.getListingImage = function() {
	return $('#img_' + this.managerID + '_' + this.id);
};


localground.overlay.prototype.renderListingImage = function() {
	var $img = $('<img />')
					.addClass(this.managerID)
					.attr('src', this.image)
					.attr('id', 'img_' + this.managerID + '_' + this.id)
					.css({'vertical-align': 'baseline'});
	if(this.file_name_orig != null)
		$img.attr('title', this.file_name_orig);   
	if(this.geometry == null) { $img.addClass('can_drag'); }
	return $img;
};

localground.overlay.prototype.getName = function() {
	var name = this.name;
	if(name == null || name.length == 0)
		name = 'Untitled';
	return name;
};

localground.overlay.prototype.renderListingText = function() {
	var me = this;
	var $div_text = $('<div></div>').css({
        'display': 'inline-block',
        'margin-left': '5px',
        'vertical-align': 'bottom',
		'padding-bottom': '3px',
		'line-height': '15px'
    });
	if(this.geometry || this.north) {
        $div_text.append($('<a href="#"></a>')
                .html(this.getName().truncate(4))
                .attr('title', this.getName())
                .click(function() {
                    me.zoomToOverlay();
					return false;
                }));
    }
    else {
        $div_text.append($('<span></span>')
                .html(this.getName().truncate(4) + '<br />')
                .attr('title', this.getName()));
    }
	return $div_text;
};

localground.overlay.prototype.renderListing = function() {
	var $div_entry = this.getListingElement();
	if($div_entry == null)
	{
		//alert('adding new listing ' + this.managerID + '_' + this.id);
		$div_entry = $('<div></div>').attr('id', this.managerID + '_' + this.id);
		this.getListingContainer().append($div_entry);
		//alert($div_entry.attr('id') + 'has been appended');
	}
	else {
		$div_entry.children().remove();	
	}

    var me = this;
	
	//add checkbox
    var $cb = this.renderListingCheckbox();
    $div_entry.append($cb);
    
	//add image (if applicable):

	$div_entry.append(this.renderListingImage());
		
	//add text:
	$div_entry.append(this.renderListingText());
    
	//add close button
    $div_entry.append($('<a href="#" title="Delete" class="close">&times;</a>')
				.hide()
                .click(function() {
                    //me.removeItem();
					var answer = confirm('Are you sure you want to delete ' + me.getName() + '?');
					if (answer) {
						me.delete();
					}
					return false;
                }));
	
	if(self.hideIfMarker && this.markerID != null) {
		$div_entry.hide();
	}
	else {
		$div_entry.show();
	}

	this.toggleOverlay(this.isChecked());
    if(this.isEditMode()) {
        this.makeEditable();
        $('.listing_container').find('.close').show();
    }
};
localground.overlay.prototype.showOverlay = function() {
	this.getListingElement().show();
	try {
		this.toggleOverlay(this.isChecked());
		this.getManager().updateVisibility();
	} catch(e) {
		//alert(e);
	}
};

localground.overlay.prototype.hideOverlay = function() {
    //show un-hide:
	if(this.googleOverlay) {
		this.googleOverlay.setMap(null);
		if(this == self.currentOverlay) {
			self.currentOverlay.closeInfoBubble();
		}
	}
	this.getListingElement().find('input[type=checkbox]').prop('checked', false);
	this.getListingElement().hide();
	try {
		this.getManager().updateVisibility();
	} catch(e) {
		//alert(e);
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
    var $cb = $('#cb_' + this.managerID + '_' + this.id);
    //if checked, make markers visible and check everything:
    if(isOn) {
        if(this.isVisible() && this.googleOverlay && this.googleOverlay.getMap() == null) {
			if(this.googleOverlay) {
				this.googleOverlay.setMap(self.map);
				if(this.getObjectType() == self.overlay_types.PHOTO)
					this.googleOverlay.icon = this.getIcon();    
			}
            $cb.prop('checked', true);
        }
    }
    else {
        $cb.prop('checked', false);
        if(this.googleOverlay)
			this.googleOverlay.setMap(null);
    }
};

localground.overlay.prototype.refresh = function() {
    this.renderListing();
    //this.showInfoBubble();
}

localground.overlay.prototype.showInfoBubble = function(opts) {
    self.currentOverlay = this; //self.currentOverlay is a global variable
    if(self.mode == 'view')
        this.showInfoBubbleView(opts);
    else
        this.showInfoBubbleEdit(opts);
};

localground.overlay.prototype.isTurnedOn = function() {
	return this.googleOverlay && this.googleOverlay.map != null;
};

localground.overlay.prototype.zoomToOverlay = function() {
    this.closeInfoBubble();
    if(this.googleOverlay != null) {
        self.map.setCenter(this.getCenterPoint());
        
        //trigger info bubble only if it's not currently open:
        var newOverlay = (self.currentOverlay != this);
        var overlayTurnedOn = (this.googleOverlay.map != null);
        var bubblePos = self.infoBubble.getPosition();
        var bubbleNotInView = (!bubblePos || !self.infoBubble.isOpen() ||
                                !self.map.getBounds().contains(bubblePos));
		if(overlayTurnedOn && (newOverlay || bubbleNotInView)) {
			//bug workaround: make sure you pass an empty {} to the trigger
			//or you get an error if the overlay is a polyline / polygon:
			//http://code.google.com/p/gmaps-api-issues/issues/detail?id=5763
            google.maps.event.trigger(this.googleOverlay, 'click', {});
        }
        self.currentOverlay = this;
    }
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

localground.overlay.prototype.getCenterPoint = function() {
	alert('implement getCenterPoint in child class');
};

localground.overlay.prototype.getBounds = function() {
    alert('implement getBounds in child class');
};

localground.overlay.prototype.getManager = function() {
	return self.managers[this.managerID];
};

localground.overlay.prototype.getManagerById = function(id) {
	return self.managers[id];
};

localground.overlay.prototype.getMarkerManager = function() {
	return self.markerManager;
};

localground.overlay.prototype.renderInfoBubble = function(opts) {
    var me = this;
    var width = this.bubbleWidth;
    var height = this.bubbleHeight;
    var margin = '0px';
    var overflow_y = 'hidden';
    if (opts) {
		width = opts.width || width;
		height = opts.height || height;
		margin = opts.margin || margin;
		overflow_y = opts.overflow_y || overflow_y;
	}
    var $contentContainer = $('<div></div>')
		.attr('id', 'bubble_container')
		.css({
            'width': width,
            'height': height,
            'margin': margin,
            'overflow-y': overflow_y,
            'overflow-x': 'hidden'
        });
    
	if (opts && opts.latLng)
		self.infoBubble.setPosition(opts.latLng);
	else
		self.infoBubble.setPosition(this.getCenterPoint());
	if (this.overlayType == "marker")
		self.infoBubble.setAnchor(this.googleOverlay);
	self.infoBubble.open(self.map);
    self.infoBubble.setHeaderText(null);
    self.infoBubble.setFooter(null);
    self.infoBubble.doNotPad = true;
    self.infoBubble.setContent($contentContainer.get(0)); 
    return $contentContainer;
};

localground.overlay.prototype.renderDetail = function() {
	$c = $('<div />');
	$c.append(
			$('<p />').css({
				'font-weight': 'bold',
				'color': '#444',
				'margin': '5px 15px 5px 15px'
			}).html(this.getName())
		).append(
			$('<div />').css({
				'height': '1px',
				'margin': '5px 0',
				'overflow': 'hidden',
				'background-color': '#eee',
				'border-bottom': '1px solid #ffffff'	
			})
		).append(
			$('<p />').css({
				'margin': '5px 0px 0px 15px',
				'height': '40px',
				'overflow-y': 'auto',
				'line-height': '15px'
			}).html(this.caption || this.description)
		);
	$tags = this.renderTags();
	if($tags) { $c.append($tags); }
	return $c;
};

localground.overlay.prototype.renderTags = function() {
	if(this.tags && this.tags.length > 0) {
		tags = this.tags.split(',');
		var $tags = $('<div />').css({
			'margin': '0px 15px 0px 15px'
		});
		for (i=0; i < tags.length; i++) {
			$tags.append(
				$('<span />').addClass('label label-info')
				.css({'margin-right': '5px'})
				.append('<i class="icon-tag icon-white"></i>')
				.append(tags[i]));
		}
		return $tags;
	}
	return null;
};

localground.overlay.prototype.delete = function() {
    var me = this;
	var url = this.url;
    if (url.indexOf('.json') == -1) { url += '.json'; }
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function(data) {
			var manager = me.getManager();
			manager.removeRecord(me);
        },
        notmodified: function(data) { alert('Not modified'); },
        error: function(data) {
            alert('error');
        }
    });   
};

localground.overlay.prototype.closeInfoBubble = function() {
    //since this function is called in the infobubble class, use the
    //global variable "self" instead of "this":
    if(self.infoBubble.isOpen()) {
        self.infoBubble.close();
        $('#color-picker').hide(); 
    
        if(this.isEditMode() && this.geometry == null) {
            this.googleOverlay.setMap(null);
            this.googleOverlay = null;
            this.renderListing();
            //make draggable again:
            var $img = this.getListingImage();
            $img.addClass('can_drag');
            this.makeGeoreferenceable();
        }
    }
};

