var doDrag = false;
//taken from http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
Filters = function(){
    this.isLandscape = true;
    this.cw = null;
    this.ch = null;
    this.cx = 0;
    this.cy = 0;
    this.sf = 1; //scale factor
	this.relative_sf = 1;
};

Filters.prototype.initialize = function(opts) {
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

Filters.prototype.debug = function() {
	var debug_string = "scale factor: " + this.sf;
	debug_string += "<br /> relative scale factor: " + this.relative_sf;
	debug_string += "<br /> magnifier: " + 1/(this.relative_sf*this.sf);
	$('#output_0').html(debug_string);
}



Filters.prototype.scale = function(direction) {
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
Filters.prototype.zoomIn = function() {
    this.scale('in');   
}

Filters.prototype.zoomOut = function() {
    this.scale('out');  
}

Filters.prototype.getPixels = function(img) {
    var c,ctx;
    if (img.getContext) {
        c = img;
        try { ctx = c.getContext('2d'); } catch(e) {}
    }
    if (!ctx) {
        c = this.getCanvas(img.width, img.height);
        ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
    }
    return ctx.getImageData(0,0,c.width,c.height);
};

Filters.prototype.getCanvas = function(w,h) {
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
};

Filters.prototype.filterImage = function(filter, image, var_args) {
    var args = [this.getPixels(image)];
    for (var i=2; i<arguments.length; i++) {
        args.push(arguments[i]);
    }
    return filter.apply(null, args);
};

Filters.prototype.grayscale = function(pixels, args) {
    var d = pixels.data;
    for (var i=0; i<d.length; i+=4) {
        var r = d[i];
        var g = d[i+1];
        var b = d[i+2];
        // CIE luminance for the RGB
        var v = 0.2126*r + 0.7152*g + 0.0722*b;
        d[i] = d[i+1] = d[i+2] = v
    }
    return pixels;
};

Filters.brightness = function(pixels, adjustment) {
    var d = pixels.data;
    for (var i=0; i<d.length; i+=4) {
        d[i] += adjustment;
        d[i+1] += adjustment;
        d[i+2] += adjustment;
    }
    return pixels;
};

Filters.prototype.threshold = function(pixels, threshold) {
    var d = pixels.data;
    for (var i=0; i<d.length; i+=4) {
        var r = d[i];
        var g = d[i+1];
        var b = d[i+2];
        var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
        d[i] = d[i+1] = d[i+2] = v
      }
    return pixels;
};



Filters.prototype.runFilter = function(elem, id, filter, arg1, arg2, arg3) {
    var c = document.getElementById(id);
    //var s = c.previousSibling.style;
    var b = elem; // c.parentNode.getElementsByTagName('button')[0];
    //alert(b);
    if (b.originalText == null) {
        b.originalText = b.textContent;
    }
    var c = document.getElementsByTagName('canvas')[0];
    var ctx = c.getContext('2d');
        
    
    if(b.textContent != 'Restore original image') {
        //ctx = c.getContext('2d');
        var idata = Filters.filterImage(filter, c, arg1, arg2, arg3);
        //c.width = idata.width / 8;
        //c.height = idata.height / 8;
        ctx.putImageData(idata, 0, 0);
        c.style.display = 'inline';
        b.textContent = 'Restore original image';
    }
    else {
        ctx.drawImage(img, 0, 0);    
        b.textContent = b.originalText;
    }
};

Filters.prototype.grayscale = function(elem) {
    this.runFilter(elem, 'the_canvas', this.grayscale);
};

Filters.prototype.brightness = function(elem) {
    this.runFilter(elem, 'the_canvas', this.brightness, 40);
};

Filters.prototype.threshold = function(elem) {
    this.runFilter(elem, 'the_canvas', this.threshold, parseInt($('#threshold').val()));
};

Filters.prototype.sharpen = function() {
    this.runFilter(this, 'sharpen', this.convolute,
        [ 0, -1,  0,
          -1,  5, -1,
          0, -1,  0]);
};

Filters.prototype.blurC = function() {
    this.runFilter('blurC', this.convolute,
        [ 1/9, 1/9, 1/9,
          1/9, 1/9, 1/9,
          1/9, 1/9, 1/9 ]);
};

Filters.prototype.sobel = function() {
    this.runFilter('sobel', function(px) {
        px = this.grayscale(px);
        var vertical = this.convoluteFloat32(px,
            [-1,-2,-1,
              0, 0, 0,
              1, 2, 1]);
        var horizontal = this.convoluteFloat32(px,
            [-1,0,1,
             -2,0,2,
             -1,0,1]);
        var id = this.createImageData(vertical.width, vertical.height);
        for (var i=0; i<id.data.length; i+=4) {
            var v = Math.abs(vertical.data[i]);
            id.data[i] = v;
            var h = Math.abs(horizontal.data[i]);
            id.data[i+1] = h
            id.data[i+2] = (v+h)/4;
            id.data[i+3] = 255;
        }
        return id;
    });
};

Filters.prototype.custom = function() {
    var inputs = document.getElementById('customMatrix').getElementsByTagName('input');
    var arr = [];
    for (var i=0; i<inputs.length; i++) {
        arr.push(parseFloat(inputs[i].value));
    }
    this.runFilter('custom', this.convolute, arr, true);
};
