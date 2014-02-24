/******************
Useful links:
  1) delete polygon vertex:
     http://stackoverflow.com/questions/8831382/google-maps-v3-delete-vertex-on-polygon 
     http://jsbin.com/ajimur/10
  2) use the toolbar:
     http://gmaps-samples-v3.googlecode.com/svn-history/r282/trunk/drawing/drawing-tools.html
********************/

var self;

localground.editor = function(){
    this.markerDragInterval = null;
    this.canCheck = false;
    this.drawingManager = null;
    this.polyOptions = {
        strokeWeight: 0,
        fillOpacity: 0.45,
        editable: true
    };
    this.selectedShape = null;
};

localground.editor.prototype = new localground.viewer(); // Here's where the inheritance occurs 

localground.editor.prototype.initialize=function(opts){
    self = this;
    localground.viewer.prototype.initialize.call(this, opts);
    
    $('#mode_toggle').click(function() {
        self.toggleMode($(this));
    });
    this.initDrawingManager();
};

localground.editor.prototype.setPosition = function() {
    localground.basemap.prototype.setPosition.call(this);
    if($('#opener > div > div').hasClass('ui-icon-right-triangle')) {
        $('#panel_data').css({
            'height': $('#map_panel').height() - 129, // 149, //
            'overflow-y': 'auto'
        })
    }
};

localground.editor.prototype.initDrawingManager = function() {
    //gmaps-samples-v3.googlecode.com/svn-history/r282/trunk/drawing/drawing-tools.html
    this.drawingManager = new google.maps.drawing.DrawingManager({
        //drawingMode: google.maps.drawing.OverlayType.MARKER,
        markerOptions: {
            draggable: true,
            icon: 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=0.5|0|CCCCCC|13|b|'
        },
        polylineOptions: {
            editable: true
        },
        rectangleOptions: this.polyOptions,
        polygonOptions: this.polyOptions,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT,
            drawingModes: [
                google.maps.drawing.OverlayType.MARKER,
                //google.maps.drawing.OverlayType.POLYLINE,
                //google.maps.drawing.OverlayType.RECTANGLE,
                //google.maps.drawing.OverlayType.POLYGON
            ]
        },
        map: null
    });
    
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', function(e) {
        switch(e.type) {
            case google.maps.drawing.OverlayType.MARKER:
                var marker = new localground.marker();
                marker.createNew(e.overlay, self.lastProjectSelection, this.accessKey);
                break;
            
        }
        self.drawingManager.setDrawingMode(null);
    });
    /*google.maps.event.addListener(this.drawingManager, 'overlaycomplete', function(e) {
        self.drawingManager.setDrawingMode(null);
        var newShape = e.overlay;
        newShape.type = e.type;
        google.maps.event.addListener(newShape, 'click', function() {
            self.setSelection(newShape);
            self.deleteSelectedShape();
        });
        self.setSelection(newShape);
    });*/  
};

localground.editor.prototype.clearSelection = function() {
    if(this.selectedShape && this.selectedShape.type != google.maps.drawing.OverlayType.MARKER) {
        //alert(this.selectedShape);
        this.selectedShape.setEditable(false);
        this.selectedShape = null;
    }
};

localground.editor.prototype.setSelection = function(shape) {
    this.clearSelection();
    this.selectedShape = shape;
    if(shape.type != google.maps.drawing.OverlayType.MARKER) {
        shape.setEditable(true);
    }
};

            
localground.editor.prototype.deleteSelectedShape = function() {
    if(this.selectedShape) {
        this.selectedShape.setMap(null);
    }
};

localground.editor.prototype.makeEditable = function() {
    //turn on drawing manager:
    this.drawingManager.setMap(this.map);
    
    //show the delete buttons
    $('.listing_container').find('.close').show();
    for(var key in self.managers) {
        self.managers[key].makeEditable();
    }
};

localground.editor.prototype.makeViewable = function() {
    //hide the delete buttons
    $('.listing_container').find('.close').hide();
    
    //turn off drawing manager:
    this.drawingManager.setMap(null);
    
    //turn off draggability:
    for(var key in self.managers) {
        self.managers[key].makeViewable();
    }
};


localground.editor.prototype.toggleMode = function($elem) {
    if($elem.hasClass('info')) {
        this.mode = 'view';            
        $elem.removeClass('info');
        this.makeViewable();
    }
    else {
        this.mode = 'edit';
        this.makeEditable();
        $elem.addClass('info');
    }
    
    //if the infobubble is open, re-render it!
    if(self.infoBubble.isOpen()) {
        self.currentOverlay.showInfoBubble();
    }
};


