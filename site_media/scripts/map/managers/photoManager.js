localground.photoManager = function(data){
    this.name = 'Photos';
    this.overlayType = 'photo';
    this.data = [];
};

localground.photoManager.prototype = new localground.manager();

localground.photoManager.prototype.addRecords = function(data, opts) {
    var me = this;
    $.each(data, function(){
        if(opts.view_id)
            this.view_id = opts.view_id;
        me.data.push(new localground.photo(this));        
    });
};

localground.photoManager.prototype.makeViewable = function() {
	//call default renderer:
	localground.manager.prototype.makeViewable.call(this);
    
    //destroy draggable event handlers:
    $('.thumbsmall').draggable("destroy");
    $('.thumbsmall').removeClass('can_drag').removeClass('ui-draggable').removeClass('activated')
};