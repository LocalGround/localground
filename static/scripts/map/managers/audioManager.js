localground.audioManager = function(id){
	this.id = id;
	this.data = [];
};

localground.audioManager.prototype = new localground.manager();

localground.audioManager.prototype.addRecords = function(data) {
    var me = this;
    $.each(data, function(){
		this.managerID = me.id;
        me.data.push(new localground.audio(this));        
    });
};

localground.audioManager.prototype.doViewportUpdates = function() {
	/*$.each(this.data, function() {
		if(!this.inView())
			this.getListingElement().hide();
		else
			this.getListingElement().show();
	});*/
};