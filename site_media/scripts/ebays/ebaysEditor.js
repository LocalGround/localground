localground.ebays = function(){
    this.tableManager = null;
    this.dataTables = [];
};

localground.ebays.prototype = new localground.editor();


localground.ebays.prototype.initialize=function(opts){
    localground.editor.prototype.initialize.call(this, opts);
    this.map.setOptions({streetViewControl: true});
    $('#chart_opener').css({
        'z-index': 1000000,
        'position': 'absolute',
        'top': $('body').height() - $('#chart_opener').height(),
        'left': 0
    });
    $('#chart_panel').css({
        'z-index': 1000000,
        'position': 'absolute',
        'top': $('body').height(),
        'left': 0,
        'height': 200
    });
    this.initBottomPanel();
    $('#cb_project_100').trigger('click');
};

localground.ebays.prototype.toggleGroupData = function(groupID, groupType, is_checked) {
    if(groupID != 100) {
		return localground.editor.prototype.toggleGroupData(this, groupID, 'projects', true);
        //return localground.editor.prototype.toggleProjectData.call(this, projectID, is_checked);
    }
	if(is_checked) {
        self.lastProjectSelection = groupID;
		var params = {
			id: groupID,
			include_processed_maps: true,
			include_markers: true,
			include_audio: true,
			include_photos: true,
			include_notes: false,
			project_id: groupID
		};
        self.getAirQualityData();
	window.setTimeout(function() {
        	self.getAirObservations();
	}, 200);
	window.setTimeout(function() {
		$.getJSON('/api/0/projects/', params,
			function(result) {
				if(!result.success) {
					alert(result.message);
					return;
				}
				//process paper maps:
				$('#mode_toggle').show();
				var opts = {};
				self.paperManager.addRecords(result.processed_maps, opts);
				self.paperManager.renderOverlays();     
				//process photos:
				self.photoManager.addRecords(result.photos, opts);  
				self.photoManager.renderOverlays();  
				//process audio:
				/*self.audioManager.addRecords([], opts); 
				self.audioManager.renderOverlays();
				*/
				//process markers:
				self.markerManager.addRecords(result.markers, opts);
				self.markerManager.renderOverlays();
				//process notes:
				self.resetBounds();
			},
		'json');
		}, 1000);
	} //end if checked
	else {
		$.each(self.managers, function() {
			this.removeByProjectID(groupID);    
		});
		self.resetBounds();
		if($('.cb_project:checked').length == 0) {
			$('#mode_toggle').hide();
		}
	}
    return true;
};

localground.ebays.prototype.getAirObservations = function() {
    $.getJSON('/api/0/tables/table/149/',
        function(result){
            var table = {};
            table.form = {id: 149, name: 'Observations: 2013'};
            var m = new localground.table(table, 'B2DF8A');
            m.addDataContainer();
            m.addRecords(result.records, {});
            m.renderOverlays();
            self.managers.push(m);
        },
    'json');

    $.getJSON('/api/0/tables/table/92/',
        function(result){
            var table = {};
            table.form = {id: 92, name: 'Observations: 2012'};
            var m = new localground.table(table, '1F78B4');
            m.addDataContainer();
            m.addRecords(result.records, {});
            m.renderOverlays();
            self.managers.push(m);
        },
    'json');
};

localground.ebays.prototype.getAirQualityData = function() {
    $.getJSON('/api/0/tables/table/84/get-menu/',
        function(result){
            var table = {};
            table.form = {id: 84, name: 'Air Quality Data'};
            self.tableManager = new localground.table(table, null);
            self.tableManager.addDataContainer();
            $.each(result.file_names, function(){
                $cb = $('<input type="checkbox" />')
                            .val(this)
                            .css({'vertical-align': 'middle'});
                $cb.change(function(){
                    var val = $(this).val();
                    if($(this).attr('checked')) {
                        var m = new Map();
                        m.init(self.map, self.overlay);
                        m.render_data(val, self.dataTables.length);
                        self.dataTables.push({
                            id: val,
                            map_object: m
                        });
                    }
                    else {
                        $.each(self.dataTables, function(index){
                            if(this.id == val) {
                                this.map_object.clear_data();
                                self.dataTables.slice(index, index+1);
                                return;
                            }    
                        })
                    }
                });
                $label = $('<span>' + this + '</span>');
                self.tableManager.getListingContainer().append($cb).append($label).append('<br>');
            });
        },
    'json');    
};

localground.ebays.prototype.updateChartPanelLayout = function() {
    var h = 240;
    var is_minimized = $('#chart_opener > div > div').hasClass('ui-icon-top-triangle');
    //alert(is_minimized);
    if(is_minimized) {
        //alert('growing map');
        //$('#map_canvas').css({ height: $('body').height() - 40 });
        $('#map_canvas, #map_panel').css({'height': $('body').height() - 40});
        $('#panel_data').css({
            'height': $('#map_panel').height()-129
        });
        $('#chart_panel').css({ top: $('body').height() });
        $('#chart_opener').css({ top: $('body').height() - $('#chart_opener').height()  });
    }
    else {
        $('#chart_opener').css({
            'top': $('body').height()-h-$('#chart_opener').height()
        });
        $('#chart_panel').css({
            top: $('body').height() - h,
            width: $('body').width()
        });
        $('#chart_holder').css({
            'height': h-20
        });
        $('#map_canvas, #map_panel').css({
            'height': $('body').height()-h
        });
        $('#panel_data').css({
            'height': $('#map_panel').height()- 165
        })
    }
    google.maps.event.trigger(this.map, 'resize');
};

localground.ebays.prototype.initBottomPanel = function() {
    var self = this;
    $(window).resize(function() {
        self.updateChartPanelLayout();
    });
    $('#chart_opener').click(function(e) {
        var that = this;
        setTimeout(function() {
            var dblclick = parseInt($(that).data('double'), 10);
            if (dblclick > 0) {
                $(that).data('double', dblclick-1);
            } else {
                singleClick.call(that, e);
            }
        }, 300);
    }).dblclick(function(e) {
        $(this).data('double', 2);
        doubleClick.call(this, e);
    });
 
};


//a hack so that single & double click will work:
function singleClick(e) {
    var h = 240;
    var is_minimized = $('#chart_opener > div > div').hasClass('ui-icon-top-triangle');
    if(!is_minimized) {
        $(this).animate({
                'top': $('body').height()-$('#chart_opener').height()
            },
            'fast',
            function() {
                $('#chart_opener > div > div')
                    .removeClass('ui-icon-bottom-triangle')
                    .addClass('ui-icon-top-triangle');
                $('#chart_panel').hide();
                self.updateChartPanelLayout();
            }
        );
        $('#chart_panel').animate({
            top: $('body').height() - 40
        }, 'fast');
    }
    else {
        $('#chart_opener').animate({
            'top': $('body').height()-h-$('#chart_opener').height()
        }, 'fast',
            function() {
                $('#chart_opener > div > div')
                    .removeClass('ui-icon-top-triangle')
                    .addClass('ui-icon-bottom-triangle');
                self.updateChartPanelLayout();
            });
        $('#chart_panel').css({'display': 'block'}).animate({
                height: h,
                top: $('body').height()-h,
                'width': $('body').width(),
                'left': 0
            }, 'fast');
        
    }
    google.maps.event.trigger(self.map, 'resize');   
}

function doubleClick(e) {
    $(this).css({ 'top': 8});
    $('#chart_opener > div > div')
            .removeClass('ui-icon-top-triangle')
            .addClass('ui-icon-bottom-triangle');
    $('#chart_panel').css({
        'top': $('#chart_opener').height() + 8,
        'height': $('body').height() - $('#chart_opener').height() - 8,
        'display': 'block'
    });
    $('#chart_holder').css({
        'height': $('#chart_panel').height() -20
    });
}



