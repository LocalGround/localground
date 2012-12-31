localground.tableManager = function(){
	this.color = null;
	this.data = [];
};

localground.tableManager.prototype = new localground.manager();

localground.tableManager.prototype.initialize = function(opts) {
    this.color = opts.color;
	localground.manager.prototype.initialize.call(this, opts);
};

localground.tableManager.prototype.addRecords = function(data) {
    var me = this;
	$.each(data, function(){
        me.data.push(new localground.record(this, me.color, me.id));        
    });
};

localground.tableManager.prototype.makeEditable = function() {
	$.each(this.data, function() {
        this.makeEditable();	
    });
};

localground.tableManager.prototype.makeViewable = function() {
	$.each(this.data, function() {
        this.makeViewable();	
    });
};


