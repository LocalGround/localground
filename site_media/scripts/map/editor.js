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
    
    $('#save_view').click(function() {
        $('#dd-views').empty();
        $('#view-form, #view-footer').show();
        $('#view-saved-message').hide();
        $.each(self.views, function() {
            $('#dd-views').append(
                $('<option></option>').attr('value', this.id).html(this.name)
            );
        });
        $('#dd-views').append(
            $('<option></option>').attr('value', -1).html('-- Add New --')
        );
        
        //pre-select view that's already turned on, if applicable:
        if($('.cb_view:checked').length > 0) {
            $('#dd-views').val($('.cb_view:checked:first').val());
            $('#view-name').val($('#dd-views option:selected').text());
        }
        else {
            if($(this).val() == '-1')
            $('#dd-views').val('-1');
            $('#view-name').val('');
        }
        $('#edit-view').modal('show');
    });
    
    $('#dd-views').change(function(){
        if($(this).val() == '-1')
            $('#view-name').val('');   
        else
            $('#view-name').val($('#dd-views').val());
    });
    
    $('#save-view-confirm').click(function(){
        self.saveViewConfirm();    
    });
    
    this.initDrawingManager();
};

localground.editor.prototype.saveViewConfirm = function() {
    //alert('save view!');
    params = {
        name: $('#view-name').val()   
    };
    $.each(self.managers, function() {
        if(this.overlayType != 'note') {
            var ids = [];
            $.each(this.data, function() {
                if(this.isChecked())
                    ids.push(this.id);
            });
            params[this.overlayType + '_ids'] = ids.join(',');
        }     
    });
    var url = '/profile/views/associate/';
    if($('#dd-views').val() != '-1')
        url += $('#dd-views').val() + '/';
    $.post(
        url, params,
        function(result) {
            var found = false;
            $.each(self.views, function(){
                if(this.id == result.id) {
                    this.name = result.name;
                    $('#cb_view_' + result.id).next().html(result.name);
                    found = true;
                }
            });
            if(!found) {
                self.views.push(result);
                self.appendGroupMenuItem(result, 'view');
                $('#cb_view_' + result.id).attr('checked', true);
                self.doGroupMenuTouchups('view');
            }
            //alert(JSON.stringify(result));
            $('#views-menu').show();
            $('#view-form, #view-footer').hide();
            $('#view-saved-message').show();
        },
    'json');  
};

localground.editor.prototype.setPosition = function() {
    localground.basemap.prototype.setPosition.call(this);
    if($('#opener > div > div').hasClass('ui-icon-right-triangle')) {
        $('#panel_data').css({
            'height': $('#map_panel').height()-129,
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
                google.maps.drawing.OverlayType.MARKER //,
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


localground.editor.prototype.toggleMode = function($elem) {
    switch($elem.html()) {
        case 'Edit':
            this.mode = 'edit';
            $elem.html('Done');
            //turn on drawing manager:
            this.drawingManager.setMap(this.map);
            
            $.each(this.managers, function() {
                this.makeEditable();
            });
            
            break;
        default:
            this.mode = 'view';            
            $elem.html('Edit');
            
            //turn off drawing manager:
            this.drawingManager.setMap(null);
            
            //turn off draggability:
            $.each(this.managers, function() {
                this.makeViewable();
            });
            break;
    }
    
    //if the infobubble is open, re-render it!
    if(self.infoBubble.isOpen()) {
        self.currentOverlay.showInfoBubble();
    }
};


