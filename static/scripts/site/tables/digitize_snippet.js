localground.snippet = function(){
    this.embed = false;
    this.form_id = null;
    this.infoBubble = null;
    this.marker = null;
    this.backgroundMarkers = [];
    this.overlay = null;
    this.print = null;
    this.scan = null;
    this.scans = [];
    this.scan_points = [];
    this.snippet = null;
    this.zoom = 13;
    this.currentIndex = 0;
};
localground.snippet.prototype = new localground.basemap();           // Here's where the inheritance occurs 

localground.snippet.prototype.initialize=function(opts){
    self = this;
    this.print = opts.print || this.print;
    this.scan =  opts.scan || this.scan;
    this.scans =  opts.scans || this.scans;
    this.scan_points = opts.scan_points || this.scan_points;
    this.form_id =  opts.form_id || this.form_id;
    this.snippet =  opts.snippet || this.snippet;
    this.embed = opts.embed || this.embed;
    
    if(this.snippet == null) {
        $('#lat, #lng').val('');    
    }
    
    opts.center = new google.maps.LatLng(37.855365, -122.272614);
    $('#id_point').val('');
    if(this.snippet) {
        opts.center = this.snippet.point;
    }
    else if(this.print) {
        opts.center = new google.maps.LatLng(
                            this.print.center_lat, this.print.center_lng);
    }
    if(this.print && this.print.zoomLevel)
        opts.zoom = this.print.zoomLevel;
    else
        opts.zoom = 18;
    localground.basemap.prototype.initialize.call(this, opts);
    
    
    google.maps.event.trigger(this.map, 'resize');
    
    google.maps.event.addListener(this.map, 'click', function(event) {
        self.addMarker(event.latLng);
    });
    
    this.initRotator();

    if(this.scan != null) {
        $.each(this.scans, function(index) {
            if(this.id == self.scan.id)
                self.currentIndex = index;
        }) 
        this.addGroundOverlay(this.scan);
    }
    else if(this.scans.length > 0) {
        this.addGroundOverlay(this.scans[0]);
    }
        
    //add marker too:
    if(this.snippet) {
        this.addMarker(this.snippet.point, this.snippet);
        this.savePosition(this.snippet.point);
    }
    
    //add listener to row-num textbox:
    $('#id_num').blur(function(){
        if(self.marker != null) {
            self.marker.setIcon(self.getIcon(true, null));
            self.marker.num = $('#id_num').val();
        }
    });
    
    $('#lat, #lng').blur(function() {
        var lat = null, lng = null, new_point = null;
        lat = parseFloat($('#lat').val());
        lng = parseFloat($('#lng').val());
        if(isNaN(lat) || isNaN(lng))
            lat = null, lng = null;    
        else
            new_point = new google.maps.LatLng(lat, lng);
        
        if(new_point != null) {
            self.addMarker(new_point, {});
            self.map.setCenter(new_point);
        }
    });
    
    $('input').keypress(function(event) {
        return self.disableEnterKey(event);
    });
    
    $('#the_form').submit(function() {
        /*if(self.marker == null) {
            self.displayMessage(['Please define a marker'], {error: true});
            return false;
        }*/
        return true;
    });
    
    $('#save_and_continue').click(function() {
        $('#next_record').val("true");
    });
    $('#save').click(function() {
        $('#next_record').val("false");
    });
    
    $('.close').click(function(){
        $('#latlng_manual_edit').hide();
        $('#latlng_manual_edit_btn').show();
        return false;
    });
    
    $('#latlng_manual_edit_btn').click(function(){
        $('#latlng_manual_edit').show();
        $(this).hide();
        return false;
    });
};

localground.snippet.prototype.getIcon = function(isActive, iconText) {
    ////gmaps-utility-library-dev.googlecode.com/svn/tags/mapiconmaker/1.1/examples/markericonoptions-wizard.html
    var imageURL = '//chart.apis.google.com/chart?';
    var color = 'CCCCCC', fontColor = '000000';
    if(isActive) {
        /*color = 'DD1C77', fontColor = 'FFFFFF'; //'66A61E';
        imageURL += 'chst=d_map_pin_letter&chld=';
        imageURL += ((iconText != null) ? iconText : $('#id_num').val());
        imageURL += '|' + color + '|' + fontColor;*/
        iconText = (iconText != null) ? iconText : $('#id_num').val();
        iconText = (iconText.toString().length > 0) ? iconText : '?';
        if(this.print == null)
            iconText = '';    
        imageURL += 'cht=it&chs=30x30&chco=DD1C77,000000ff,ffffff01&chl=';
        imageURL += iconText;
        imageURL += '&chx=ffffff,0&chf=bg,s,00000000&chts=ffffff,18&ext=.png';
    }
    else {
        iconText = (iconText.toString().length > 0) ? iconText : '?';
        imageURL += 'cht=it&chs=30x30&chco=cccccc,000000ff,ffffff01&chl=';
        imageURL += iconText + '&chx=666666,0&chf=bg,s,00000000&chts=ffffff,18&ext=.png';    
    }
    return imageURL;
};

localground.snippet.prototype.addMarker = function(latLng, opts) {
    if(self.marker == null) {
        self.marker = new google.maps.Marker({
            map: self.map,
            position: latLng,
            draggable: true,
            icon: self.getIcon(true, null)
        });
        if(opts) {
            if(opts.id)
                self.marker.id = opts.id;
            if(opts.num)
                self.marker.num = opts.num;
        }
        google.maps.event.addListener(self.marker, 'dragend', function(mouseEvent) {
            self.savePosition(mouseEvent.latLng);
        });
        google.maps.event.addListener(self.marker, 'drag', function(mouseEvent) {
            if(self.infoBubble)
                self.infoBubble.close();
        });
        google.maps.event.addListener(self.marker, 'click', function(mouseEvent) {
            self.showInfoBubble(self.marker);
        });
    }
    else {
        self.marker.setPosition(latLng);
    }
    self.savePosition(latLng);    
};

localground.snippet.prototype.savePosition = function(point) {
    $('#id_point').val('SRID=4326;POINT(' +  point.lng().toFixed(6) + ' ' +
                       point.lat().toFixed(6) + ')');
    $('#lat').val(point.lat().toFixed(6));
    $('#lng').val(point.lng().toFixed(6));
    //this.map.panTo(point);
};

localground.snippet.prototype.initRotator = function() {
    $li = $('<li></li>');
    $a = $('<a href="#">&laquo;</a>').addClass('get_image back');
    $('#rotator ul').append($li.append($a));    
    $.each(self.scans, function(index) {
        $li = $('<li></li>');
        $a = $('<a href="#"></a>').html(index+1).addClass('get_image');
        $('#rotator ul').append($li.append($a));   
    });
    $li = $('<li></li>');
    $a = $('<a href="#">&raquo;</a>').addClass('get_image forward');
    $('#rotator ul').append($li.append($a));
    
    $('.get_image').click(function() {
        if($(this).hasClass('back')) {
            --self.currentIndex;
            if(self.currentIndex < 0)
                self.currentIndex = self.scans.length-1;
        }
        else if($(this).hasClass('forward')) {
            ++self.currentIndex;
            if(self.currentIndex >= self.scans.length)
                self.currentIndex = 0;
        }
        else {
            self.currentIndex = (parseInt($(this).html()) - 1);
        }
        self.addGroundOverlay(self.scans[self.currentIndex]);
        return false; 
    });
    
    $('#hide_map_image').click(function() {
        if($(this).html() == 'hide map image') {
            self.overlay.setMap(null);
            $(this).html('show map image');
            $('#id_scan').val('');
            return false;
        }
        else {
            self.overlay.setMap(self.map);
            $(this).html('hide map image');
            $('#id_scan').val(self.scans[self.currentIndex].id);
            return false;    
        }
    });
};

localground.snippet.prototype.initLayout = function() {
    //do nothing!    
};


localground.snippet.prototype.addGroundOverlay = function(scan) {
    if(this.overlay != null) {
        this.overlay.setMap(null);
        this.overlay = null;
    }
    this.overlay = new google.maps.GroundOverlay(
        scan.overlay_path, 
        new google.maps.LatLngBounds(
            new google.maps.LatLng(scan.south, scan.west),
            new google.maps.LatLng(scan.north, scan.east)
        )
    );
    this.overlay.setMap(this.map);
    $('#id_scan').val(scan.id);
    google.maps.event.addListener(this.overlay, 'click', function(event) {
        self.addMarker(event.latLng);
    });
    $('#rotator .active').removeClass('active');
    $('#rotator li:eq(' + (this.currentIndex+1) + ')').addClass('active');
    self.getRecordsByScan(scan);
};

localground.snippet.prototype.getRecordsByScan = function(scan) {
    var url = '/scans/get-records-by-map-image/' + scan.uuid + '/';
    params = { form_id: $('#form_id').val() };
    $.each(self.backgroundMarkers, function(index) {
        self.backgroundMarkers[index].setMap(null);
        self.backgroundMarkers[index] = null;
        //alert('null');
    });
    self.backgroundMarkers = [];
    $.getJSON(url, params,
        function(result) {
            //alert(JSON.stringify(result));
            $.each(result.records, function(index) {
                //render all markers that aren't the current marker:
                if(self.marker == null || self.marker.id != this.id) {
                    if(this.lat && this.lng) {
                        //only render if record has been geo-referenced:
                        var bg_marker = new google.maps.Marker({
                            map: self.map,
                            position: new google.maps.LatLng(this.lat, this.lng),
                            draggable: false,
                            id: this.id,
                            icon: self.getIcon(false, this.num)
                        });
                        if(this.num)
                            bg_marker.num = this.num;
                        google.maps.event.addListener(bg_marker, 'click', function(mouseEvent) {
                            self.showInfoBubble(bg_marker);
                        });
                        self.backgroundMarkers.push(bg_marker);
                    }
                }
                //showInfoBubble
            });
        },
    'json');    
};

localground.snippet.prototype.showInfoBubble = function(marker) {
    if(this.infoBubble == null) {
        this.infoBubble = new InfoBubble({
            maxWidth: 250,
            borderRadius: 0,
            maxHeight: 50,
            padding: 0
        });
    }
    var $contentContainer = $('<div></div>')
                    .css({
                        'width': '160px',
                        'height': '50px',
                        'margin': '5px 0px 5px 10px',
                        'overflow-y': 'auto',
                        'overflow-x': 'hidden',
                        'text-align': 'left'
                    });
    
    var htmlString = ''
    if(marker.id == this.marker.id) {
        htmlString = 'Drag this marker to the place where this information was observed.'    
    }
    else {
        var url = '/scans/update-record/'
        if(self.embed)
            url += 'embed/';
        url += '?id=' + marker.id + '&form_id=' + this.form_id;
        var htmlString = '<img src="' + marker.icon +
                            '" style="float:left;vertical-align:bottom;margin-right: 5px;" />';
        htmlString += '<a href="' + url + '">Edit this record</a>';
        htmlString += '<br /><em>(unsaved changes will be lost)</em>';
    }
    $contentContainer.html(htmlString);
    this.infoBubble.setFooter(null);    
    this.infoBubble.setContent($contentContainer.get(0)); 
    this.infoBubble.open(this.map, marker);
};
