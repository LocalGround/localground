function initLayout() {
    $('input').click(function(event) {
        event.stopPropagation();
        //alert('should still be visible!');
    });
    
    $('.dropdown-menu > li').hover(
        function() { $(this).addClass('menu-item-selected'); },
        function() { $(this).removeClass('menu-item-selected'); }
    );
    
    $(window).resize(function() {
        setPosition();
    });
      
    //set width:
    setPosition();

    $('#map_canvas').css({'top': 40, 'height': $('body').height()-40});
    $('#opener').click(function() {
        if($('#opener > div > div').hasClass('ui-icon-right-triangle')) {
            $('#map_canvas').css({'width': $('body').width()});
            google.maps.event.trigger(self.map, 'resize');
            $(this).animate({
                'left': $('body').width()-$('#opener').width()
                },
                'fast',
                function() {
                    $('#opener > div > div')
                        .removeClass('ui-icon-right-triangle')
                        .addClass('ui-icon-left-triangle');
                    $('#map_panel').hide();
                }
            );
            //$('#map_panel').hide("slide", { direction: "right" }, 'fast');
            $('#map_panel').animate({
                width: 0,
                left: $('body').width()
            }, 'fast');
        }
        else {
            $('#opener').animate({
                'left': $('body').width()-340-$('#opener').width()
            }, 'fast');
            $('#map_panel').css({'display': 'block'}).animate({
                    width: 340,
                    left: $('body').width()-340
                }, 'fast',
                function() {
                    //callback:  set width:
                    $('#map_canvas').css({
                        'left': 0,
                        'width': $('body').width()-340
                    });
                    google.maps.event.trigger(self.map, 'resize');
                    $('#opener > div > div')
                        .removeClass('ui-icon-left-triangle')
                        .addClass('ui-icon-right-triangle');
                }
            );
            
        }
    });
}

function setPosition() {
    if($('#opener > div > div').hasClass('ui-icon-right-triangle')) {
        $('#map_canvas').css({
            'left': 0,
            'width': $('body').width()-340,
            'height': $('body').height()-40
        });
        $('#opener').css({
            'left': $('body').width()-340-$('#opener').width()
        });
        $('#map_panel').css({
            'left': $('body').width()-340,
            'width': 341,
            'height': $('body').height()-41
        });
    }
    else {
        $('#map_canvas').css({
            'left': 0,
            'width': $('body').width(),
            'height': $('body').height()-40
        });
        $('#opener').css({
            'left': $('body').width()-$('#opener').width()
        });
        $('#map_panel').css({
            'left': $('body').width(),
            'height': $('body').height()-41
        });
    }
};