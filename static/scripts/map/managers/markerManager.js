MARKER_RADIUS = 10;

localground.markerManager = function(id){
	this.id = id;
	this.title = "Markers";
	this.data = [];
	this.bufferCircle = new google.maps.Circle({
		strokeColor: '#339bb9',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#339bb9',
		fillOpacity: 0.15,
		radius: 400
	});
    this.palettes = [
        { name: 'Qualitative 1',
          colors: ['A6CEE3', 'E31A1C', '1F78B4', 'B2DF8A', '33A02C', 'FB9A99',
                    'FDBF6F', 'FF7F00', 'CAB2D6', '6A3D9A']
        },
        { name: 'Qualitative 2',
          colors: ['8DD3C7', 'FFFFB3', 'BEBADA', 'FB8072', '80B1D3', 'FDB462',
                    'B3DE69', 'FCCDE5', 'D9D9D9', 'BC80BD']
        },
        { name: 'Diverging 1',
          colors: ['9E0142', 'D53E4F', 'F46D43', 'FDAE61', 'FEE08B', 'E6F598',
                    'ABDDA4', '66C2A5', '3288BD', '5E4FA2']
        },
        { name: 'Diverging 2',
          colors: ['543005', '8C510A', 'BF812D', 'DFC27D', 'F6E8C3', 'C7EAE5',
                    '80CDC1', '35978F', '01665E', '003C30']
        },
        { name: 'Sequential 1',
          colors: ['FFFFE5', 'F7FCB9', 'D9F0A3', 'ADDD8E', '78C679', '41AB5D',
                    '238443', '006837', '004529']
        },
        { name: 'Sequential 2',
          colors: ['FFFFD9', 'EDF8B1', 'C7E9B4', '7FCDBB', '41B6C4', '1D91C0',
                    '225EA8', '253494', '081D58']
        },
        { name: 'Sequential 3',
          colors: ['FFFFCC', 'FFEDA0', 'FED976', 'FEB24C', 'FD8D3C', 'FC4E2A',
                    'E31A1C', 'BD0026', '800026']
        } 
    ];
};
localground.markerManager.prototype = new localground.manager();

localground.markerManager.prototype.addRecords = function(data) {
    var me = this;
    $.each(data, function(){
		this.managerID = me.id;
		switch (this.geometry.type) {
			case 'Point':
				me.data.push(new localground.marker(this)); 
				break;
			case 'LineString':
				me.data.push(new localground.polyline(this)); 
				break;
			case 'Polygon':
				me.data.push(new localground.polygon(this)); 
				break;
			default:
				alert('Unknown Geometry Type');
		}
    });
};

localground.markerManager.prototype.removeRecord = function(marker) {
    //detach photos:
    if(marker.photoIDs) {
        $.each(marker.photoIDs, function() {
            var photo = marker.getManagerById('photos').getDataElementByID(this);
            photo.googleOverlay.setMap(self.map);
            photo.getListingElement().show();
        });
    }
    //detach audio files:
    if(marker.audioIDs) {
        $.each(marker.audioIDs, function() {
            var audio = marker.getManagerById('audio').getDataElementByID(this);
            audio.googleOverlay.setMap(self.map);
            audio.getListingElement().show();
        });
    }
    //detach table records:
    if(marker.recordIDs) {
        $.each(marker.recordIDs, function(tableID, recordIDs) {
            var table = marker.getManagerById(tableID);
            $.each(recordIDs, function() {
                var record = table.getDataElementByID(this);
                record.googleOverlay.setMap(self.map);
                record.getListingElement().show();
            })
        });
    }
	localground.manager.prototype.removeRecord.call(this, marker);
	/*
    //unset marker overlay & splice:
    marker.closeInfoBubble();
    marker.googleOverlay.setMap(null);
    marker.getListingElement().remove();
    var index = -1;
    $.each(this.data, function(idx){
        if(this.id == marker.id) {
            index = idx;
            return
        }
    });
    this.data.splice(index, 1);
    this.updateVisibility();
    */
};

localground.markerManager.prototype.intersectMarkers = function(mEvent, point, isGoogle) {
    var me = this;
	var candidateMarker = null;
    var dude = 2;
    //alert(point.gootleOverlay.icon.size.width);
    var position;
    if(isGoogle) {
        position = self.overlay.getProjection().fromLatLngToDivPixel(mEvent.latLng);
    } else {
        position = self.overlay.getProjection().fromLatLngToDivPixel(point.currentPos);
    }
    var rV = 20, rH = 10;
    if(point.googleOverlay && point.googleOverlay.icon.size) {
        rV = point.googleOverlay.icon.size.height;  // vertical radius
        rH = point.googleOverlay.icon.size.width;   // horizontal radius
    }
    var top = position.y-rV, bottom = position.y+rV, left = position.x-rH,
                right = position.x+rH;
    $.each(this.data, function() {
		//only do this check if the marker is a POINT marker:
		if (this.geometry.type == 'Point') {
			var candidatePos = self.overlay.getProjection()
									.fromLatLngToDivPixel(
											this.googleOverlay.getPosition()
									);
			
			if(this.id != point.id || this.getObjectType() != point.getObjectType()) {
				var rad = MARKER_RADIUS;
				var orig = this.googleOverlay.icon;
				if(this.googleOverlay.map != null && candidatePos.y  <= bottom + rad &&
					candidatePos.y >= top - rad && candidatePos.x <= right + rad &&
					candidatePos.x >= left - rad) {
					this.googleOverlay.icon = 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=0.5|0|339bb9|13|b|';
					this.googleOverlay.setOptions({ 'draggable': false });
					candidateMarker = this;
					me.bufferCircle.setOptions({
						center: candidateMarker.googleOverlay.getPosition(),
						map: self.map,
						//scales radius no matter what the zoom level:
						radius: Math.pow(2, (21 - self.map.getZoom())) * 1128.49 * 0.002
					});

					return;
				}
				else {
					this.googleOverlay.icon = this.markerImage;
					this.googleOverlay.setOptions({ 'draggable': true });
				}
				if(this.googleOverlay.map != null && this.googleOverlay.icon != orig)
					this.googleOverlay.setMap(self.map);
			}
		}
    });
	if (candidateMarker == null) {
		me.bufferCircle.setOptions({map: null});
	}
    return candidateMarker;
};

localground.markerManager.prototype.toggleIconChooser = function() {
    var $colorPicker = $('#color-picker');
    if($colorPicker.get(0) == null) {
        
        $colorPicker = $('<div />')
                            .attr('id', 'color-picker')
                            .css({
                                'position': 'absolute',
                                'top': 200,
                                'left': 200,
                                'width': 320,
                                'overflow-y': 'hidden',
                                'height': (33*this.palettes.length),
                                'background-color': '#fff',
                                'border': 'solid 1px #ccc',
                                'display': 'none'
                            });
        $('body').append($colorPicker).click(function() {
            $colorPicker.hide();    
        });
        $.each(this.palettes, function() {
            $div = $('<div />')
                        .css({
                            'border-bottom': 'solid 1px #eee',
                            'padding': '1px 0px 1px 0px'
                        }).append(
                            $('<div />').css({
                                'display': 'inline-block',
                                'width': '90px',
                                'text-align': 'right',
                                'margin-right': '10px'
                            }).html(this.name));
            $colorPicker.append($div);
            $.each(this.colors, function() {
                var color = this;
                $div.append(
                    $('<img />')
                        .attr('src', 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=0.4|0|' +
                                        color + '|13|b|')
                        .attr('target', color)
                        .css({
                            'cursor': 'pointer',
                            'vertical-align': 'middle',
                            'border': 'solid 1px #fff'
                        }).click(function(event){
                            event.stopPropagation();
                            $('#color-preview')
                                .attr('src', 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=0.5|0|' +
                                        $(this).attr('target') + '|13|b|'
                                                     );
                            $('#marker_color').val(color);
                            $colorPicker.hide();
                        }).hover(
                            function(){ $(this).css('border-color', '#999'); },
                            function(){ $(this).css('border-color', '#fff'); }
                        )
                )
            });
        });
    }
    var $elem = $('#color-preview');
    $colorPicker.css({
        'top': $elem.offset().top,
        'left': $elem.offset().left + $elem.width() + 5
    });
    $colorPicker.toggle();
    
};

localground.markerManager.prototype.doViewportUpdates = function() {
	/*
	$.each(this.data, function() {
		if(!this.inView())
			this.getListingElement().hide();
		else
			this.getListingElement().show();
	});
	*/
};