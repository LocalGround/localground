localground.photoManager = function(id){
	this.data = [];
	this.id = id;
};

localground.photoManager.prototype = new localground.manager();

localground.photoManager.prototype.addRecords = function(data) {
    var me = this;
    $.each(data, function(){
		this.managerID = me.id;
        me.data.push(new localground.photo(this));        
    });
};

localground.photoManager.prototype.makeViewable = function() {
	//call default renderer:
	localground.manager.prototype.makeViewable.call(this);
    
    //destroy draggable event handlers:
	try {
        $('.thumbsmall').removeClass('can_drag').removeClass('ui-draggable').removeClass('activated')
		$('.thumbsmall').draggable("destroy");
	} catch(e) {
		//alert(e);
	}
    
};

localground.photoManager.prototype.doViewportUpdates = function() {
	
	$.each(this.data, function() {
		this.setImageIcon();
		/*if(!this.inView())
			this.getListingElement().hide();
		else
			this.getListingElement().show();
		*/
	});
	
};