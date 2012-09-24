var doDrag = false;
//taken from http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
Zoomer = function(){
    this.isLandscape = true;
    this.cw = null;
    this.ch = null;
    this.cx = 0;
    this.cy = 0;
    this.sf = 1; //scale factor
	this.relative_sf = 1;
};

Zoomer.prototype.initialize = function(opts) {
	
};
function eventPhotoLoaded() {
	startUp();
}

function drawScreen(){
	
	context.drawImage(photo, windowX, windowY,windowWidth,windowHeight,0,0,windowWidth*2,windowHeight*2);
	
	windowX+=10;
	if (windowX>photo.width - windowWidth){
		windowX=photo.width - windowWidth;
	}
	
}

function startUp(){

	setInterval(drawScreen, 100 );
}


Zoomer.prototype.initialize1 = function(opts) {
	//init object variables:
	this.source = {
		$canvas: $('#' + opts.srcCanvasID),
		canvas: $('#' + opts.srcCanvasID).get(0),
		ctx: $('#' + opts.srcCanvasID).get(0).getContext('2d')
	}; 
    this.destination = {
		$canvas: $('#' + opts.destCanvasID),
		canvas: $('#' + opts.destCanvasID).get(0),
		ctx: $('#' + opts.destCanvasID).get(0).getContext('2d')
	};
	//= $('#' + opts.destCanvasID);
    this.srcImage           = $('#' + opts.imageID);
    var self = this;
    var img = this.srcImage.get(0); //document.getElementById('orig');
    var imgWidth = this.srcImage.width(), imgHeight = this.srcImage.height();
    var width = 490.0, height = 490.0, scale_factor = null;
    this.isLandscape = imgWidth > imgHeight;
	//alert(this.isLandscape);
    
    if(this.isLandscape) {
        //scale based on width:
        height = imgHeight * width/imgWidth;
        this.sf = height/imgHeight;
    }
    else {
        width = imgWidth * height/imgHeight;
        this.sf = width/imgWidth;    
    }
    //alert("scale factor: " + scale_factor + ", width: " + width + ", height: " + height);
    var canvases = document.getElementsByTagName('canvas');
    for (var i=0; i<canvases.length; i++) {
		//alert("init canvas"); //needed for Chrome (needs debugging)
        var c = canvases[i];
        var ctx = c.getContext('2d');
        this.cw = img.width;
        this.ch = img.height;
        this.cx = 0;
        this.cy = 0;
        if(this.isLandscape) {
            c.setAttribute('width', this.cw*this.sf);
            c.setAttribute('height', this.ch*this.sf);
        }
        else {
            this.cw = img.height, this.ch = img.width, this.cy = -img.height;
            // reset canvs size:
            c.setAttribute('width', this.cw*this.sf);
            c.setAttribute('height', this.ch*this.sf);
            // rotate
            ctx.rotate(Math.PI/2); 
        }
        ctx.scale(this.sf, this.sf);
		this.debug();
		
        ctx.drawImage(img, this.cx, this.cy); //draw image (use original proportions, not scaled ones)
   
        
    
        //add event listeners:
        c.addEventListener('mousedown',function(evt){
            //alert("mousedown");
			document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
			self.lastX = evt.offsetX || (evt.pageX - c.offsetLeft);
			self.lastY = evt.offsetY || (evt.pageY - c.offsetTop);
			doDrag = true;
			//alert($('#dest_canvas').offset().left + " - " + $('#src_canvas').offset().left);
		},false);
		c.addEventListener('mousemove', function(evt){
			if(!doDrag)
				return;
			var img = self.srcImage.get(0);
			var c = $(this).get(0), ctx = c.getContext('2d');
			lastX = evt.offsetX || (evt.pageX - c.offsetLeft);
			lastY = evt.offsetY || (evt.pageY - c.offsetTop);
			
			//lastX = evt.pageX;
			//lastY = evt.pageY;
			self.destination.ctx.save();
			self.source.ctx.save();
			self.destination.ctx.clearRect(0, 0, self.cw, self.ch);
			self.source.ctx.clearRect(0, 0, self.cw, self.ch);
			if(self.isLandscape) {
				var offset = 0;
				var m = 1; //1/(self.sf*self.relative_sf); //multiplier
				if(c.id == 'dest_canvas')
					offset = self.source.$canvas.offset().left - self.destination.$canvas.offset().left; //500;
				
				self.destination.ctx.drawImage(img, self.cx-1*m*(self.lastX-lastX)-offset, self.cy-1*m*(self.lastY-lastY), self.cw*10, self.ch*10);
				self.source.canvas.getContext('2d').drawImage(img, self.cx-1*m*(self.lastX-lastX)-offset, self.cy-1*m*(self.lastY-lastY));
				self.destination.ctx.restore();
				self.source.ctx.restore()
			}
			else {
				ctx.drawImage(img, self.cx+1*(self.lastY-lastY), self.cy-1*(self.lastX-lastX));
			}
		
		/*$('#output_' + i).html(lastX + "," + lastY + "," +
								   (evt.pageX - c.offsetLeft) + "," + (evt.pageY - c.offsetTop) +
								   self.lastX + "," + self.lastY);*/	
		},false);
		c.addEventListener('mouseup',function(evt){
			lastX = evt.offsetX || (evt.pageX - c.offsetLeft);
			lastY = evt.offsetY || (evt.pageY - c.offsetTop);
			var m = 1; //1/(self.sf*self.relative_sf); //multiplier
			if(self.isLandscape) {
				self.cx = self.cx-1*m*(self.lastX-lastX);
				self.cy = self.cy-1*m*(self.lastY-lastY);
			}
			else {
				self.cx = self.cx-1*m*(self.lastY-lastY);
				self.cy = self.cy-1*m*(self.lastX-lastX);	
			}
			doDrag = false;
		},false);

   
    }
    
}

Zoomer.prototype.debug = function() {
	var debug_string = "scale factor: " + this.sf;
	debug_string += "<br /> relative scale factor: " + this.relative_sf;
	debug_string += "<br /> magnifier: " + 1/(this.relative_sf*this.sf);
	$('#output_0').html(debug_string);
}



Zoomer.prototype.scale = function(direction) {
    var canvases = document.getElementsByTagName('canvas');
    var img = this.srcImage.get(0); //document.getElementById('orig');
    
    var sf = 1;
	if(direction == 'out') {
        sf = this.sf/0.3;
		this.relative_sf/=0.3;
    }
	else {
		var sf = 0.3/this.sf;
		this.relative_sf*=0.3;	
	}
    /*if(direction == 'in')
        this.sf*=2;
    else
        this.sf/=2;*/
    
    //alert(sf);
	this.relative_sf/=sf;
	
	if(direction == 'out') {
		this.sf = this.sf*0.7;
	}
	else {
		this.sf = this.sf/0.7;
	}
	
	this.debug();
    
    for (var i=0; i<canvases.length; i++) {
        var c = canvases[i];
        var ctx = c.getContext('2d');
        //ctx.save();
		ctx.clearRect(0, 0, this.cw, this.ch);
        //ctx.clearRect(this.cx, this.cy, this.cw+1, this.ch+1);
		//alert(this.cx + " - " + this.cy + " - " + this.cw + " - " + this.ch);
        //var imageData = ctx.getImageData(this.cx, this.cy, 200, 200);
        //alert(imageData.width);
        
		//ctx.scale(sf, sf);
		//ctx.drawImage(img, this.cx, this.cy); //draw image (use original proportions, not scaled ones)
		
		
		// Save the current context
		ctx.save();
		// Translate to the center point of our image
		ctx.translate(this.cx+this.cw * 0.5, this.cy+this.ch * 0.5);
		// Perform the scale
		ctx.scale(this.sf, this.sf);
		// Translate back to the top left of our image
		ctx.translate(-this.cw * 0.5, -this.ch * 0.5);
		// Finally we draw the image
		ctx.drawImage(img, this.cx, this.cy);
		// And restore the context ready for the next loop
		ctx.restore();
			
		
		
    }   
}
Zoomer.prototype.zoomIn = function() {
    this.scale('in');   
}

Zoomer.prototype.zoomOut = function() {
    this.scale('out');  
}



