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
    if(self.player == null && this.data.length > 0) {
        self.player = new localground.player();
        $('body').append(self.player.renderFlashObject());
        self.player.initialize();
    }
};

localground.audioManager.prototype.doViewportUpdates = function() {
	$.each(this.data, function() {
		if(!this.inView())
			this.getListingElement().hide();
		else
			this.getListingElement().show();
	});
};