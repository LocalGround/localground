Array.prototype.max = function(){
    return Math.max.apply( Math, this );
};

Array.prototype.min = function(){
    return Math.min.apply( Math, this );
};

Array.prototype.sum = function(){
    return eval(this.join('+'));
};

// The .bind method from Prototype.js 
if (!Function.prototype.bind) { // check if native implementation available
  Function.prototype.bind = function(){ 
    var fn = this, args = Array.prototype.slice.call(arguments),
        object = args.shift(); 
    return function(){ 
      return fn.apply(object, 
        args.concat(Array.prototype.slice.call(arguments))); 
    }; 
  };
}



//http://bayarearides.com/rides/joaquinmiller/track.gpx
Map = function() {
    this.map;
    this.overlay;
    this.cursor = null;
    this.all_points = [];
    this.all_values = [];
    this.all_dates = [];
    this.points = [];
    this.values = [];
    this.currentIndex = 0;
    this.markers = [];
    this.coords = [];
    this.chart = null;
    this.bounds = null;
    this.buckets = 15;
    this.image_path = '/static/images/ebays/';
    this.date_format = d3.time.format("%Y-%m-%d");
    this.time_format = d3.time.format("%I:%M:%S %p");
};

Map.prototype.init = function(map, overlay){
    var self = this;
    this.map = map;
    this.overlay = overlay;
    this.chart = new Chart();

};

/*
Map.prototype.get_icon = function(index, show_outline) {
    var val = this.points[index].value;
    var suffix = '_no_outline';
    if(show_outline != null)
        suffix = '';
    if(val <= 15)
        return this.image_path + 'green' + suffix + '.png';
    else if(val <= 40)
        return this.image_path + 'yellow' + suffix + '.png';
    else if(val <= 65)
        return this.image_path + 'orange' + suffix + '.png';
    else if(val <= 150)
        return this.image_path + 'red' + suffix + '.png';
    else if(val <= 250)
        return this.image_path + 'purple' + suffix + '.png';
    else //250-500
        return this.image_path + 'purple' + suffix + '.png';
};*/

Map.prototype.get_icon = function(index, show_outline) {
    var val = this.points[index].value;
    var suffix = '_no_outline';
    if(show_outline != null)
        suffix = '';
    if(val <= 50)
        return this.image_path + 'green' + suffix + '.png';
    else if(val <= 100)
        return this.image_path + 'yellow' + suffix + '.png';
    else if(val <= 150)
        return this.image_path + 'orange' + suffix + '.png';
    else if(val <= 200)
        return this.image_path + 'red' + suffix + '.png';
    else if(val <= 300)
        return this.image_path + 'purple' + suffix + '.png';
    else 
        return this.image_path + 'maroon' + suffix + '.png';
};


Map.prototype.render_data = function(val, idx) {
    var self = this;
    this.chart_id = 'chart_' + idx;
    $.getJSON('/api/0/forms/84/data/.json',
        {
            'query': 'WHERE col_4 = \'' + val + '\''
        },
        function(result){
            //points = result.records;
           self.load_points(val, result.results);
        },
    'json');
};

Map.prototype.load_points = function(dataset_name, records) {
    //alert(records.length);
    var self = this;
    //this.clear_data();
    this.bounds = new google.maps.LatLngBounds();
    var counter = 0;
    var point = null;
    var format = d3.time.format("%m/%d/%Y, %I:%M:%S %p"); //07/17/2012, 03:00:02 PM
    $.each(records, function(index) {
        point = {
            date: format.parse(this.recs[0]),
            value: parseInt(this.recs[2]*1000)
        };
        //alert(JSON.stringify(this.point));
        if(this.point != null) {
            point.lat = this.point.lat;
            point.lng = this.point.lng;
        }
        self.all_points.push(point);
        self.all_values.push(point.value);  
        self.all_dates.push(point.date);    
        if(index % self.buckets == 0 || index == records.length-1 || point.value > 50){
            self.points[counter] = point;
            self.values[counter] = point.value;
            if(this.point != null) {
                var latLng = new google.maps.LatLng(this.point.lat, this.point.lng);
                self.bounds.extend(latLng);
                var marker = new google.maps.Marker({
                    position: latLng,
                    //zIndex: google.maps.Marker.MAX_ZINDEX + parseInt(this.value),
                    map: self.map,
                    icon: self.get_icon(counter)
                });
                self.attach_hover(marker, counter);
                self.markers.push(marker);
            }
            ++counter;
        }
    });
    this.map.fitBounds(this.bounds);
    
    this.stats = new Stats();
    this.stats.init(dataset_name, this.all_values, this.all_dates);
    
    this.chart.init({
        id: this.chart_id,
        data: this.points,
        width: ($('#map_canvas').width() - 12),
        circle_radius: 6,
        x_range: [this.all_dates.min(), this.all_dates.max()],
        y_range: [0, 200],
        mouseover_function: this.chart_highlight.bind(this),
        mouseout_function: this.chart_unhighlight.bind(this),
        click_function: this.zoom_to_point.bind(this)
    });
    var is_minimized = $('#chart_opener > div > div').hasClass('ui-icon-top-triangle');
    if(is_minimized)
        $('#chart_opener').trigger('click');    
    this.stats.addSummaryPanel();
    
};

Map.prototype.chart_highlight = function(d, i) {
    this.currentIndex = i;
    if(this.cursor) { this.cursor.setMap(this.map); }
    this.show_active(this.currentIndex, true);
};

Map.prototype.chart_unhighlight = function() {
    this.chart.highlight_circle
                .style('stroke-width', 0.5)
                .style('stroke', '#fff')
                .style('stroke-opacity', 0.1);
    //restore svg:circle element position
    var vis = d3.select("#" + this.chart.id);
    var old_svg_elem_slot = vis.select('circle:nth-of-type(' + (this.currentIndex+1) + ')')[0][0];
    this.chart.highlight_circle[0][0]
                .parentNode.insertBefore(
                            this.chart.highlight_circle[0][0], old_svg_elem_slot);
    
    this.cursor.setIcon(this.get_icon(this.currentIndex));
    this.chart.tooltip.style('display', 'none');
}

Map.prototype.zoom_to_point = function(d, i) {
    if(this.points[this.currentIndex].lat) {
        var latLng = new google.maps.LatLng(
                            this.points[this.currentIndex].lat,
                            this.points[this.currentIndex].lng);
        this.map.panTo(latLng);
        this.map.setZoom(20);
    }
    /*else {
        alert('No point defined');
    }*/
}

Map.prototype.clear_data = function() {
    this.coords = [];
    this.points = [];
    $.each(this.markers, function(){
        this.setMap(null); 
    });
    if(this.cursor)
        this.cursor.setMap(null);
    d3.select("#" + this.chart.id).select('svg').remove();
    $("#" + this.chart.id).next().remove();
    $("#" + this.chart.id).remove();
};

Map.prototype.attach_hover = function(marker, idx) {
    var self = this;
    google.maps.event.addListener(marker, 'mouseover', function() {
        self.currentIndex = idx;
        self.show_active(self.currentIndex, false);
    });
    google.maps.event.addListener(marker, 'mouseout', function() {
        self.currentIndex = idx;
        self.chart_unhighlight();
    });
};


Map.prototype.show_active = function(idx, is_chart) {
    var self = this;
    var latlng = new google.maps.LatLng(this.points[idx].lat, this.points[idx].lng);
    if(this.cursor == null) {
        this.cursor = new google.maps.Marker({
            position: latlng,
            map: this.map,
            icon: this.get_icon(idx, true),
            zIndex: google.maps.Marker.MAX_ZINDEX + 100000
        });
        //zIndex: google.maps.Marker.MAX_ZINDEX + 100000;
        google.maps.event.addListener(this.cursor, 'mouseover', function() {
            self.show_active(self.currentIndex, false);
            var projection = self.overlay.getProjection(); 
            var pixel = projection.fromLatLngToContainerPixel(self.cursor.getPosition());
            $('#tooltip').css({
                top:  pixel.y - 30,
                left:  pixel.x + 20,
                display: 'block'
            });
        });
        google.maps.event.addListener(this.cursor, 'mouseout', function() {
            self.chart_unhighlight();
        });
        google.maps.event.addListener(this.cursor, 'click', function(){
            self.zoom_to_point();
        });
    }
    else {
        this.cursor.setPosition(latlng);
        this.cursor.setIcon(this.get_icon(idx, true));
    }
    this.cursor.setZIndex(google.maps.Marker.MAX_ZINDEX + 100000);

    var vis = d3.select("#" + this.chart.id);
    this.chart.highlight_circle = vis.select('circle:nth-of-type(' + (idx+1) + ')');
    this.chart.highlight_circle
                    .style("stroke-width", 2)
                    .style('stroke', '#444')
                    .style("stroke-opacity", "1.0");
    this.chart.highlight_circle[0][0].parentNode.appendChild(this.chart.highlight_circle[0][0]);
    var r = parseFloat(this.chart.highlight_circle.attr('r'));
    var tiptop = $('#' + this.chart.id).offset().top - $('#tooltip').height() - 20;
    //parseFloat(this.chart.highlight_circle.attr('cy'));
    var left = parseFloat(this.chart.highlight_circle.attr('cx')) + 2*r + 10;

    $('#tooltip')
            .html(
                '<span>Rating:</span> ' + this.chart.get_rating(this.points[idx].value) + '<br>' +
                '<span>Date:</span>' + this.date_format(this.points[idx].date) + '<br>' +
                '<span>Time:</span> ' + this.time_format(this.points[idx].date) + '<br>' +
                '<span>Value:</span> ' + this.points[idx].value + '<br>' +
                '<span>Size:</span> ' + 2.5
            )
            .css({
                'background-color': this.chart.highlight_circle.style("fill"),
                color: this.points[idx].value >= 150 ? '#FFF' : '#222',
                height: 88
            });
    if(is_chart) {
        $('#tooltip').css({
            top: tiptop, //parseInt(circle.attr('cy')) + offset_top - 105,
            left: parseInt(this.chart.highlight_circle.attr('cx'))-75,
            display: 'block'
        })
    }
};

Stats = function() {
    this.dataset_name;
    this.values = null;
    this.dates = null;
    this.container = null;  
};

Stats.prototype.init = function(dataset_name, all_values, all_dates) {
    var self = this;
    this.dataset_name = dataset_name;
    this.values = all_values;
    this.dates = all_dates;
    this.date_format = d3.time.format("%Y-%m-%d");
    this.time_format = d3.time.format("%I:%M:%S %p");
    //this.getFrequency();
};

Stats.prototype.addSummaryPanel = function() {
    this.$container = $('<div></div>')
                        .addClass('summary')
                        .width($('#map_panel').width() - 43);
    $('#chart_holder')
        .width($('body').width() - 28)
        .append(this.$container);
    
    var mean = this.values.sum()/parseFloat(this.values.length);
    this.$container.append('<h3>' + this.dataset_name + '</h3>');
    this.$container.append('<span>Count:</span><div>' + this.values.length + '</div>');
    this.$container.append('<span>Mean:</span><div>' + mean.toFixed(1) + '</div>');
    this.$container.append('<span>High:</span><div>' + this.values.max() + '</div>');
    this.$container.append('<span>Low:</span><div>' + this.values.min() + '</div>');
    this.$container.append('<span>Start:</span><div>' + this.time_format(this.dates[0]) + '</div>');
    this.$container.append('<span>End:</span><div>' + this.time_format(this.dates[this.dates.length-1]) + '</div>');
};

Stats.prototype.getFrequency = function() {
    var freq = {};
    this.values.sort();
    $.each(this.values, function(){
        freq[this] = (freq[this] == null) ? 1 : ++freq[this];    
    })
    var str = '';
    for (var key in freq) {
        str += key + ': ' + freq[key] + ', ';
    }

    alert(str);
};

