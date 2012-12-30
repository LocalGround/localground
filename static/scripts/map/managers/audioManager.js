localground.audioManager = function(data){
    this.name = 'Audio Files';
    this.id = this.overlayType = self.overlayTypes.AUDIO;
    this.data = [];
    this.player = null;
};

localground.audioManager.prototype = new localground.manager();

localground.audioManager.prototype.addRecords = function(data) {
    //initialize audio player:
    var me = this;
    $.each(data, function(){
        me.data.push(new localground.audio(this));        
    });
    if(this.player == null && this.data.length > 0) {
        this.player = new localground.player();
        $('body').append(this.player.renderFlashObject());
        this.player.initialize();
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