var self;
Match = function(opts) {
    this.isAdmin = opts.isAdmin;
    this.serverURL = opts.serverURL;
    this.attachments = opts.attachments;
    this.scans = [];
    this.canvasDiv = null;
    this.gr = null;
    this.snipRect = new Array();
    this.ie = false;
};

Match.prototype.init = function(opts) {
    self = this;
    if(document.all)
        this.ie  = true;
        
    $('#this_print_only, #show_unmatched_scans, #show_unmatched').attr('checked', false);
    //$('#show_unmatched').attr('checked', false);
        
    //set up editor:
    this.canvasDiv = document.getElementById('editPanel');
    this.gr = new jsGraphics(this.canvasDiv);
    this.snipRect = new Array();
    this.setPenColor('#ff0000', 2);
    this.canvasDiv.onmousemove  = this.getMouseXY;
    this.canvasDiv.onclick      = this.drawPoint;
        
    //init attachments:
    $.each(self.attachments, function() {
        $('#attachment').append(
            $('<option></option>').attr('value', this.id)
                .html(this.name + ' (' + this.id + ')'));  
        
    });
    
    $('#print').val('-1');
    $('#print, #attachment').selectmenu({
        width: 300,
        menuWidth: 450,
        //format: this.selectMenuFormatting,
        style:'dropdown'
    });
};

Match.prototype.showScan = function() {
    var id = $('#scan').val();
    $.each(self.scans, function() {
        if(this.id == id) {
            var src = self.serverURL + '/static/scans/' + this.id + '/' + this.thumbnail_name;
            $('#scanImage').css({'display': 'block'})
                .attr('src', src);
            if(this.attachments.length > 0) {
                $('#attachment').val(this.attachments[0].toString());
                $('#attachment').selectmenu('value', this.attachments[0].toString());
                $('#attachment').trigger('change');
            }
        }
    });
};
    
/*Match.prototype.showAttachment = function() {
    var id = $('#attachment').val();
    alert(self.attachments.length);
    $.each(self.attachments, function() {
        if(this.id == id) {
            alert("match!");
            var src = opts.serverURL + this.thumb_path;
            $("<img/>").attr("src", src).appendTo("#editPanel");
        }
    });
};*/
    
    
Match.prototype.getScans = function() {
    $('#scanImage').css({'display': 'none'});
    var url = '/scans/by-print-id/' + $('#print').val() + '/';
    var opts = {};
    if($('#show_unmatched_scans').attr('checked') && $('#print').val() != '-1') {
        opts.unmatched = true;
    }
    $.get(
        url,
        opts,
        function(data) {
            self.scans = data;
            $('#scan').html('');
            $('#scan').append(
                $('<option></option>').attr('value', -1).html('-- Select a Scan --')
            ); 
            $('#scanContainer').css({'display': 'block'});
            $.each(self.scans, function() {
                $('#scan').append(
                    $('<option></option>').attr('value', this.id)
                        .html('Map # ' + this.id));
            });
            $('#scan').selectmenu({
                width: 300,
                menuWidth: 450,
                style:'dropdown'
            });
            
            self.getAttachments();
        },
        "json"
    );
};

Match.prototype.assignScan = function() {
    var scanID = $('#scan').val();
    var attachmentID = $('#attachment').val();
    $.get(
        '/scans/attach/',
        {
            scanID: $('#scan').val(),
            attachmentID: $('#attachment').val()
        },
        function(data) {
            alert(data.message);
            $.each(self.scans, function() {
                if(this.id == scanID)
                    this.attachments.push($('#attachment').val());  
            });
        },
        "json"
    );
};


Match.prototype.initSnipDialog=function(opts) {
    //alert(opts.tutorialURL);
    var self = this;
    if(self.snipDialog == null) {
        var $f = $('#snippet_form').css({'display': 'block'}).detach();
        self.snipDialog = $('<div id="snipDialog"></div>')
        .append($f)
        .dialog({
            title: 'Snippet Dialog',
            width: 500,
            height: 300
        });   
    }
    self.snipDialog.dialog('open');
};

Match.prototype.getAttachments = function() {
    var opts = {};
    if($('#print').val() != '-1' && $('#this_print_only').attr('checked'))
        opts.printID = $('#print').val();
    if($('#show_unmatched').attr('checked'))
        opts.unmatched = true;
    $.get(
        '/scans/get-attachments/',
        opts,
        function(data) {
            self.clearCanvas(false);
            self.attachments = data;
            //init attachments:
            $('#attachment').html('');
            $('#attachment').append(
                $('<option></option>').attr('value', -1).html('-- Select an Attachment --')
            ); 
            $.each(self.attachments, function() {
                $('#attachment').append(
                    $('<option></option>').attr('value', this.id)
                        .html(this.name + ' (' + this.id + ')')); 
                
            });
            
            //re-init jquery menu:
            $('#attachment').selectmenu({
                width: 300,
                menuWidth: 450,
                //format: this.selectMenuFormatting,
                style:'dropdown'
            });
        },
        "json"
    );
    
}


/***********/
/* DRAWING */
/***********/

Match.prototype.getMouseXY = function(e)
{
    //alert(self.canvasDiv);
    if (this.ie) 
    {
        this.mouseX = event.clientX + document.body.parentElement.scrollLeft;
        this.mouseY = event.clientY + document.body.parentElement.scrollTop;
    }
    else
    { 
        this.mouseX = e.pageX
        this.mouseY = e.pageY
    }  
    if (this.mouseX < 0){ this.mouseX = 0; }
    if (this.mouseY < 0){ this.mouseY = 0; }  
    this.mouseX = this.mouseX - self.canvasDiv.offsetLeft;
    this.mouseY = this.mouseY - self.canvasDiv.offsetTop;
    return true;
};

Match.prototype.setPenColor = function(color, width) {
    this.col        = new jsColor(color);
    this.pen        = new jsPen(this.col, width);	
};

Match.prototype.drawPoint =function() {
    if(self.snipRect.length == 4)  //already 8 points
        return;
    self.gr.fillRectangle(self.col, new jsPoint(this.mouseX-2, this.mouseY-2),4,4);
    self.snipRect.push(new jsPoint(this.mouseX,this.mouseY));
    self.drawPolygon(self.snipRect);
};

Match.prototype.drawPolygon = function(points) {
    //update point text
    var htmlText = points.length + ' of 4 points digitized';
    if(points.length == 4)
        htmlText = '<img src="/site_media/images/tick.png" \
            style="width:30px;vertical-align:bottom;float:left;margin-top:-8px" />' +
            htmlText;	
    $('#snipRect').html(this.showPoints(points));
    $('#snipRectMessage').html(htmlText);
    
    if(points.length < 2)
        return;
    if(points.length == 4) {
        this.gr.drawPolygon(this.pen,points);
        this.initSnipDialog();
    }
    else {
        this.gr.drawPolyline(this.pen, points);
    }
    if(points.length < 4)
        return;
};

Match.prototype.clearCanvas = function(reloadAttachment)
{
    this.gr.clear();
    $('#snipRectMessage').html("");
    if(reloadAttachment) { 
        var id = $('#attachment').val();
        $.each(self.attachments, function() {
            if(this.id == id) {
                var src = opts.serverURL + this.thumb_path;
                $("<img/>").attr("src", src).appendTo("#editPanel");
            }
        });
    }
};

Match.prototype.showPoints = function(points)
{
    if(points.length == 0)
        return "";
    return JSON.stringify(points);
}

Match.prototype.clearAll = function() {
    this.clearCanvas(true);
    this.snipRect = new Array();
    $('#snipRect').html("");
};
   
Match.prototype.undo = function()
{
    if(this.snipRect.length > 0)
        this.snipRect.pop();
    this.redraw();    
};

Match.prototype.redraw = function()
{
    this.clearCanvas(false);
    this.drawPolygon(this.snipRect, true);
    
    //redraw all points:
    var points = this.snipRect;
    for(var i=0; i < points.length; i++)
        this.gr.fillRectangle(this.col, new jsPoint(points[i].x-2, points[i].y-2),4,4);
};




/*Match = function(opts) {
    this.serverURL = opts.serverURL;
    this.requestObj = { mapRect: new Array(), qrRect: new Array() };
    this.thumbURL = null;
    this.imgURL = null;
    this.canvasDiv = null;
    this.gr = null;
    this.col = null;
    this.pen = null;
    this.mouseX = null;
    this.mouseY = null;
    this.ie = false;
    this.ratio = 1;  
};

Match.prototype.init = function(opts)
{
    this.canvasDiv          = document.getElementById('editPanel');
    this.gr                 = new jsGraphics(this.canvasDiv);
    this.requestObj.mapRect = new Array();
    this.requestObj.qrRect  = new Array();
    this.setPenColor('#ff0000', 2);
    if(document.all)
        this.ie     = true;
    this.canvasDiv.onmousemove  = this.getMouseXY;
    this.canvasDiv.onclick      = this.drawPoint;
    this.showControls(false);

    $('#ddScan').selectmenu({
        menuWidth: 250,
        format: this.selectMenuFormatting,
        style:'dropdown'
    });
    if(opts.scanID)
    {
        $('#ddScan').selectmenu('value', opts.scanID);
        $('#ddScan').trigger('change');
    }
    else
    {
        $('#ddScan').selectmenu('value', '-1');	
    }
};


Match.prototype.drawPolyline = function()
{
    gr.drawPolyline(pen,points);
};

Match.prototype.undo = function()
{
    if(this.requestObj.qrRect.length > 0)
        this.requestObj.qrRect.pop();
    else if(this.requestObj.mapRect.length > 0)
        this.requestObj.mapRect.pop();
    this.redraw();    
};


Match.prototype.redraw = function()
{
    this.clearCanvas();
    
    //redraw corresponding polygons and polylines:
    if(this.requestObj.qrRect.length > 0)
    {
        this.drawPolygon(this.requestObj.mapRect, true);   //draw map polygon
        this.drawPolygon(this.requestObj.qrRect, false);   //draw QR polyline
    }
    else
    {
        this.drawPolygon(this.requestObj.mapRect, true);
        $('#step3').attr("style", "visibility: hidden");
        this.showControls(true);
    }
    
    //redraw all points:
    var points = this.requestObj.mapRect;
    for(var i=0; i < points.length; i++)
        this.gr.fillRectangle(this.col, new jsPoint(points[i].x-2, points[i].y-2),4,4);
    
    points = this.requestObj.qrRect;
    for(var i=0; i < points.length; i++)
        this.gr.fillRectangle(this.col, new jsPoint(points[i].x-2, points[i].y-2),4,4);
    
    $('#step4').attr("style", "visibility: hidden");
};


    
    
Match.prototype.clearAll = function()
{
    this.clearCanvas();
    this.showControls(true);
    this.requestObj.mapRect = new Array();
    this.requestObj.qrRect  = new Array();
    $('#mapRect').html("");
    $('#qrRect').html("");
    $('#qrCode').val("");
};

 
Match.prototype.showPoints = function(points)
{
    if(points.length == 0)
        return "";
    return JSON.stringify(points);
};
    
Match.prototype.showControls = function(show)
{
    if(show)
    {
        $('#clear').attr("style", "visibility: visible");
        $('#undo').attr("style", "visibility: visible");
    }
    else
    {
        $('#clear').attr("style", "visibility: hidden");
        $('#undo').attr("style", "visibility: hidden");    
    }
};


Match.prototype.loadScan = function() {
//alert("loadScan");
    if($('#ddScan').val() == "-1")
        return;
    $.get(
    '/scans/review/' + $('#ddScan').val() + '/json/',
    function(data) {
            //alert(JSON.stringify(data));
            this.thumbURL= this.rootURL + data.id + "/" + data.id + "_thumb.png"
            this.imgURL  = this.rootURL + data.id + "/" + data.file_name
            $("#messagePanel").html('<p>' + data.message + '</p>');
            $("#messagePanelContainer").css({'display': 'block'});
            $("#editPanel").html("");
            $("<img/>").attr("src", this.thumbURL)
                .appendTo("#editPanel");
            $("<br/>").appendTo("#editPanel");  
            $("<a/>").attr("id", "mapScan")
                .attr("href", this.imgURL)
                .attr("target", "_blank")
                .html("View Original")
                .appendTo("#editPanel");
            //$("#editPanel").css({'height': data.height, 'width': data.width});
            //make the next step visible:
            $('#mapRect').html("");
            $("#step2").attr("style", "visibility:visible;");
            
            this.clearAll();
            
            //restore rectangles from the database:
            if(data.map_rect != null)
            {
                var mapRect = eval(data.map_rect);
                this.requestObj.mapRect = mapRect;
            }
            if(data.qr_rect != null)
            {
                var qrRect  = eval(data.qr_rect);
                this.requestObj.qrRect = qrRect;
            }
            //draw the polygons!
            this.redraw();
            
            //make QR code visible if it exists:
            if(data.qr_code != null)
                $('#qrCode').val(data.qr_code);
            if(data.qr_rect != null)
                $('#step4').attr("style", "visibility: visible");
        },
        "json"
    );
};

Match.prototype.submit = function() {
    //alert($('#qrCode').val());
    var params = {
        //scanID: $('#ddScan').val(),
        mapRect: JSON.stringify(this.requestObj.mapRect),
        qrRect: JSON.stringify(this.requestObj.qrRect),
        qrCode: $('#qrCode').val()
    };
    //alert(params);
        $.get(
        '/scans/review/' + $('#ddScan').val() + '/save-data/',
        params,
        function(data) {
            //alert(JSON.stringify(data));
            $('#step1, #step2, #step3, #step4').css({'visibility': 'hidden'});
            $('#clear_controls').css({'display': 'none'});
            $('#messagePanel').html('Your scan has been submitted for re-processing');
            $('#editPanel')
                .css({'width': 500})
                .html('<p>Your scan has been submitted for re-processing. \
             It is currently ' + data.num_in_queue + ' out of ' + data.scans_in_queue +
             ' in line, and should be processed in about ' + data.num_in_queue +
             ' minutes.  When your scan is complete, it should be viewable \
             <a href="' + data.url + '" target="_blank">here</a>.  To submit another scan for \
             re-processing, click <a href="/scans/review/">here</a>.</p>');
        },
        "json"
    );
};*/


    