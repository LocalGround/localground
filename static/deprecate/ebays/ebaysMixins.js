localground.ebaysMixins = function(){ };

localground.ebaysMixins.prototype.getAirQualityData = function(opts) {
	var self = this;
    $.getJSON('/api/0/datasets/84/data/tracks/',
        function(result){
            self.tableManager = new localground.tableManager({
				id: 84,
				color: self.colors[++self.colorIndex],
				name: 'Particulate Matter Data'
			});
			self.tableManager.addDataContainer();
			$('#toggle_84_all').hide();
			$('.zoom-magnifying-glass').hide();
            $.each(result.results, function(){
				//alert(this.name);
                $cb = $('<input type="checkbox" />')
                            .val(this.name)
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
                $label = $('<span>' + this.name + '</span>');
                self.tableManager.getListingContainer().append($cb).append($label).append('<br>');
            });
			if (opts && opts.isOpen) {
				$('.show-hide').trigger('click');	
			}
        },
    'json');    
};

localground.ebaysMixins.prototype.updateChartPanelLayout = function() {
    var h = 240;
    var is_minimized = $('#chart_opener > div > div').hasClass('ui-icon-top-triangle');
    if(is_minimized) {
        //alert('growing map');
        //$('#map_canvas').css({ height: $('body').height() - 40 });
        $('#map_canvas, #map_panel').css({'height': $('body').height() - 40});
        $('#panel_data').css({
            'height': $('#map_panel').height()-109
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
            'height': $('#map_panel').height()- 145
        })
    }
    google.maps.event.trigger(this.map, 'resize');
};

localground.ebaysMixins.prototype.initCustomLayout = function() {
    var self = this;
	
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



