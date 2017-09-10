KNOWN_LOCATION_ZOOM = 14;

localground.basemap = function() {
    this.isAdmin            = false;
    this.isPrint            = false;
    this.overlayConfigArray = null;
    this.serverURL          = null;
    this.mapServerURL       = null;
    this.tileCacheURL       = null;
    this.minZoom            = 2;
    this.maxZoom            = 22;
    this.map                = null;
    this.zoom               = null;
    this.center             = null;
    this.searchBox          = null;
    this.initialMapLayerID  = 2; //(2 = roadmap); // (12 = Grayscale);
    this.minimizeRightPanel = false;
    this.selectedLayers     = [];
    this.googleMapStyles    = [{
        featureType: "poi.school",
        elementType: "geometry", 
        stylers: [ { saturation: -79 }, { lightness: 75 } ]
    }];
    
    this.mapOptions = {
        scrollwheel: false,
        minZoom: this.minZoom,
        streetViewControl: false,
        scaleControl: true,
        panControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            position: google.maps.ControlPosition.LEFT
        },
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL
        }
        
    };
};
localground.basemap.prototype = new localground.base(); // inherits from base 

localground.basemap.prototype.handleNoGeolocation = function(browserSupportFlag) {
    //do nothing
}

localground.basemap.prototype.initialize=function(opts) {
    if(!this.isGoogleMapsAPIRunning()) {
        return;
    }
    localground.base.prototype.initialize.call(this, opts);
    //alert(JSON.stringify(opts));
    
    this.isAdmin            = opts.isAdmin || false;
    this.overlayConfigArray = opts.overlays;
    this.serverURL          = opts.serverURL || 'http://localground';
    this.mapServerURL       = opts.serverURL + '/ows/ms.fcgi';
    this.tileCacheURL       = opts.serverURL + '/ows/tilecache.fcgi/1.0.0/';
    this.hasDefaultLocale   = (opts.center)? true: false;
    this.center             = opts.center || new google.maps.LatLng(37.855365, -122.272614);
    this.zoom               = opts.zoom || 13;
    this.isPrint            = opts.isPrint || this.isPrint;
    this.initialMapLayerID  = opts.initialMapLayerID || this.initialMapLayerID;
    this.minimizeRightPanel = opts.minimizeRightPanel || this.minimizeRightPanel;
    
    this.map = new google.maps.Map(document.getElementById("map_canvas"), this.mapOptions);
    this.map.setOptions({styles: this.googleMapStyles});
    var that = this;

    //arrange panels on page:
    if(!this.isPrint)
        this.initLayout();

    // not sure if this is actually needed.  Need to check...
    this.overlay = new google.maps.OverlayView();
    this.overlay.draw = function() {};
    this.overlay.setMap(this.map);
    
    this.initTiles();
    this.initGeolocation();
        
    /*google.maps.event.addListener(this.map, 'click', function(evt){
        self.map.panTo(evt.latLng);
    });
    */

    $('.create-object').click(function() {
        var object_name = this.getAttribute('data-main');
        that.addObject({
            object_name: object_name
        });
    })

    $('#upload').click(function() {
        that.addObject({
            object_name: this.getAttribute('data-main'),
            url: '/upload/embed/',
            width: 1000,
            show_footer: false
        });
    });

    $('.edit').click(function() {
        var object = this.getAttribute('data-main');
        that.addObject({
            object_name: object_name,
            url: '/profile/' + object_name + '/embed/',
            width: 1050
        });
        //$('#add-modal').find('#the_frame').contents().find('.topbar').hide();

    });
};


localground.basemap.prototype.initGeolocation = function() {
    //Prompt user for default location, if possible
    var that = this;
    //
    if(this.hasDefaultLocale) {
        this.map.setCenter(that.center);
        this.map.setZoom(that.zoom);
    } else {
        if(navigator.geolocation) {
            var browserSupportFlag = true;
            navigator.geolocation.getCurrentPosition(function(position) {
                var initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                that.map.setCenter(initialLocation);
                that.map.setZoom(14);
                $('#default_location').val("SRID=4326;POINT(" + position.coords.longitude.toFixed(6) + " " +
                    position.coords.latitude.toFixed(6) + ")");

                $('#default_setter').submit(function(e) {
                    var postData = $(this).serializeArray();
                    var formURL = $(this).attr("action");
                    $.ajax(
                        {
                            url:formURL,
                            type:"PATCH",
                            data:postData,
                            success:function(data, textStatus, jqXHR) {
                                console.log("successfully submitted updated location")
                            },
                            error:function(data, textStatus, jqXHR) {
                                console.log("error updating default location")
                            }

                        }
                    );
                    e.preventDefault();

                });
                $('#default_setter').submit();

            }, function() {
                that.handleNoGeolocation(browserSupportFlag);
            });
        }
        // Browser doesn't support Geolocation
        else {
            browserSupportFlag = false;
            this.map.setCenter(this.center);
            this.map.setZoom(this.zoom);
            that.handleNoGeolocation(browserSupportFlag);
        }
    }
};

localground.basemap.prototype.search = function() {
    var places = this.searchBox.getPlaces();
    //alert(JSON.stringify(places));
    if (places) {
        if (places.length == 0) return;
        if (places[0].geometry.viewport) {
            this.map.fitBounds(places[0].geometry.viewport);
        }
        else {
            this.map.setCenter(places[0].geometry.location);
            this.map.setZoom(17);
        }
    }
};

localground.basemap.prototype.isGoogleMapsAPIRunning = function() {
    //check to see if google maps is up:
    if(google.maps.MapTypeControlStyle.DROPDOWN_MENU == null){
        this.displayMessage(
            ['The Google API is not available at this time.',
             '<a href="http://api-status.com/" target="_blank">API Status Check</a>']
        );
        return false;
    }
    return true;
};

localground.basemap.prototype.initTiles = function() {
    var self = this;
    var mapTypeIDs = [];
    var hasLayers = false;
    
    //iterate through each of the user's basemap tilesets and add it to the map:
    $.each(this.overlayConfigArray, function() {
        if(this.typeID == 1) { //typeID==1 for base tiles:
            switch(this.sourceName.toLowerCase()) {
                case 'stamen':
                    mapTypeIDs.push(this.name);
                    self.map.mapTypes.set(this.name, new StamenType({ styleID: this.providerID, name: this.name, max: this.max }));
                    break;
                case 'mapbox':
                    mapTypeIDs.push(this.name);
                    self.map.mapTypes.set(this.name, new MapBoxType({ styleID: this.providerID, name: this.name, max: this.max }));
                    break;
                case 'google':
                    //don't make google options available to non-admins on the print page:
                    //if(self.isAdmin || !self.isPrint)
                    mapTypeIDs.unshift(this.providerID);
                    break;
                default:
                    mapTypeIDs.push(this.name);
                    self.map.mapTypes.set(this.name, new GenericType({url: this.url, max: this.max}));
                    break;    
            }
        }
        else if(this.typeID == 2) { //for layers (overlays / supplementary info)
            hasLayers = true;
            var $span = $('<span></span>').html(this.name);
            var $cb = $('<input type="checkbox" />')
                        .attr('id', this.id)
                        .val(this.id)
                        .click(function() {
                            self.addTileOverlay($(this).val(), $(this).attr('checked'));
                        })
            var $li = $('<li></li>').append($cb).append($span);
            $('#layerList').append($li);
            $('#layerList').css({'width': '350px', 'max-width': '400px'});
        }
    });
    if(!this.isPrint) {
        this.extendTwitterDropdowns();

        //no additional layers configured
        if(!hasLayers) {
            //alert('no supplemental layers');
            $('#layers-menu').hide(); 
        }
        this.map.mapTypeControlOptions = {
            position: google.maps.ControlPosition.TOP_RIGHT,
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: mapTypeIDs
        };
    }
    
    //figure out base layer keyword from initial provider id
    var initialMapLayer = self.getOverlaySourceInfo('id', 2);//this.initialMapLayerID);
    
    switch(initialMapLayer.sourceName.toLowerCase()) {
        case 'google':
            this.map.setMapTypeId(initialMapLayer.providerID);
            break;
        default:
            //case 'mapbox':
            //case 'stamen':
            this.map.setMapTypeId(initialMapLayer.name);
            break;
    }
};

localground.basemap.prototype.getMapTypeId = function() {
    var id = null;
    $.each(this.overlayConfigArray, function() {
		if (this.name.toLowerCase() == self.map.getMapTypeId().toLowerCase()) {
			id = this.id;
            return;
		}
	});
    return id;
};

localground.basemap.prototype.getMapTypeNamebyId = function(id) {
    name = null;
    $.each(this.overlayConfigArray, function() {
		if (this.id == id) {
			name = this.name;
            return;
		}
	});
    return name;
}

localground.basemap.prototype.getOverlaySourceInfo = function(property, key) {
    //find the config entry pertaining to the selected layer/overlay: 
    var self = this;
    var config = null;
    $.each(this.overlayConfigArray, function(index) {
        if(key.toString().toLowerCase() == this[property].toString().toLowerCase()) {
            config = self.overlayConfigArray[index];
            return;
        }
    });
    return config;
};

localground.basemap.prototype.getTileOpts = function(key) {
    //find the config entry pertaining to the selected layer/overlay: 
    var self = this;
    var config = this.getOverlaySourceInfo('id', key);
    var tileOpts = {
        minZoom: 8,
        getTileUrl: function(coord, zoom) {
            var url = config.url;
            if(config.sourceID == 4) //locally hosted:
                url =  self.tileCacheURL + config.providerID + "/"  
            if(zoom >= this.minZoom)
                return url+zoom+"/"+coord.x+"/"+coord.y+".png";
            else
                return null;
        },
        tileSize: new google.maps.Size(256, 256),
        isPng: true
    };
    return tileOpts;
}

localground.basemap.prototype.addTileOverlay = function(id, turn_on) {
    var self = this;
    if(turn_on) {
        var overlay = new google.maps.ImageMapType(this.getTileOpts(id));
        this.map.overlayMapTypes.insertAt(this.selectedLayers.length, overlay);
        this.selectedLayers.push(id);
        var config = self.getOverlaySourceInfo('id', id);
        if(config==null) {
            alert('layer not found');
            return;
        }
        var url = self.mapServerURL + '?SERVICE=WMS&VERSION=1.1.1&layer=' +  config.providerID +
                              '&REQUEST=getlegendgraphic&FORMAT=image/png';
        $('#no_legend_yet').css({'display': 'none'});
        $('#panel_legend')
            .append($('<div></div>')
                .attr('id', 'legend_div_' + id)
                .append($('<h4></h4>').html(config.name).css({'margin': '5px 0px 5px 5px'}))
                .append($('<img />').attr('src', url)
            )
        );
    }
    else {
        $('#legend_div_' + id).remove();
        var slot = -1;
        $.each(this.selectedLayers, function(index) {
            if(this == id) {
                slot = index;
                return;
            }
        });
        if(slot != -1) {
            this.map.overlayMapTypes.removeAt(slot);
            this.selectedLayers.splice(slot, 1); //args:  index, # to remove
        }
    }
    
};

localground.basemap.prototype.showLoadingImage = function(divID) {
    //show loading message:
    var divText = '<div id="loadingDiv"><img src="/static/images/ajax-loader.gif" /></div>'
    if(divID == null)
    {
        //alert($("body").height() + " - " + $("window").height())
        $('body').append($(divText).css({'height': $("body").height()}).addClass('loading'));
    }
    else
    {
        //var pos = $(theSpan).offset();
        var c = $('#' + divID);
        $('body')
            .append($(divText)
            .css({
                'position': 'absolute',
                'left': c.offset().left,
                'top': c.offset().top,
                'height': c.height(),
                'width': c.width()
            })
            .addClass('loading'));
    }
};

localground.basemap.prototype.hideLoadingImage = function()
{
    $('#loadingDiv').remove();    
};


/*****************************************
 * Not currently being used, but useful: 
 *****************************************/
localground.basemap.prototype.getKML = function() {
    var scanID = $(this).attr('id');
    if($(this).attr('checked'))
    {
        $.getJSON(
            "/scan/" + scanID + "/",
            function(result) {
                //alert(JSON.stringify(result));
                if(result.kml)
                {
                    self.overlays[scanID] = new google.maps.KmlLayer(result.kml);
                    self.overlays[scanID].setMap(self.map);
                }
                else
                {
                    alert(result.message);
                }
            },
        "json");
    }
    else
    {
        self.overlays[scanID].setMap(null);
        delete self.overlays[scanID];
    }
};

localground.basemap.prototype.getScans = function() {
    var self = this;
    this.showLoadingImage("scanPanel");
    var params = {
        north: this.map.getBounds().getNorthEast().lat(),
        south: this.map.getBounds().getSouthWest().lat(),
        east: this.map.getBounds().getNorthEast().lng(),
        west: this.map.getBounds().getSouthWest().lng(),
        byUser: self.byUser
    }
    //alert(JSON.stringify(params));
    $.getJSON(
        "/scans/",
        params,
        function(result) {
            //alert(result.length);
            if(result.length == 0)
            {
                $("#scanList").html("No scans were found within the map extents");
                self.hideLoadingImage();
                return;
            }
            $("#scanList").html("");
            $.each(result, function(){
                var kml     = 'http://' + host + '/static/scans/' + this.pk + '/processed_' + this.pk + '.kml'
                if(self.scanOverlays[this.pk] == null)
                {
                    self.scanOverlays[this.pk] = { 'kml': new google.maps.KmlLayer(kml), 'checked': false };
                    self.scanOverlays[this.pk].kml.preserveViewport = true;
                }
                /*else
                {
                    alert("already exists");
                }*/
                var box     = $('<input type="checkbox" title="' + this.pk + '" id="' + this.pk + '" />');
                box.attr('checked', self.scanOverlays[this.pk].checked);
                //alert(this.pk + " - " + self.scanOverlays[this.pk].checked);
                $("#scanList")
                    .append($('<br />'))
                    .append(box)
                    .append($('<span></span>').html(this.fields.last_updated));
            });
            self.hideLoadingImage();
            $("#scanList input").click(function() {
                if($(this).attr('checked'))
                {
                    self.scanOverlays[$(this).attr('id')].checked = true;
                    self.scanOverlays[$(this).attr('id')].kml.setMap(self.map);
                }
                else
                {
                    self.scanOverlays[$(this).attr('id')].checked = false;
                    self.scanOverlays[$(this).attr('id')].kml.setMap(null);
                }
            });
        },
    "json");    
};

localground.basemap.prototype.drawOutlines = function() {
    var self = this;
    google.maps.event.addListener(this.map, 'idle', function() {
        var b = self.map.getBounds();
        var bounds = {
            'north': b.getNorthEast().lat(),
            'east': b.getNorthEast().lng(),
            'south': b.getSouthWest().lat(),
            'west': b.getSouthWest().lng()
        };
        //alert(JSON.stringify(bounds));
        $.getJSON(
            "/account/map/prints/",
            bounds,
            function(result) {
                //alert(JSON.stringify(result));
                $.each(result, function() {
                    if(self.polygons[this.pk_print] == null) {
                        var sw = new google.maps.LatLng(this.south, this.west);
                        var ne = new google.maps.LatLng(this.north, this.east);
                        var bounds = new google.maps.LatLngBounds(sw, ne);
                        
                        //add label first:
                        var mapLabel = new MapLabel({
                            text: this.num_scans,
                            position: bounds.getCenter(),
                            map: self.map,
                            fontSize: 20,
                            fontColor: '#333',
                            strokeWeight: 1,
                            strokeColor: '#fff',
                            align: 'center'
                        });
                        
                        //then add rect:
                        self.polygons[this.pk_print] = new google.maps.Rectangle({
                            bounds: bounds,
                            strokeColor: "#b85dc9", //"#727a35",
                            strokeWeight: 2,
                            fillColor: "#FFFFFF",
                            fillOpacity: 0.81,
                            id: this.pk_print,
                            num_scans: this.num_scans,
                            title: 'Print #' + this.pk_print
                        });
                        self.polygons[this.pk_print].setMap(self.map);
                        
                        
                        
                        google.maps.event.addListener(self.polygons[this.pk_print], 'click', function(evt){
                            alert(this.id + ' - ' + this.num_scans);
                        });
                        /*google.maps.event.addListener(self.polygons[this.pk_print], 'mouseover', function(evt){
                            //find poly w/smallest area that intersects mouse:
                            //alert(evt.latLng); //this works!
                            //this.setMap(null);
                            this.fillOpacity = 0.2;
                            //this.setMap(self.map);                            
                        });
                        google.maps.event.addListener(self.polygons[this.pk_print], 'mouseout', function(evt){
                            //find poly w/smallest area that intersects mouse:
                            //this.setMap(null);
                            this.fillOpacity = 0.1;
                            //this.setMap(self.map);                            
                        });*/
                    }
                    else {
                        //alert('already defined');
                        self.polygons[this.pk_print].setMap(null);
                        self.polygons[this.pk_print].setMap(self.map);  
                    }
                });
            },
        "json");
    });
};

localground.basemap.prototype.extendTwitterDropdowns = function() {
    $('.sub-menu').hide();
    $('input, .dropdown-menu > li').click(function(event) {
        event.stopPropagation();
    });
    
    $('.dropdown-menu > li, .dropdown-menu-inner > li').hover(
        function() { $(this).addClass('menu-item-selected'); },
        function() { $(this).removeClass('menu-item-selected'); }
    );
    $(function(){
        $(".dropdown-menu > li > a.trigger").on("click",function(e){
            var current=$(this).next();
            var grandparent=$(this).parent().parent();
            if($(this).hasClass('left-caret')||$(this).hasClass('right-caret'))
                $(this).toggleClass('right-caret left-caret');
            grandparent.find('.left-caret').not(this).toggleClass('right-caret left-caret');
            grandparent.find(".sub-menu:visible").not(current).hide();
            current.toggle();
            e.stopPropagation();
        });
        $(".dropdown-menu > li > a:not(.trigger)").on("click",function(){
            var root=$(this).closest('.dropdown');
            root.find('.left-caret').toggleClass('right-caret left-caret');
            root.find('.sub-menu:visible').hide();
        });

    });

}

localground.basemap.prototype.initLayout = function() {
    this.extendTwitterDropdowns();
    
    $(window).resize(function() {
        self.setPosition();
    });
      
    //set width:
    self.setPosition(this.minimizeRightPanel);

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
};

localground.basemap.prototype.setPosition = function(minimizeRightPanel) {
    if(minimizeRightPanel != null && minimizeRightPanel == true) {
        $('#opener > div > div')
            .removeClass('ui-icon-right-triangle')
            .addClass('ui-icon-left-triangle'); 
    }
    if($('#opener > div > div').hasClass('ui-icon-right-triangle')) {
        $('#map_canvas').css({
            'left': 0,
            'width': $('body').width()-340,
            'height': $('body').height()-40
        });
        $('#opener').css({
            'left': $('body').width()-340-$('#opener').width(),
            'display': 'block'
        });
        $('#map_panel').css({
            'left': $('body').width()-340,
            'width': 341,
            'height': $('body').height()-41,
            'display': 'block'
        });
        $('#panel_legend, #panel_download').css({
            'height': $('body').height()-120,
            'overflow-y': 'auto'
        });
        $('#panel_data').css({
            'height': $('#map_panel').height()-129,
            'overflow-y': 'auto'
        })
    }
    else {
        $('#map_canvas').css({
            'left': 0,
            'width': $('body').width(),
            'height': $('body').height()-40
        });
        $('#opener').css({
            'left': $('body').width()-$('#opener').width(),
            'display': 'block'
        });
        $('#map_panel').css({
            'left': $('body').width(),
            'height': $('body').height()-41,
            'display': 'block'
        });
    }
}

localground.basemap.prototype.addObject = function(opts) {
    if(opts == null) {
        alert("opts cannot be null");
        return false;
    }
    if (opts.show_footer == null) {
        opts.show_footer = true;
    }
    
    if(!opts.url)
        opts.url = '/profile/' + opts.object_name + '/create/embed/'
    this.addModal = new ui.dialog({
        id: 'add-modal',
        width: opts.width || 560,
        height: 450,
        iframeURL: opts.url,
        showTitle: false,
        submitButtonText: 'Save',
        showFooter: opts.show_footer,
        closeExtras: function() {
            if($('#add-modal').find('.hide').html() == 'Done')
                document.location.href = self.pageURL;
        }
    });
    this.addModal.show();
    return false;
}







