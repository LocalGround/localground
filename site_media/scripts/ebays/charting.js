Chart = function() {
    this.id = 'chart_1';
    this.width;
    this.height;
    this.data;
    this.x_range; //time
    this.y_range;
    this.selection_function;
    this.mouseover_function;
    this.mouseout_function;
    this.click_function;
    //this.scale_factor_x;
    //this.scale_factor_y;
    //this.rect;
    //this.selected_indexes;
    //this.bar_width = 1;
    this.circle_radius = 5;
    this.label_buffer = 16;
    this.left_offset = 30;
    this.tooltip = null;
    this.highlight_circle = null;
}


Chart.prototype.make_y_axis = function() {
    return d3.svg.axis()
        .scale(this.y)
        .orient("left")
        .ticks(3); //parseInt(this.y_range.max()/50))
}

Chart.prototype.init = function(opts) {
    var self = this;
    $.extend(this, opts);
    $('#chart_holder').append(
            $('<div></div>')
                .addClass('chart_container')
                .css({width: this.width})
                .attr('id', this.id)
    );
    
    this.width = this.width || $("#" + this.id).width();
    this.height = $("#" + this.id).height() - this.label_buffer;
    //this.scale_factor_x = this.width/(this.data.length*this.bar_width);
    //this.scale_factor_y = this.height/(this.y_range.max()-this.y_range.min());
    
    this.y = d3.scale.linear().domain(this.y_range).range([this.height, 0]);
    this.x = d3.time.scale().domain(this.x_range).range([0,this.width]);
   
    this.tooltip = d3.select("#tooltip").attr('height', 80);

    this.chart = d3.select("#" + this.id).append("svg")
       .attr("class", "chart")
       .attr("width", this.width)
       .attr("height", this.height + this.label_buffer);
       
    this.chart = this.chart.append("svg:g").attr("transform", "translate(" + this.left_offset + ", 8)");
    var rules = this.chart.append("svg:g").classed("rules", true);
    
    //grid lines:
    rules.append("svg:g").classed("grid y_grid", true)
    .call(this.make_y_axis()
      .tickSize(-this.width,0,0)
      .tickFormat("")
    )
    
    //labels:
    rules.append("svg:g").classed("labels y_labels", true)
        .call(this.make_y_axis()
          .tickSubdivide(1)
          .tickSize(6, 5, 6)  //major, minor, end
        )

    //this.renderBars();
    this.renderCircles();
};


/*Chart.prototype.get_bar_color = function(val) {
    if(val <= 15)
        return '#33ff00';
    else if(val <= 40)
        return '#FFFF33';
    else if(val <= 65)
        return '#FEB24C';
    else if(val <= 150)
        return '#ff0000';
    else if(val <= 250)
        return '#4A1486';
    else
        return '#4A1486';
};*/

Chart.prototype.get_bar_color = function(val) {
    if(val <= 50)
        return '#33ff00';
    else if(val <= 100)
        return '#FFFF33';
    else if(val <= 150)
        return '#FEB24C';
    else if(val <= 200)
        return '#ff0000';
    else if(val <= 300)
        return '#4A1486';
    else
        return '#4A1486';
};

Chart.prototype.get_rating = function(val) {
    if(val <= 50)
        return 'Good';
    else if(val <= 100)
        return 'Moderate';
    else if(val <= 150)
        return 'Unhealthy for Some';
    else if(val <= 200)
        return 'Unhealthy';
    else if(val <= 300)
        return 'Very Unhealthy';
    else
        return 'Hazardous';
};


/*Chart.prototype.get_rating = function(val) {
    if(val <= 15)
        return 'Good';
    else if(val <= 40)
        return 'Moderate';
    else if(val <= 65)
        return 'Unhealthy for Some';
    else if(val <= 150)
        return 'Unhealthy';
    else if(val <= 250)
        return 'Very Unhealthy';
    else
        return 'Hazardous';
};*/

/*Chart.prototype.get_scaled_rect_xy = function (rect) {
    var element = rect[0][0];
    var p = element.nearestViewportElement.createSVGPoint();
    var matrix = element.getTransformToElement(element.nearestViewportElement);
    p.x = parseFloat(rect.attr('x'));
    p.y = parseFloat(rect.attr('y'));
    var scaled_point = p.matrixTransform(matrix);
    return scaled_point;
};*/

Chart.prototype.renderBars = function() {
    var self = this;
    this.rect = this.chart.append("g")
       //.attr("transform", "scale(" + this.scale_factor_x + ',' + this.scale_factor_y + ")")
       .selectAll("rect")
       .data(this.data)
       .enter().append("rect")
       .attr("x", function(d, i) { return self.bar_width*i; })
       .attr("y", function(d) { return self.height - d.value; })
       .attr("width", this.bar_width)
       .attr("height", function(d) { return d.value; })
       .style("fill", function(d, i){ return self.get_bar_color(d.value); })
       .style("stroke", function(d, i){ return self.get_bar_color(d.value); })
       .on("mouseover", function(d, i) {
            self.mouseover_function(d, i);
        })
       .on("mouseout", function(d, i){
            var rect = d3.select('rect:nth-of-type(' + (i+1) + ')');
            rect.style("fill", function(d, i){ return self.get_bar_color(d.value); })
                .style("stroke", function(d, i){ return self.get_bar_color(d.value); });
            return self.tooltip.style("display", "none");
        });   
};

/*Chart.prototype.getCircleOffset = function(i) {
    var offset_distance = 2*this.circle_radius-4;
    var num_buckets = (this.width-this.left_offset) / offset_distance;
    var num_per_bucket = parseFloat(this.data.length)/num_buckets;
    return this.circle_radius + offset_distance*parseInt(i/num_per_bucket);
};*/

Chart.prototype.renderCircles = function() {
    this.scale_factor_x = 1;
    var self = this;
    this.circle = this.chart.append("g")
       .selectAll("circle")
       .data(this.data)
       .enter().append("svg:circle")
       .attr("cx", function(d, i){ return self.x(d.date); })
       .attr("cy", function(d) { return self.y(d.value); })
       .attr("r", this.circle_radius)
       .style("stroke", '#666')
       .style("stroke-width", "0.5")
       .style("stroke-opacity", "0.1")
       .style("fill", function(d, i){ return self.get_bar_color(d.value); })
       .on("mouseover", function(d, i) {
            self.mouseover_function(d, i);
        })
       .on("mouseout", function(){
            self.mouseout_function();
        })
       .on("click", function(d, i){
            self.click_function(d, i);
        });
    //this.turn_on_brushing();
};


