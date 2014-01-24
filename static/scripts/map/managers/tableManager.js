localground.tableManager = function(opts){
	this.color = null;
	this.id = null;
	this.headers = [];
	this.data = [];
	//alert(opts.headers);
	$.extend(this, opts);
	//alert(this.header);
};

localground.tableManager.prototype = new localground.manager();

localground.tableManager.prototype.initialize = function(opts) {
    localground.manager.prototype.initialize.call(this, opts);
};

localground.tableManager.prototype.addRecords = function(data) {
    var me = this;
	$.each(data, function(){
		this.managerID = me.id;
        me.data.push(new localground.record(this, me.color));        
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


