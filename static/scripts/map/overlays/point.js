localground.point = function(opts){
    //abstract classfor all *point overlays
    this.image = null;
    this.iconSmall = null;
    this.iconLarge = null;
    this.point = null;
    this.infoBubbleParams = {
        edit: { width: 445, height: 225 },
        view: { width: 445, height: 225 }
    };
    this.candidateMarker = null; //used if marker is to be merged with another marker
	this.bubbleWidth = 480;
    this.bubbleHeight = 360;
};

localground.point.prototype = new localground.overlay();

localground.point.prototype.renderOverlay = function(opts) {
    var turnedOn = $('#toggle_' + this.getObjectType() + '_all').attr('checked');
    var hideIfMarker = (self.hideIfMarker && this.markerID != null);
    turnedOn = turnedOn && !hideIfMarker;
    
    //to override default behavior:
    if(opts && opts.turnedOn)
        turnedOn = opts.turnedOn;
    if(this.point != null) {
		if(this.googleOverlay == null) {
            this.googleOverlay = new google.maps.Marker({
                position: new google.maps.LatLng(this.point.lat, this.point.lng),
                map: turnedOn ? self.map : null,
                icon: this.iconSmall,
                id: this.id
            });
            this.addMarkerEventHandlers();
        }
        else if(turnedOn) {
            this.googleOverlay.setMap(self.map);
        }
    }
    if(this.isEditMode())
        this.makeEditable();   
};

localground.point.prototype.dragend = function(latLng) {
    var me = this;
    if(this.candidateMarker) {
        var $innerObj = $('<div />').append(
                this.getManagerById('markers').getLoadingImageSmall()
            ).append(('Adding to marker...'));
		
		// after the media item has been added to the marker, reset the position
		// of the media item and toggle it off in the menu
		if(this.point != null)
            this.googleOverlay.setPosition(new google.maps.LatLng(this.point.lat, this.point.lng));
        this.googleOverlay.setMap(null);
		$('#cb_' + this.managerID + "_" + this.id).prop('checked', false);
        
		// add a message:
		var $contentContainer = $('<div></div>').css({
                'width': '150px',
                'height': '30px',
                'margin': '5px 0px 5px 10px',
                'overflow-y': 'auto',
                'overflow-x': 'hidden'
            }).append($innerObj);
        self.infoBubble.setHeaderText(null);
        self.infoBubble.setFooter(null);    
        self.infoBubble.setContent($contentContainer.get(0)); 
        self.infoBubble.open(self.map, this.candidateMarker.googleOverlay);
        
		// append the media to the marker:
		this.candidateMarker.attachMedia(this);
        this.renderListing();
    }
    else {
		if(this.url.indexOf('.json') == -1)
			this.url = this.url + '.json';
		$.ajax({
			url: this.url,
			type: 'PUT',
			data: {
				lat: latLng.lat(),
				lng: latLng.lng()
			},
			success: function(data) {
				me.point = {};
				me.point.lat = latLng.lat();
                me.point.lng = latLng.lng();
				//re-render listing:
				me.renderListing();
			},
			notmodified: function(data) { alert('Not modified'); },
			error: function(data) { alert('Error'); }
		});
    }
};

/*localground.point.prototype.makeEditable = function() {
    if(this.googleOverlay) {
        this.googleOverlay.setOptions({
            'draggable': true,
            'title': 'Drag this icon to re-position it'
        });
    }
    var me = this;
    if(this.lat) //only add event handers if lat/lng defined
        this.addMarkerEventHandlers(); 
    else
        this.makeGeoreferenceable();
};*/

localground.point.prototype.makeEditable = function() {
    if(!this.isEditMode())
        return;
    var me = this;
    if(this.googleOverlay) {
        //clear all listeners:
        google.maps.event.clearListeners(this.googleOverlay, 'drag');
        google.maps.event.clearListeners(this.googleOverlay, 'dragstart');
        google.maps.event.clearListeners(this.googleOverlay, 'dragend');
        //google.maps.event.clearListeners(this.googleOverlay, 'click');
        this.googleOverlay.setOptions({
            'draggable': true,
            'title': 'Drag this icon to re-position it'
        });
        google.maps.event.addListener(this.googleOverlay, "dragstart", function(mEvent) {
            $('#record_preview').hide();
			self.tooltip.close();
			self.hideTip = true;
            self.infoBubble.close();
            //self.currentOverlay.closeInfoBubble(); //close info bubble while dragging
            self.currentOverlay = me;
            me.googleOverlay.setIcon(me.iconSmall);
        });
        google.maps.event.addListener(this.googleOverlay, "dragend", function(mEvent) {
            me.dragend(mEvent.latLng);
            me.googleOverlay.setIcon(me.getIcon());
			self.map.panTo(mEvent.latLng);
			self.hideTip = false;
        });
        //google.maps.event.addListener(this.googleOverlay, "drag", function(mEvent) {
		//	me.checkIntersection();
        //});
        google.maps.event.addListener(this.googleOverlay, "drag", function(mEvent) {
			me.checkIntersection(mEvent, true);
        });
    }

    //else {
        this.makeGeoreferenceable();


    //}
};
localground.point.prototype.checkIntersection = function(mEvent, isGoogle) {
    var me = this;
    var m = me.getManagerById('markers');
	if(m && me.overlay_type != self.overlay_types.MARKER){
		me.candidateMarker = m.intersectMarkers(mEvent, me, isGoogle);
	}
}
localground.point.prototype.addMarkerEventHandlers = function() {
    var me = this;
    google.maps.event.addListener(this.googleOverlay, "click", function(mEvent) {
        self.tooltip.close();
	self.currentOverlay = me;
        me.closeInfoBubble();
        me.showInfoBubble();
    });
    google.maps.event.addListener(this.googleOverlay, "mouseover", function() {
	self.currentOverlay = me;
	me.mouseoverF();
    });
    google.maps.event.addListener(this.googleOverlay, "mouseout", function() {
	self.currentOverlay = me;
	me.mouseoutF();
    });
	
    //only adds them if in "edit mode"
    if(this.isEditMode())
        this.makeEditable();
}

localground.point.prototype.makeViewable = function() {
	if(this.googleOverlay) {
        this.googleOverlay.setOptions({'draggable': false, 'title': ''});
        google.maps.event.clearListeners(this.googleOverlay, 'drag');
        google.maps.event.clearListeners(this.googleOverlay, 'dragstart');
        google.maps.event.clearListeners(this.googleOverlay, 'dragend');
	}
};

localground.point.prototype.getIcon = function() {
    return this.iconSmall;  
};

localground.point.prototype.zoomToOverlay = function() {
    this.closeInfoBubble();
    if(this.googleOverlay != null) {
        //if(self.map.getZoom() < 18)
        //    self.map.setZoom(18);
        if(!this.inView()) {
            self.map.setCenter(this.googleOverlay.position);
        }
        
        //trigger info bubble only if it's not currently open:
        var newOverlay = (self.currentOverlay != this);
        var overlayTurnedOn = (this.googleOverlay.map != null);
        var bubblePos = self.infoBubble.getPosition();
        var bubbleNotInView = (!bubblePos || !self.infoBubble.isOpen() ||
                                !self.map.getBounds().contains(bubblePos));
        if(overlayTurnedOn && (newOverlay || bubbleNotInView)) {
            google.maps.event.trigger(this.googleOverlay, 'click');
        }
        self.currentOverlay = this;
    }
};

localground.point.prototype.inView = function() {
	return true;
    /*if(this.googleOverlay &&
       self.map.getBounds().contains(this.googleOverlay.getPosition())) {
        return true;    
    }
    return false;*/  
};

localground.point.prototype.showInfoBubble = function(opts) {
    self.currentOverlay = this; //self.currentOverlay is a global variable
    if(self.mode == 'view')
        this.showInfoBubbleView(opts);
    else
        this.showInfoBubbleEdit(opts);
};

localground.point.prototype.iframeOnload = function() {
    var $iframe = $('#the_frame');
    $iframe.css({ 'visibility': 'visible' });
    $('#load_msg').hide();
};

localground.point.prototype.saveIframe = function() {
    var $f =  $('#the_frame').contents().find('form');
    $('#the_frame').contents().find('form').submit();
    
    //update the object & the right-hand panel text:
    this.name =  $f.find('#id_name').val();
    this.description =  $f.find('#id_description').val();
    this.renderListing();   
};

localground.point.prototype.deleteOverlay = function() {
    alert('show delete confirmation / un-georeference options here');  
};

localground.point.prototype.closeInfoBubble = function() {
    //since this function is called in the infobubble class, use the
    //global variable "self" instead of "this":
    if(self.infoBubble.isOpen()) {
        self.infoBubble.close();
        $('#color-picker').hide(); 
    
        if(this.isEditMode() && this.point == null) {
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

localground.point.prototype.makeGeoreferenceable = function() {
    var $img = this.getListingImage();
    var $cb = this.getListingCheckbox();
	var me = this;
    $img.draggable({helper: 'clone',
        start: function(e) {
           console.log('time for some interactive exploration of circles~')
        },
        drag: function(e) {
            var point = new google.maps.Point(e.pageX,e.pageY-32);
            var location = self.overlay.getProjection().fromContainerPixelToLatLng(point);
            me.currentPos = location;
            me.checkIntersection(e, false);

        },
        stop: function(e) {
            $cb.css({'visibility': 'visible'}).attr('checked', true);
            var point = new google.maps.Point(e.pageX,e.pageY-32);
            //self.overlay is an "OverlayView" object that helps with projections:
            var location = self.overlay.getProjection().fromContainerPixelToLatLng(point);
            var imageURL = me.iconLarge;
            if(self.map.getZoom() <= 16)
                imageURL = me.iconSmall;  
            //initialize marker:
            if(me.googleOverlay != null)
                me.googleOverlay.setMap(null);

            me.googleOverlay = new google.maps.Marker({
                position: location, 
                map: self.map,
                icon: imageURL,
                draggable: true
            });
            //add drag event handlers:
            me.addMarkerEventHandlers();
            self.currentOverlay = me;
            me.dragend(me.googleOverlay.getPosition());
			//center the map at the new location:
			self.map.panTo(location);
        }
    }).addClass('activated');
};

localground.point.prototype.showTip = function(opts){
	//opts.contentContainer, opts.width, opts.height
	if(self.infoBubble.isOpen()){ return; }
	var width = '150px', height = '25px', overflowY = 'auto';
	if(opts.width){ width = opts.width; }
	if(opts.height){ height = opts.height; }
	if(opts.overflowY){ overflowY = opts.overflowY; }
	var $bubble = $('<div></div>').css({
			'width': width,
			'height': height,
			'margin': '0px 0px 0px 0px',
			'overflow-y': overflowY,
			'overflow-x': 'hidden'
		}).append(opts.contentContainer);
	self.tooltip.setHeaderText(null);
	self.tooltip.setFooter(null);    
	self.tooltip.setContent($bubble.get(0)); 
	self.tooltip.open(self.map, self.currentOverlay.googleOverlay);
}

localground.point.prototype.mouseoverF = function(){
	if(self.hideTip){ return; }
	var $innerObj = $('<div style="text-align:center" />').append(this.name);
	this.showTip({
		contentContainer: $innerObj 
	});
};

localground.point.prototype.mouseoutF = function(){
	self.tooltip.close();
};

localground.point.prototype.renderInfoBubble = function(opts) {
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
    self.infoBubble.open(self.map, this.googleOverlay);
    self.infoBubble.setHeaderText(null);
    self.infoBubble.setFooter(null);
    self.infoBubble.doNotPad = true;
    self.infoBubble.setContent($contentContainer.get(0)); 
    
    return $contentContainer; 
};

