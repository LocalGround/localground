//1. put your credentials here:
var username = "vanwars";
var password = "my_password";

//2. define functions here:
function initialize(){
    
    //attach event handlers:
    $('#get_data').click(function(){
        getData(showCode);
    });
    $('#get_scatterplot').click(function(){
        getData(showScatter);
    });
    $('#get_histogram').click(function(){
        getData(showHistogram);
    });
    $('#get_variables').click(function(){
        getVariableData(showDraggableVariables);
    });
    
    $('#get_two_variables').click(function(){
        getVariableData(showTwoDraggableVariables);
    });
    
    //setup AJAX:
    setUpAjax();

}

function setUpAjax() {
    $.ajaxSetup({
        beforeSend: function(xhr){
            xhr.setRequestHeader("Authorization",
                "Basic " + btoa(username + ":" + password));
        }
    });
}

function getData(callback) {
    $.ajax({
        url: $('#url').val(),
        type: 'GET',
        dataType: 'json',
        crossDomain: true,
        error: function(x, e) {
            var msg = "HTTP " + x.status + " error: " + x.responseText;
            $("#results").html(msg);
            prettyPrint(); 
        },
        success: function(result) {
            callback(result);
        }
    });
}

function getVariableData(callback) {
    $.ajax({
        url: $('#url').val(),
        type: 'OPTIONS',
        dataType: 'json',
        crossDomain: true,
        error: function(x, e) {
            var msg = "HTTP " + x.status + " error: " + x.responseText;
            $("#results").html(msg);
            prettyPrint(); 
        },
        success: function(result) {
            callback(result);
        }
    });
}


function showCode(result) {
    var txt = JSON.stringify(result, null, 2);
    $("#results").html('<pre class="prettyprint">' + txt + '</pre>');
    prettyPrint();
}

function showScatter(result) {
    var list = result.results;
    
    //loop through data:
    var data = [];
    $.each(list, function(){
        data.push([this.spider_count, this.soil_compactness]);
    });
    console.log(data);
    $('#results').highcharts({
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        legend: false,
        title: {
            text: 'Spider Count v. Soil Compactness'
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Spider Count'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'Soil Compactness'
            }
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 15,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>Observation</b><br>',
                    pointFormat: '{point.x} spiders & {point.y} cm deep'
                }
            }
        },
        series: [{
            color: 'rgba(223, 83, 83, .5)',
            data: data
        }]
    });
}
function showNewScatter(result) {
    var list = result.results;
    
    //loop through data:
    var data = [];
    $.each(list, function(){
        data.push([this[user_selection_series_x], this[user_selection_series_y]]);
    });
    console.log(data);
    $('#results').highcharts({
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        legend: false,
        title: {
            text: user_selection_series_x + ' v. ' + user_selection_series_y
        },
        xAxis: {
            title: {
                enabled: true,
                text: user_selection_series_x
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: user_selection_series_y
            }
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 15,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>Observation</b><br>',
                    pointFormat: '{point.x} ' + user_selection_series_x + ' & {point.y} ' + user_selection_series_y
                }
            }
        },
        series: [{
            color: 'rgba(223, 83, 83, .5)',
            data: data
        }]
    });
}
function showHistogram(result){
    var list = result.results;
    console.log(list);
    var categories = [];
    var series1 = [];
    /*for(i=0; i < list.length; i++) {
        categories.push(list[i].team_members);
        series1.push(list[i].spider_count);
        series2.push(list[i].worm_count);
        series3.push(list[i].insect_count);   
    }*/
    
    $.each(list, function(){
        console.log("this is this: ", this);
        categories.push(this[user_selection_categories]);
        series1.push(this[user_selection_series]);
    });
    console.log("series1: ", series1);
     $('#results').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: user_selection_series
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            min: 0,
            title: {
                text: user_selection_series
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table class="table table-condensed">',
            pointFormat: '<tr><td>{series.name}: </td>' +
                '<td style="border-right: solid 5px {series.color};">{point.y}</td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [
            {
                name: user_selection_categories,
                data: series1
            }
        ]
    });
}

function showDraggableVariables(result) {
    $("#results").html('');
    var list = result.actions.POST;
    //exclude system variables
    var excludeList = ["id", "overlay_type", "url", "geometry", "manually_reviewed" , "project_id", "num"];
    
    
    var $theSource = $('<div>Drag these variables to the div below to update the chart:<br /></div>').attr("id", "the_source");
    var $theOtherTarget = $('<div>Make a chart based on these variables in the y-axis:<br /></div>').attr("id", "the_other_target");
    var $theTarget = $('<div>Make a chart based on these variables in the x-axis:<br /></div>').attr("id", "the_target");
    
    for (key in list){
        if (excludeList.indexOf(key) == -1) {
            var $el = $('<div></div>')
                .attr("draggable", true)
                .attr("id", key)
                .html(key + " (" + list[key].type + ")");
            $el.bind('dragstart', function(e){
                $(this).css({
                    'background-color': '#e631ee;'    
                });
                event.dataTransfer.setData('Text', $(this).attr("id"));
                $(this).addClass("highlighted");
            });

            $theSource.append($el);
        }   
    }
    
    $theSource.bind('dragover', function(e){
        event.preventDefault();
    });
    
    $theOtherTarget.bind('dragover', function(e){
        event.preventDefault();
    });
    $theTarget.bind('dragover', function(e){
        event.preventDefault();
    });
    $theSource.bind('drop', function(e){
        var field_id = event.dataTransfer.getData('Text');
        var $elem = $('#' + field_id).removeClass("chosen").removeClass("highlighted");
        $(this).append($elem);
        //alert("remove variable from chart");
    });
    $theTarget.bind('drop', function(e){
        var field_id = event.dataTransfer.getData('Text');
        var $elem = $('#' + field_id).addClass("chosen").removeClass("highlighted");
        $(this).append($elem);
        user_selection_categories = $elem.attr("id");
        //alert("add variable to chart (if it makes sense)");
    });
    $theOtherTarget.bind('drop', function(e){
        var field_id = event.dataTransfer.getData('Text');
        var $elem = $('#' + field_id).addClass("chosen").removeClass("highlighted");
        $(this).append($elem);
        //alert("add variable to chart (if it makes sense)");
        user_selection_series = $elem.attr("id");
        getData(showHistogram);
    });
    
    $("#results").append($theSource);
    $("#results").append($theOtherTarget);
    $("#results").append($theTarget);
    


}

function showTwoDraggableVariables(result) {
    $("#results").html('');
    var list = result.actions.POST;
    //exclude system variables
    var excludeList = ["id", "overlay_type", "url", "geometry", "manually_reviewed" , "project_id", "num"];
    
    
    var $theSource = $('<div>Drag these variables to the div below to update the chart:<br /></div>').attr("id", "the_source");
    var $theOtherTarget = $('<div>Make a chart based on these variables in the y-axis:<br /></div>').attr("id", "the_other_target");
    var $theTarget = $('<div>Make a chart based on these variables in the x-axis:<br /></div>').attr("id", "the_target");
    
    for (key in list){
        if (excludeList.indexOf(key) == -1) {
            var $el = $('<div></div>')
                .attr("draggable", true)
                .attr("id", key)
                .html(key + " (" + list[key].type + ")");
            $el.bind('dragstart', function(e){
                $(this).css({
                    'background-color': '#e631ee;'    
                });
                event.dataTransfer.setData('Text', $(this).attr("id"));
                $(this).addClass("highlighted");
            });

            $theSource.append($el);
        }   
    }
    
    $theSource.bind('dragover', function(e){
        event.preventDefault();
    });
    
    $theOtherTarget.bind('dragover', function(e){
        event.preventDefault();
    });
    $theTarget.bind('dragover', function(e){
        event.preventDefault();
    });
    $theSource.bind('drop', function(e){
        var field_id = event.dataTransfer.getData('Text');
        var $elem = $('#' + field_id).removeClass("chosen").removeClass("highlighted");
        $(this).append($elem);
        //alert("remove variable from chart");
    });
    $theTarget.bind('drop', function(e){
        var field_id = event.dataTransfer.getData('Text');
        var $elem = $('#' + field_id).addClass("chosen").removeClass("highlighted");
        $(this).append($elem);
        user_selection_series_x = $elem.attr("id");
        //alert("add variable to chart (if it makes sense)");
    });
    $theOtherTarget.bind('drop', function(e){
        var field_id = event.dataTransfer.getData('Text');
        var $elem = $('#' + field_id).addClass("chosen").removeClass("highlighted");
        $(this).append($elem);
        //alert("add variable to chart (if it makes sense)");
        user_selection_series_y = $elem.attr("id");
        getData(showNewScatter);
        
    });
  
    
    $("#results").append($theSource);
    $("#results").append($theOtherTarget);
    $("#results").append($theTarget);
    


}
//3. call functions here
initialize();



