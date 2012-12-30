localground.point = function(opts){
    //abstract classfor all *point overlays
    this.image = null;
    this.iconSmall = null;
    this.iconLarge = null;
    this.lat = null;
    this.lng = null;
    this.infoBubbleParams = {
        edit: { width: 445, height: 225 },
        view: { width: 445, height: 225 }
    };
    this.candidateMarker = null; //used if marker is to be merged with another marker
};

localground.point.prototype = new localground.overlay();

localground.point.prototype.renderOverlay = function(opts) {
    var turnedOn = $('#toggle_' + this.getObjectType() + '_all').attr('checked');
    var hideIfMarker = (self.hideIfMarker && this.markerID != null);
    turnedOn = turnedOn && !hideIfMarker;
    
    //to override default behavior:
    if(opts && opts.turnedOn)
        turnedOn = opts.turnedOn;
    if(this.lat != null) {
        if(this.googleOverlay == null) {
            this.googleOverlay = new google.maps.Marker({
                position: new google.maps.LatLng(this.lat, this.lng),
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
                this.getManagerById(self.overlayTypes.MARKER).getLoadingImageSmall()
            ).append(('Adding to marker...'));
		
		// after the media item has been added to the marker, reset the position
		// of the media item and toggle it off in the menu
		this.googleOverlay.setPosition(new google.maps.LatLng(this.lat, this.lng));
        this.googleOverlay.setMap(null);
		$('#cb_' + this.overlayType + "_" + this.id).attr('checked', false);
        
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
		this.candidateMarker.appendMedia(this); 
    }
    else {
        $.getJSON('/api/0/update-latlng/' + this.getObjectType() + '/' + this.id + '/',
        {
            lat: latLng.lat(),
            lng: latLng.lng()
        },
        function(result) {
            if(!result.success) {
                alert('ERROR: ' + result.message);
            }
            else {
                me.lat = latLng.lat();
                me.lng = latLng.lng();
            }
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
            self.infoBubble.close();
            //self.currentOverlay.closeInfoBubble(); //close info bubble while dragging
            self.currentOverlay = me;
            me.googleOverlay.setIcon(me.iconSmall);
        });
        google.maps.event.addListener(this.googleOverlay, "dragend", function(mEvent) {
            me.dragend(mEvent.latLng);
            me.googleOverlay.setIcon(me.getIcon());
        });
        google.maps.event.addListener(this.googleOverlay, "drag", function(mEvent) {
            me.candidateMarker = me.getManagerById(self.overlayTypes.MARKER).intersectMarkers(mEvent, me);
        });
    }
    else {
        this.makeGeoreferenceable();
    }
	this.getListingElement().find('.close').show();
};

localground.point.prototype.addMarkerEventHandlers = function() {
    var me = this;
    google.maps.event.addListener(this.googleOverlay, "click", function(mEvent) {
        self.currentOverlay = me;
        me.closeInfoBubble();
        me.showInfoBubble();
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
        if(self.map.getZoom() < 18)
            self.map.setZoom(18);
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
    if(this.googleOverlay &&
       self.map.getBounds().contains(this.googleOverlay.getPosition())) {
        return true;    
    }
    return false;   
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

localground.point.prototype.showInfoBubbleEdit = function() {
    //this section reloads the iframe completely
    var me = this;
    var $contentContainer = $('<div></div>')
        .css({
            'width': this.infoBubbleParams.edit.width,
            'height': this.infoBubbleParams.edit.height
        });
    var $iframe = $('<iframe></iframe>')
        .css({
            'width': $contentContainer.width() - 5,
            'height': $contentContainer.height() - 5,
            'margin': '5px 5px 5px 10px',
            'display': 'block',
            'visibility': 'hidden' //display:none throws positioning error
        })
        .attr('id', 'the_frame')
        .attr('frameborder', 0)
        .attr('src', this.iframeURL)
        .load(function() {
            me.iframeOnload();    
        });
    var $loadingImg = $('<div id="load_msg"></div>');
    $loadingImg.css({
            'width': $iframe.width(),
            'height': $iframe.height(),
            'text-align': 'center'
        })
        .append($('<img />')
            .attr('src', '/static/images/ajax-loader.gif')
    );
    $contentContainer.append($loadingImg).append($iframe);
      
    var $footer = $('<div></div>')
        .css({ 'margin': '5px 0px 0px 165px' })
        .append(
            $('<input id="form_submit" type="button" class="btn primary" />')
            .val('Save')
            .css({ 'margin-right': '5px' })
            .click(function() {
                me.saveIframe();
                return false;
            }))
        .append(
            $('<input type="button" class="btn" />')
            .val('Delete')
            .click(function() {
                me.deleteOverlay();
                return false;
            }));
    self.infoBubble.setHeaderText(this.name.truncate(5));
    self.infoBubble.setFooter($footer.get(0));
    self.infoBubble.setContent($contentContainer.get(0)); 
    self.infoBubble.open(self.map, this.googleOverlay);  
};

localground.point.prototype.closeInfoBubble = function() {
    //since this function is called in the infobubble class, use the
    //global variable "self" instead of "this":
    if(self.infoBubble.isOpen()) {
        self.infoBubble.close();
        $('#color-picker').hide(); 
    
        if(this.isEditMode() && this.lat == null) {
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
    if(this.googleOverlay != null)
        return;
    var $img = this.getListingImage();
    var $cb = this.getListingCheckbox();
    var me = this;
    $img.draggable({helper: 'clone',
        stop: function(e) {
            $cb.css({'visibility': 'visible'}).attr('checked', true);
            var point = new google.maps.Point(e.pageX,e.pageY-32);
            //self.overlay is an "OverlayView" object that helps with projections:
            var location = self.overlay.getProjection().fromContainerPixelToLatLng(point);
            var imageURL = me.iconLarge;
            if(self.map.getZoom() <= 16)
                imageURL = me.iconSmall;  
            //initialize marker:
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
            //after image has been dragged, deactivate it:
            $img.removeClass('can_drag').removeClass('activated').draggable('disable');
        }
    }).addClass('activated');
};

