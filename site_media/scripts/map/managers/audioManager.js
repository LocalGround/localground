localground.audioManager = function(data){
    this.name = 'Audio Files';
    this.overlayType = 'audio';
    this.data = [];
    this.player = null;
};

localground.audioManager.prototype = new localground.manager();

localground.audioManager.prototype.addRecords = function(data, opts) {
    //initialize audio player:
    if(this.player == null) {
        this.player = new localground.player();
        $('body').append(this.player.renderFlashObject());
        this.player.initialize();
    }
    var me = this;
    $.each(data, function(){
        if(opts.view_id)
            this.view_id = opts.view_id;
        me.data.push(new localground.audio(this));        
    });
};