localground.audioManager = function(){
	this.data = [];
};

localground.audioManager.prototype = new localground.manager();

localground.audioManager.prototype.addRecords = function(data) {
    //initialize audio player:
    var me = this;
    $.each(data, function(){
        me.data.push(new localground.audio(this));        
    });
};

localground.audioManager.prototype.doViewportUpdates = function() {
	$.each(this.data, function() {
		if(!this.inView())
			this.getListingElement().hide();
		else
			this.getListingElement().show();
	});
};